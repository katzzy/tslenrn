import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateCode,
  validateOptionalInput,
  validateProblemId,
  validateProblemIdParam,
} from './validation';
import { HttpError } from './http';

test('validateCode accepts non-empty string under max size', () => {
  assert.equal(validateCode('const x = 1;'), 'const x = 1;');
});

test('validateCode rejects empty value', () => {
  assert.throws(() => validateCode(''), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.statusCode, 400);
    return true;
  });
});

test('validateOptionalInput returns empty string for undefined', () => {
  assert.equal(validateOptionalInput(undefined), '');
});

test('validateOptionalInput rejects non-string', () => {
  assert.throws(() => validateOptionalInput(123), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.statusCode, 400);
    return true;
  });
});

test('validateProblemId accepts positive integer', () => {
  assert.equal(validateProblemId(3), 3);
});

test('validateProblemId rejects invalid value', () => {
  assert.throws(() => validateProblemId(0), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.statusCode, 400);
    return true;
  });
});

test('validateProblemIdParam parses string integer', () => {
  assert.equal(validateProblemIdParam('42'), 42);
});

test('validateProblemIdParam rejects invalid string', () => {
  assert.throws(() => validateProblemIdParam('abc'), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.statusCode, 400);
    return true;
  });
});
