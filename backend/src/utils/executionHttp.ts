import { ExecutionFailure } from '../types/execution';
import { HttpError } from './http';

const executionFailureStatusCodeByCode: Record<string, number> = {
  TYPESCRIPT_COMPILATION_FAILED: 422,
  LOCAL_EXECUTION_FAILED: 422,
  DOCKER_EXECUTION_FAILED: 422,
  EXECUTION_TIMEOUT: 422,
  OUTPUT_TOO_LARGE: 422,
  DOCKER_UNAVAILABLE: 503,
  LOCAL_FALLBACK_DISABLED: 503,
  TYPESCRIPT_RUNTIME_MISSING: 503,
  PROCESS_START_FAILED: 503,
};

export const toExecutionHttpError = (failure: ExecutionFailure): HttpError => {
  const statusCode = executionFailureStatusCodeByCode[failure.code] ?? 500;
  return new HttpError(statusCode, failure.message, failure.code);
};
