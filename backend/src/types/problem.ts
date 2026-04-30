export type ProblemDifficulty = 'easy' | 'medium' | 'hard';
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

export interface TestCase {
  input: string;
  expectedOutput: string;
  hidden?: boolean;
}
