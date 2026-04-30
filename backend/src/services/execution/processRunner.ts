import { spawn } from 'child_process';
import { ExecutionFailure } from '../../types/execution';

export interface ProcessResult {
  stdout: string;
  stderr: string;
  exitCode: number;
}

export interface ProcessRunOptions {
  timeout: number;
  maxOutputLength: number;
  stdin?: string;
  cwd?: string;
}

export const runProcess = async (
  command: string,
  args: string[],
  options: ProcessRunOptions
): Promise<ProcessResult> =>
  new Promise<ProcessResult>((resolve, reject) => {
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
      reject(
        new ExecutionFailure(`Failed to start process "${command}": ${error.message}`, {
          code: 'PROCESS_START_FAILED',
        })
      );
    });

    child.on('close', (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeoutHandle);

      if (timedOut) {
        reject(
          new ExecutionFailure(`Execution timeout after ${options.timeout}ms`, {
            output: stdout,
            code: 'EXECUTION_TIMEOUT',
          })
        );
        return;
      }

      if (outputExceeded) {
        reject(
          new ExecutionFailure(`Execution output exceeded ${options.maxOutputLength} characters`, {
            output: stdout,
            code: 'OUTPUT_TOO_LARGE',
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
