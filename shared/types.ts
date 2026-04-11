export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  starterCode: string;
  hints: string[];
  testCases: TestCase[];
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface ExecutionRequest {
  code: string;
  problemId?: number;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
}

export interface TestRequest {
  code: string;
  problemId: number;
}

export interface TestResult {
  success: boolean;
  passed: number;
  total: number;
  results: SingleTestResult[];
  error?: string;
}

export interface SingleTestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  hidden?: boolean;
}
