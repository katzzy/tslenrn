import type {
  ExecutorCapabilities,
  ExecutorMode,
  ExecutionResult,
  Problem as SharedProblem,
  ProblemSummary,
  SingleTestResult,
  TestCase,
  TestResult,
} from '@tslenrn/shared/types';

export type {
  ExecutorCapabilities,
  ExecutorMode,
  ExecutionResult,
  ProblemSummary,
  SingleTestResult,
  TestCase,
  TestResult,
};

// Problem detail may be returned before test cases are attached in some UI paths.
export type Problem = Omit<SharedProblem, 'testCases'> & {
  testCases?: TestCase[];
};
