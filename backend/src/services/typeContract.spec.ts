import test from 'node:test';
import assert from 'node:assert/strict';
import type {
  ExecutorCapabilities as SharedExecutorCapabilities,
  ExecutorMode as SharedExecutorMode,
  Problem as SharedProblem,
} from '../../../shared/types';
import type { ExecutorCapabilities, ExecutorMode } from '../types/executor';
import type { Problem } from '../types/problem';

type AssertAssignable<T extends U, U> = true;
type _ProblemCompatibility = AssertAssignable<Problem, SharedProblem>;
type _ExecutorModeCompatibility = AssertAssignable<ExecutorMode, SharedExecutorMode>;
type _ExecutorCapabilitiesCompatibility = AssertAssignable<ExecutorCapabilities, SharedExecutorCapabilities>;

test('backend contracts stay compatible with shared contracts', () => {
  const marker: _ProblemCompatibility &
    _ExecutorModeCompatibility &
    _ExecutorCapabilitiesCompatibility = true;
  assert.equal(marker, true);
});
