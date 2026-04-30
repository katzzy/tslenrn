export type ProblemDifficulty = 'easy' | 'medium' | 'hard';
export type ExecutorMode = 'auto' | 'docker' | 'local';
export type LearningTrack = 'core' | 'reinforcement' | 'challenge';
export type LearningModule =
  | 'ts-foundation'
  | 'ts-engineering'
  | 'data-structures'
  | 'algorithm-patterns'
  | 'advanced-algorithms';

export interface ProblemLearningMeta {
  track: LearningTrack;
  module: LearningModule;
  tags: string[];
  prerequisites: number[];
  recommendedOrder: number;
  estimatedMinutes: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: ProblemDifficulty;
  learning: ProblemLearningMeta;
  starterCode: string;
  hints: string[];
  testCases: TestCase[];
}

export interface ProblemSummary {
  id: number;
  title: string;
  difficulty: ProblemDifficulty;
  learning: ProblemLearningMeta;
}

export interface ProblemBankStats {
  total: number;
  difficulty: Record<ProblemDifficulty, number>;
  track: Record<LearningTrack, number>;
  module: Record<LearningModule, number>;
}

export interface ExecutorCapabilities {
  defaultMode: ExecutorMode;
  dockerAvailable: boolean;
  allowUnsafeLocalFallback: boolean;
}

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}

export interface ExecutionRequest {
  code: string;
  input?: string;
  problemId?: number;
  executorMode?: ExecutorMode;
}

export interface ExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  errorCode?: string;
  executionTime?: number;
}

export interface TestRequest {
  code: string;
  problemId: number;
  executorMode?: ExecutorMode;
}

export interface TestResult {
  success: boolean;
  passed: number;
  total: number;
  results: SingleTestResult[];
  error?: string;
  errorCode?: string;
}

export interface SingleTestResult {
  passed: boolean;
  input: string;
  expected: string;
  actual: string;
  hidden?: boolean;
}
