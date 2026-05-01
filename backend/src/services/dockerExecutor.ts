import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { ExecutionFailure } from '../types/execution';
import type { ExecutionOutput } from '../types/execution';
import type { ExecutorCapabilities, ExecutorMode } from '../types/executor';
import { DockerAvailabilityProbe } from './execution/dockerAvailabilityProbe';
import { executeInDocker } from './execution/dockerRuntime';
import { executeLocally } from './execution/localRuntime';
import { RuntimeModePolicy } from './execution/runtimeModePolicy';

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
  private readonly availabilityProbe: DockerAvailabilityProbe;
  private readonly runtimeModePolicy: RuntimeModePolicy;

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
    this.availabilityProbe = new DockerAvailabilityProbe();
    this.runtimeModePolicy = new RuntimeModePolicy({
      defaultExecutorMode: this.defaultExecutorMode,
      allowUnsafeLocalFallback: this.allowUnsafeLocalFallback,
    });
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
      const dockerAvailable = await this.availabilityProbe.isDockerAvailable();
      const runtimeMode = this.runtimeModePolicy.resolveMode({
        requestedMode,
        dockerAvailable,
      });
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
      dockerAvailable: await this.availabilityProbe.isDockerAvailable(),
      allowUnsafeLocalFallback: this.allowUnsafeLocalFallback,
      supportedModes: ['auto', 'docker', 'local'],
    };
  }

  async testDocker(): Promise<boolean> {
    return this.availabilityProbe.isDockerAvailable();
  }
}

export const dockerExecutor = new DockerExecutor();
