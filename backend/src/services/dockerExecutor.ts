import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { ExecutionFailure } from '../types/execution';
import type { ExecutionOutput } from '../types/execution';
import type { ExecutorCapabilities, ExecutorMode } from '../types/executor';
import { executeInDocker } from './execution/dockerRuntime';
import { executeLocally } from './execution/localRuntime';
import { runProcess } from './execution/processRunner';

interface ExecutionOptions {
  timeout?: number;
  maxOutputLength?: number;
  stdin?: string;
  executorMode?: ExecutorMode;
}

export class DockerExecutor {
  private readonly timeout: number;
  private readonly maxOutputLength: number;
  private readonly imageName: string;
  private readonly defaultExecutorMode: ExecutorMode;
  private readonly allowUnsafeLocalFallback: boolean;
  private dockerAvailableCache: boolean | null = null;

  constructor() {
    const configuredTimeout = Number.parseInt(process.env.EXECUTION_TIMEOUT || '5000', 10);
    const configuredMaxOutput = Number.parseInt(process.env.MAX_OUTPUT_LENGTH || '10000', 10);
    const configuredMode = (process.env.EXECUTOR_MODE ?? 'auto').toLowerCase();

    this.timeout = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 5000;
    this.maxOutputLength =
      Number.isFinite(configuredMaxOutput) && configuredMaxOutput > 0 ? configuredMaxOutput : 10000;
    this.imageName = process.env.DOCKER_IMAGE || 'tslenrn-executor:latest';
    this.defaultExecutorMode =
      configuredMode === 'docker' || configuredMode === 'local' ? configuredMode : 'auto';
    this.allowUnsafeLocalFallback =
      (process.env.ALLOW_UNSAFE_LOCAL_EXECUTION ?? 'false').toLowerCase() === 'true';
  }

  private async isDockerAvailable(): Promise<boolean> {
    if (this.dockerAvailableCache !== null) {
      return this.dockerAvailableCache;
    }

    try {
      const result = await runProcess('docker', ['version', '--format', '{{.Server.Version}}'], {
        timeout: 3000,
        maxOutputLength: 2000,
      });
      this.dockerAvailableCache = result.exitCode === 0;
    } catch {
      this.dockerAvailableCache = false;
    }

    return this.dockerAvailableCache;
  }

  private async resolveRuntimeMode(requestedMode?: ExecutorMode): Promise<'docker' | 'local'> {
    const selectedMode = requestedMode ?? this.defaultExecutorMode;

    if (selectedMode === 'docker') {
      if (!(await this.isDockerAvailable())) {
        throw new ExecutionFailure('Executor mode is docker but Docker is unavailable.', {
          code: 'DOCKER_UNAVAILABLE',
        });
      }
      return 'docker';
    }

    if (selectedMode === 'local') {
      return 'local';
    }

    return (await this.isDockerAvailable()) ? 'docker' : 'local';
  }

  async execute(code: string, options: ExecutionOptions = {}): Promise<ExecutionOutput> {
    const timeout = options.timeout ?? this.timeout;
    const maxOutputLength = options.maxOutputLength ?? this.maxOutputLength;
    const stdin = options.stdin ?? '';
    const requestedMode = options.executorMode;
    const tempDir = await fs.mkdtemp(path.join(os.tmpdir(), 'tslenrn-'));
    const codeFile = path.join(tempDir, 'code.ts');
    const inputFile = path.join(tempDir, 'input.txt');

    try {
      await fs.writeFile(codeFile, code);
      await fs.writeFile(inputFile, stdin);

      const startTime = Date.now();
      const runtimeMode = await this.resolveRuntimeMode(requestedMode);
      const result =
        runtimeMode === 'docker'
          ? await executeInDocker({
              imageName: this.imageName,
              codeFile,
              inputFile,
              timeout,
              maxOutputLength,
            })
          : await executeLocally({
              code,
              stdin,
              tempDir,
              timeout,
              maxOutputLength,
              allowUnsafeLocalFallback: this.allowUnsafeLocalFallback,
              forceLocalByRequest: requestedMode === 'local',
            });

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

  async getCapabilities(): Promise<ExecutorCapabilities> {
    return {
      defaultMode: this.defaultExecutorMode,
      dockerAvailable: await this.isDockerAvailable(),
      allowUnsafeLocalFallback: this.allowUnsafeLocalFallback,
    };
  }

  async testDocker(): Promise<boolean> {
    return this.isDockerAvailable();
  }
}

export const dockerExecutor = new DockerExecutor();
