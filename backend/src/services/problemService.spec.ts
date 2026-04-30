import test from 'node:test';
import assert from 'node:assert/strict';
import { getProblemByIdOrThrow, getProblemDetail, listProblems } from './problemService';
import { problems } from '../problems';
import { HttpError } from '../utils/http';

test('listProblems returns summary for each problem', () => {
  const summaries = listProblems();
  assert.equal(summaries.length, problems.length);
  assert.deepEqual(Object.keys(summaries[0]).sort(), ['difficulty', 'id', 'title']);
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
