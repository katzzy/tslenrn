import test from 'node:test';
import assert from 'node:assert/strict';
import { ExecutionFailure } from '../../types/execution';
import { RuntimeModePolicy } from './runtimeModePolicy';

test('auto mode uses docker when docker is available', () => {
  const policy = new RuntimeModePolicy({
    defaultExecutorMode: 'auto',
    allowUnsafeLocalFallback: false,
  });
  assert.equal(policy.resolveMode({ dockerAvailable: true }), 'docker');
});

test('auto mode rejects local fallback when docker is unavailable and fallback disabled', () => {
  const policy = new RuntimeModePolicy({
    defaultExecutorMode: 'auto',
    allowUnsafeLocalFallback: false,
  });

  assert.throws(() => policy.resolveMode({ dockerAvailable: false }), (error: unknown) => {
    assert.ok(error instanceof ExecutionFailure);
    assert.equal(error.code, 'LOCAL_FALLBACK_DISABLED');
    return true;
  });
});

test('explicit local mode bypasses automatic fallback gate', () => {
  const policy = new RuntimeModePolicy({
    defaultExecutorMode: 'auto',
    allowUnsafeLocalFallback: false,
  });
  assert.equal(policy.resolveMode({ requestedMode: 'local', dockerAvailable: false }), 'local');
});

test('explicit docker mode requires docker availability', () => {
  const policy = new RuntimeModePolicy({
    defaultExecutorMode: 'auto',
    allowUnsafeLocalFallback: true,
  });

  assert.throws(
    () => policy.resolveMode({ requestedMode: 'docker', dockerAvailable: false }),
    (error: unknown) => {
      assert.ok(error instanceof ExecutionFailure);
      assert.equal(error.code, 'DOCKER_UNAVAILABLE');
      return true;
    }
  );
});
