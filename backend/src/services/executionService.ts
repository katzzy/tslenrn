import { dockerExecutor } from './dockerExecutor';
import type { ExecutionOutput } from '../types/execution';
import type { ExecutorMode } from '../types/executor';

export const executeUserCode = async (
  code: string,
  stdin: string,
  executorMode?: ExecutorMode
): Promise<ExecutionOutput> => dockerExecutor.execute(code, { stdin, executorMode });
