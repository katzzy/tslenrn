import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveTestConcurrency } from './testRunner';

const withEnv = (key: string, value: string | undefined, fn: () => void) => {
  const previous = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }

  try {
    fn();
  } finally {
    if (previous === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = previous;
    }
  }
};

test('resolveTestConcurrency falls back to default when config is invalid', () => {
  withEnv('TEST_CONCURRENCY', 'invalid', () => {
    assert.equal(resolveTestConcurrency(), 2);
  });
});

test('resolveTestConcurrency clamps to safe max', () => {
  withEnv('TEST_CONCURRENCY', '100', () => {
    assert.equal(resolveTestConcurrency(), 8);
  });
});

test('resolveTestConcurrency returns valid configured value', () => {
  withEnv('TEST_CONCURRENCY', '4', () => {
    assert.equal(resolveTestConcurrency(), 4);
  });
});
