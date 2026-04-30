import { spawn } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import type { Diagnostic } from 'typescript';
import { ExecutionFailure } from '../types/execution';
import type { ExecutionOutput } from '../types/execution';

type TypeScriptModule = typeof import('typescript');
type ExecutorMode = 'auto' | 'docker' | 'local';

interface ExecutionOptions {
  timeout?: number;
  maxOutputLength?: number;
  stdin?: string;
}

interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export class DockerExecutor {
  private readonly timeout: number;
  private readonly maxOutputLength: number;
  private readonly imageName: string;
  private readonly executorMode: ExecutorMode;
  private readonly allowUnsafeLocalExecution: boolean;
  private dockerAvailableCache: boolean | null = null;

  constructor() {
    const configuredTimeout = Number.parseInt(process.env.EXECUTION_TIMEOUT || '5000', 10);
    const configuredMaxOutput = Number.parseInt(process.env.MAX_OUTPUT_LENGTH || '10000', 10);
    const configuredMode = (process.env.EXECUTOR_MODE ?? 'auto').toLowerCase();

    this.timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 5000;
    this.maxOutputLength = Number.isFinite(configuredMaxOutput) && configuredMaxOutput > 0 ? configuredMaxOutput : 10000;
    this.imageName = process.env.DOCKER_IMAGE || 'tslenrn-executor:latest';
    this.executorMode =
      configuredMode === 'docker' || configuredMode === 'local' ? configuredMode : 'auto';
    this.allowUnsafeLocalExecution =
      (process.env.ALLOW_UNSAFE_LOCAL_EXECUTION ?? 'false').toLowerCase() === 'true';
  }

  private async runProcess(
    command: string,
    args: string[],
    options: {
      timeout: number;
      maxOutputLength: number;
      stdin?: string;
      cwd?: string;
    }
  ): Promise<ProcessResult> {
    return new Promise<ProcessResult>((resolve, reject) => {
      const child = spawn(command, args, {
        stdio: ['pipe', 'pipe', 'pipe'],
        cwd: options.cwd,
      });

      let stdout = '';
      let stderr = '';
      let timedOut = false;
      let outputExceeded = false;
      let settled = false;

      const trimToMaxLength = (value: string): string => value.slice(0, options.maxOutputLength);

      const appendOutput = (target: 'stdout' | 'stderr', chunk: Buffer) => {
        if (outputExceeded) {
          return;
        }

        const current = target === 'stdout' ? stdout : stderr;
        const next = trimToMaxLength(current + chunk.toString('utf8'));
        if (target === 'stdout') {
          stdout = next;
        } else {
          stderr = next;
        }

        if (stdout.length + stderr.length >= options.maxOutputLength) {
          outputExceeded = true;
          child.kill('SIGKILL');
        }
      };

      const timeoutHandle = setTimeout(() => {
        timedOut = true;
        child.kill('SIGKILL');
      }, options.timeout);

      child.stdout.on('data', (chunk: Buffer) => appendOutput('stdout', chunk));
      child.stderr.on('data', (chunk: Buffer) => appendOutput('stderr', chunk));

      child.on('error', (error) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutHandle);
        reject(new ExecutionFailure(`Failed to start process "${command}": ${error.message}`));
      });

      child.on('close', (code) => {
        if (settled) return;
        settled = true;
        clearTimeout(timeoutHandle);

        if (timedOut) {
          reject(
            new ExecutionFailure(`Execution timeout after ${options.timeout}ms`, {
              output: stdout,
            })
          );
          return;
        }

        if (outputExceeded) {
          reject(
            new ExecutionFailure(`Execution output exceeded ${options.maxOutputLength} characters`, {
              output: stdout,
            })
          );
          return;
        }

        resolve({
          stdout,
          stderr,
          exitCode: code ?? -1,
        });
      });

      if (options.stdin !== undefined) {
        child.stdin.write(options.stdin);
      }
      child.stdin.end();
    });
  }

  private async isDockerAvailable(): Promise<boolean> {
    if (this.dockerAvailableCache !== null) {
      return this.dockerAvailableCache;
    }

    try {
      const result = await this.runProcess('docker', ['version', '--format', '{{.Server.Version}}'], {
        timeout: 3000,
        maxOutputLength: 2000,
      });
      this.dockerAvailableCache = result.exitCode === 0;
    } catch {
      this.dockerAvailableCache = false;
    }

    return this.dockerAvailableCache;
  }

  private getCompilationFailureMessage(
    diagnostics: Diagnostic[],
    ts: TypeScriptModule
  ): string {
    const lines = diagnostics.slice(0, 5).map((diagnostic) => {
      const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n');
      return `TS${diagnostic.code}: ${message}`;
    });

    return lines.join('\n');
  }

  private async compileTypeScriptLocally(code: string, targetFile: string): Promise<void> {
    let ts: TypeScriptModule;
    try {
      ts = await import('typescript');
    } catch {
      throw new ExecutionFailure(
        'Local execution requires TypeScript runtime support. Install backend dev dependencies or use Docker execution.'
      );
    }

    const compiled = ts.transpileModule(code, {
      fileName: 'code.ts',
      reportDiagnostics: true,
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2020,
        esModuleInterop: true,
      },
    });

    const hasErrors =
      compiled.diagnostics?.some((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error) ??
      false;
    if (hasErrors) {
      throw new ExecutionFailure(this.getCompilationFailureMessage(compiled.diagnostics ?? [], ts));
    }

    await fs.writeFile(targetFile, compiled.outputText);
  }

  private async executeInDocker(
    codeFile: string,
    inputFile: string,
    timeout: number,
    maxOutputLength: number
  ): Promise<ExecutionOutput> {
    const result = await this.runProcess(
      'docker',
      [
        'run',
        '--rm',
        '--network',
        'none',
        '--memory=128m',
        '--cpus=0.5',
        '--pids-limit=32',
        '-v',
        `${codeFile}:/code.ts:ro`,
        '-v',
        `${inputFile}:/input.txt:ro`,
        this.imageName,
        'sh',
        '-c',
        'esbuild /code.ts --platform=node --target=node18 --format=cjs --log-level=error --outfile=/tmp/code.js && node /tmp/code.js < /input.txt',
      ],
      {
        timeout,
        maxOutputLength,
      }
    );

    if (result.exitCode !== 0) {
      throw new ExecutionFailure(result.stderr || `Execution failed with exit code ${result.exitCode}`, {
        output: result.stdout,
      });
    }

    return {
      output: result.stdout,
      stderr: result.stderr || undefined,
      executionTime: 0,
    };
  }

  private async executeLocally(
    code: string,
    stdin: string,
    tempDir: string,
    timeout: number,
    maxOutputLength: number
  ): Promise<ExecutionOutput> {
    if (!this.allowUnsafeLocalExecution) {
      throw new ExecutionFailure(
        'Docker is unavailable and local execution fallback is disabled (set ALLOW_UNSAFE_LOCAL_EXECUTION=true to opt in).'
      );
    }

    const compiledFile = path.join(tempDir, 'code.js');
    await this.compileTypeScriptLocally(code, compiledFile);

    const result = await this.runProcess(process.execPath, [compiledFile], {
      timeout,
      maxOutputLength,
      stdin,
      cwd: tempDir,
    });

    if (result.exitCode !== 0) {
      throw new ExecutionFailure(result.stderr || `Execution failed with exit code ${result.exitCode}`, {
        output: result.stdout,
      });
    }

    return {
      output: result.stdout,
      stderr: result.stderr || undefined,
      executionTime: 0,
    };
  }

  private async resolveExecutionMode(): Promise<'docker' | 'local'> {
    if (this.executorMode === 'docker') {
      if (!(await this.isDockerAvailable())) {
        throw new ExecutionFailure('Executor mode is docker but Docker is unavailable.');
      }
      return 'docker';
    }

    if (this.executorMode === 'local') {
      return 'local';
    }
    const dockerAvailable = await this.isDockerAvailable();
    return dockerAvailable ? 'docker' : 'local';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionOutput> {
    const timeout = options.timeout ?? this.timeout;
    const maxOutputLength = options.maxOutputLength ?? this.maxOutputLength;
    const stdin = options.stdin ?? '';
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tslenrn-'));
    const codeFile = path.join(tempDir, 'code.ts');
    const inputFile = path.join(tempDir, 'input.txt');

    try {
      await fs.writeFile(codeFile, code);
      await fs.writeFile(inputFile, stdin);

      const startTime = Date.now();
      const mode = await this.resolveExecutionMode();
      const result =
        mode === 'docker'
          ? await this.executeInDocker(codeFile, inputFile, timeout, maxOutputLength)
          : await this.executeLocally(code, stdin, tempDir, timeout, maxOutputLength);

      return {
        ...result,
        executionTime: Date.now() - startTime,
      };
    } catch (error: unknown) {
      if (error instanceof ExecutionFailure) {
        throw error;
      }
      throw new ExecutionFailure(error instanceof Error ? error.message : 'Execution failed');
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
  }

  async testDocker(): Promise<boolean> {
    return this.isDockerAvailable();
  }
}

export const dockerExecutor = new DockerExecutor();
