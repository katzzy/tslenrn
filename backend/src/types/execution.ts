export interface ExecutionOutput {
  output: string;
  stderr?: string;
  executionTime: number;
}

interface ExecutionFailureOptions {
  output?: string;
  executionTime?: number;
}

export class ExecutionFailure extends Error {
  readonly output?: string;
  readonly executionTime?: number;

  constructor(message: string, options: ExecutionFailureOptions = {}) {
    super(message);
    this.name = 'ExecutionFailure';
    this.output = options.output;
    this.executionTime = options.executionTime;
  }
}
