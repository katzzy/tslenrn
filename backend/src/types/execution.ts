export interface ExecutionOutput {
  output: string;
  stderr?: string;
  executionTime: number;
}

interface ExecutionFailureOptions {
  output?: string;
  executionTime?: number;
  code?: string;
}

export class ExecutionFailure extends Error {
  readonly output?: string;
  readonly executionTime?: number;
  readonly code: string;

  constructor(message: string, options: ExecutionFailureOptions = {}) {
    super(message);
    this.name = 'ExecutionFailure';
    this.output = options.output;
    this.executionTime = options.executionTime;
    this.code = options.code ?? 'EXECUTION_FAILED';
  }
}
