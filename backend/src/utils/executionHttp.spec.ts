import test from 'node:test';
import assert from 'node:assert/strict';
import { ExecutionFailure } from '../types/execution';
import { toExecutionHttpError } from './executionHttp';

test('toExecutionHttpError maps user code failures to 422', () => {
  const error = toExecutionHttpError(
    new ExecutionFailure('Compilation failed', { code: 'TYPESCRIPT_COMPILATION_FAILED' })
  );

  assert.equal(error.statusCode, 422);
  assert.equal(error.code, 'TYPESCRIPT_COMPILATION_FAILED');
});

test('toExecutionHttpError maps runtime availability failures to 503', () => {
  const error = toExecutionHttpError(new ExecutionFailure('Docker unavailable', { code: 'DOCKER_UNAVAILABLE' }));

  assert.equal(error.statusCode, 503);
  assert.equal(error.code, 'DOCKER_UNAVAILABLE');
});

test('toExecutionHttpError maps unknown failures to 500', () => {
  const error = toExecutionHttpError(new ExecutionFailure('Unexpected', { code: 'UNKNOWN_EXEC_ERROR' }));

  assert.equal(error.statusCode, 500);
  assert.equal(error.code, 'UNKNOWN_EXEC_ERROR');
});
