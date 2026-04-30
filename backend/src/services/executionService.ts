import { dockerExecutor } from './dockerExecutor';
import { ExecutionFailure } from '../types/execution';
import type { ExecutorMode } from '../types/executor';

interface ExecuteResponse {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export const executeUserCode = async (
  code: string,
  stdin: string,
  executorMode?: ExecutorMode
): Promise<ExecuteResponse> => {
  try {
    const result = await dockerExecutor.execute(code, { stdin, executorMode });
    return {
      success: true,
      output: result.output,
      executionTime: result.executionTime,
    };
  } catch (error: unknown) {
    if (error instanceof ExecutionFailure) {
      return {
        success: false,
        output: error.output,
        error: error.message,
        executionTime: error.executionTime,
      };
    }
    throw error;
  }
};
