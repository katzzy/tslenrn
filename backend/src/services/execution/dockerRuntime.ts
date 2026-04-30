import { ExecutionFailure } from '../../types/execution';
import type { ExecutionOutput } from '../../types/execution';
import { runProcess } from './processRunner';

export interface DockerRuntimeOptions {
  imageName: string;
  codeFile: string;
  inputFile: string;
  timeout: number;
  maxOutputLength: number;
}

export const executeInDocker = async (options: DockerRuntimeOptions): Promise<ExecutionOutput> => {
  const result = await runProcess(
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
      `${options.codeFile}:/code.ts:ro`,
      '-v',
      `${options.inputFile}:/input.txt:ro`,
      options.imageName,
      'sh',
      '-c',
      'esbuild /code.ts --platform=node --target=node18 --format=cjs --log-level=error --outfile=/tmp/code.js && node /tmp/code.js < /input.txt',
    ],
    {
      timeout: options.timeout,
      maxOutputLength: options.maxOutputLength,
    }
  );

  if (result.exitCode !== 0) {
    throw new ExecutionFailure(result.stderr || `Execution failed with exit code ${result.exitCode}`, {
      output: result.stdout,
      code: 'DOCKER_EXECUTION_FAILED',
    });
  }

  return {
    output: result.stdout,
    stderr: result.stderr || undefined,
    executionTime: 0,
  };
};
