import { dockerExecutor } from './dockerExecutor';
import type { Problem, TestCase } from '../types/problem';
import { ExecutionFailure } from '../types/execution';
import type { ExecutorMode } from '../types/executor';

export interface SingleTestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  hidden: boolean;
}

const normalizeOutput = (value: string): string =>
  value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

const parseConcurrency = (): number => {
  const configured = Number.parseInt(process.env.TEST_CONCURRENCY ?? '2', 10);
  return Number.isFinite(configured) && configured > 0 ? configured : 2;
};

const runWithConcurrency = async <T, R>(
  items: readonly T[],
  limit: number,
  handler: (item: T, index: number) => Promise<R>
): Promise<R[]> => {
  const results = new Array<R>(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (true) {
      const current = nextIndex;
      nextIndex += 1;
      if (current >= items.length) {
        return;
      }

      results[current] = await handler(items[current], current);
    }
  };

  const workers = Array.from({ length: Math.min(limit, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
};

const runSingleCase = async (
  code: string,
  testCase: TestCase,
  executorMode?: ExecutorMode
): Promise<SingleTestResult> => {
  const expected = normalizeOutput(testCase.expectedOutput);
  let actual = '';
  let passed = false;

  try {
    const execution = await dockerExecutor.execute(code, { stdin: testCase.input, executorMode });
    actual = normalizeOutput(execution.output);
    passed = actual === expected;
  } catch (error: unknown) {
    if (error instanceof ExecutionFailure) {
      actual = normalizeOutput(error.output ?? error.message);
    } else {
      throw error;
    }
  }

  return {
    passed,
    input: testCase.input,
    expected,
    actual,
    hidden: testCase.hidden ?? false,
  };
};

export const runProblemTests = async (code: string, problem: Problem, executorMode?: ExecutorMode) => {
  const results = await runWithConcurrency(problem.testCases, parseConcurrency(), (testCase) =>
    runSingleCase(code, testCase, executorMode)
  );
  const passed = results.reduce((count, result) => count + (result.passed ? 1 : 0), 0);

  return {
    success: true,
    passed,
    total: problem.testCases.length,
    results,
  };
};
