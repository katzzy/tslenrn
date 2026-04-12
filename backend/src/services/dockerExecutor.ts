import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as os from 'os';
import { ExecutionFailure } from '../types/execution';
import type { ExecutionOutput } from '../types/execution';

const execPromise = promisify(exec);

interface ExecutionOptions {
  timeout?: number;
  maxOutputLength?: number;
  stdin?: string;
}

export class DockerExecutor {
  private readonly timeout: number;
  private readonly maxOutputLength: number;
  private readonly imageName: string;

  constructor() {
    const configuredTimeout = Number.parseInt(process.env.EXECUTION_TIMEOUT || '5000', 10);
    const configuredMaxOutput = Number.parseInt(process.env.MAX_OUTPUT_LENGTH || '10000', 10);
    this.timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 5000;
    this.maxOutputLength = Number.isFinite(configuredMaxOutput) && configuredMaxOutput > 0 ? configuredMaxOutput : 10000;
    this.imageName = process.env.DOCKER_IMAGE || 'tslenrn-executor:latest';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionOutput> {
    const timeout = options.timeout || this.timeout;
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tslenrn-'));
    const codeFile = path.join(tempDir, 'code.ts');
    const inputFile = path.join(tempDir, 'input.txt');
    
    try {
      await fs.writeFile(codeFile, code);
      await fs.writeFile(inputFile, options.stdin ?? '');
      
      const startTime = Date.now();
      
      const dockerCommand = `docker run --rm \
        --network none \
        --memory="128m" \
        --cpus="0.5" \
        --pids-limit=32 \
        -v "${codeFile}:/code.ts:ro" \
        -v "${inputFile}:/input.txt:ro" \
        ${this.imageName} \
        sh -c "tsx /code.ts < /input.txt"`;

      try {
        const { stdout, stderr } = await execPromise(dockerCommand, {
          timeout,
          maxBuffer: this.maxOutputLength,
        });

        const executionTime = Date.now() - startTime;
        const output = stdout.slice(0, this.maxOutputLength);
        const stderrOutput = stderr.slice(0, this.maxOutputLength);

        return {
          output,
          stderr: stderrOutput || undefined,
          executionTime,
        };
      } catch (execError: unknown) {
        const executionTime = Date.now() - startTime;
        const errorWithOutput = execError as Error & { stdout?: string; stderr?: string; killed?: boolean };
        const errorText = errorWithOutput.stderr || errorWithOutput.message;
        const truncatedOutput = errorWithOutput.stdout?.slice(0, this.maxOutputLength);

        if (errorWithOutput.killed || /timeout/i.test(errorText)) {
          throw new ExecutionFailure(`Execution timeout after ${timeout}ms`, {
            output: truncatedOutput,
            executionTime,
          });
        }

        throw new ExecutionFailure(errorText, {
          output: truncatedOutput,
          executionTime,
        });
      }
    } finally {
      try {
        await fs.rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error('Failed to cleanup temp directory:', cleanupError);
      }
    }
  }

  async testDocker(): Promise<boolean> {
    try {
      await execPromise(`docker run --rm ${this.imageName} node --version`);
      return true;
    } catch (error) {
      console.error('Docker self-test failed:', error);
      return false;
    }
  }
}

export const dockerExecutor = new DockerExecutor();
