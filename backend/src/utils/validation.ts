import { HttpError } from './http';
import type { ExecutorMode } from '../types/executor';

const MAX_CODE_LENGTH = 50_000;

export const validateCode = (code: unknown): string => {
  if (typeof code !== 'string' || code.length === 0) {
    throw new HttpError(400, 'Code is required and must be a string', 'INVALID_CODE');
  }

  if (code.length > MAX_CODE_LENGTH) {
    throw new HttpError(400, 'Code is too long (max 50KB)', 'CODE_TOO_LARGE');
  }

  return code;
};

export const validateOptionalInput = (input: unknown): string => {
  if (input === undefined) {
    return '';
  }

  if (typeof input !== 'string') {
    throw new HttpError(400, 'Input must be a string', 'INVALID_INPUT');
  }

  return input;
};

export const validateProblemId = (problemId: unknown): number => {
  if (typeof problemId !== 'number' || !Number.isInteger(problemId) || problemId <= 0) {
    throw new HttpError(400, 'Problem ID is required and must be a positive integer', 'INVALID_PROBLEM_ID');
  }

  return problemId;
};

export const validateProblemIdParam = (raw: string | string[]): number => {
  const normalizedRaw = Array.isArray(raw) ? raw[0] : raw;
  const id = Number.parseInt(normalizedRaw, 10);

  if (!Number.isInteger(id) || id <= 0) {
    throw new HttpError(400, 'Problem ID must be a positive integer', 'INVALID_PROBLEM_ID');
  }

  return id;
};

export const validateOptionalExecutorMode = (value: unknown): ExecutorMode | undefined => {
  if (value === undefined) {
    return undefined;
  }

  if (value === 'auto' || value === 'docker' || value === 'local') {
    return value;
  }

  throw new HttpError(400, 'Executor mode must be one of: auto, docker, local', 'INVALID_EXECUTOR_MODE');
};
