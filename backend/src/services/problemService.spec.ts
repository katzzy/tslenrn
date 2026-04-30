import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getProblemBankStats,
  getProblemByIdOrThrow,
  getProblemDetail,
  listProblems,
} from './problemService';
import { problems } from '../problems';
import { HttpError } from '../utils/http';

test('listProblems returns summary for each problem', () => {
  const summaries = listProblems();
  assert.equal(summaries.length, problems.length);
  assert.deepEqual(Object.keys(summaries[0]).sort(), ['difficulty', 'id', 'learning', 'title']);
  assert.ok(Array.isArray(summaries[0].learning.tags));
});

test('getProblemByIdOrThrow returns problem when id exists', () => {
  const first = problems[0];
  const problem = getProblemByIdOrThrow(first.id);
  assert.equal(problem.id, first.id);
});

test('getProblemByIdOrThrow throws HttpError for unknown id', () => {
  assert.throws(() => getProblemByIdOrThrow(-1), (error: unknown) => {
    assert.ok(error instanceof HttpError);
    assert.equal(error.statusCode, 404);
    return true;
  });
});

test('getProblemDetail strips hidden test cases', () => {
  const withHidden = problems.find((problem) => problem.testCases.some((item) => item.hidden));
  assert.ok(withHidden, 'expected at least one problem with hidden test cases');

  const detail = getProblemDetail(withHidden.id);
  assert.ok(detail.testCases.every((item) => !item.hidden));
  assert.ok(detail.testCases.length <= withHidden.testCases.length);
});

test('getProblemBankStats aggregates difficulty and learning dimensions', () => {
  const stats = getProblemBankStats();

  assert.equal(stats.total, problems.length);
  assert.equal(stats.track.core + stats.track.reinforcement + stats.track.challenge, problems.length);
  assert.equal(stats.difficulty.easy + stats.difficulty.medium + stats.difficulty.hard, problems.length);
  assert.equal(
    stats.module['ts-foundation'] +
      stats.module['ts-engineering'] +
      stats.module['data-structures'] +
      stats.module['algorithm-patterns'] +
      stats.module['advanced-algorithms'],
    problems.length
  );
});
