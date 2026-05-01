import { problems } from '../problems';
import type { Problem, ProblemBankStats, ProblemSummary } from '@tslenrn/shared/types';
import { HttpError } from '../utils/http';

export const listProblems = (): ProblemSummary[] =>
  problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
    learning: problem.learning,
  }));

export const getProblemBankStats = (): ProblemBankStats => {
  const stats: ProblemBankStats = {
    total: problems.length,
    difficulty: { easy: 0, medium: 0, hard: 0 },
    track: { core: 0, reinforcement: 0, challenge: 0 },
    module: {
      'ts-foundation': 0,
      'ts-engineering': 0,
      'data-structures': 0,
      'algorithm-patterns': 0,
      'advanced-algorithms': 0,
    },
  };

  for (const problem of problems) {
    stats.difficulty[problem.difficulty] += 1;
    stats.track[problem.learning.track] += 1;
    stats.module[problem.learning.module] += 1;
  }

  return stats;
};

export const getProblemByIdOrThrow = (problemId: number): Problem => {
  const problem = problems.find((item) => item.id === problemId);
  if (!problem) {
    throw new HttpError(404, 'Problem not found', 'PROBLEM_NOT_FOUND');
  }
  return problem;
};

export const getProblemDetail = (problemId: number): Problem => {
  const problem = getProblemByIdOrThrow(problemId);
  return {
    ...problem,
    testCases: problem.testCases.filter((testCase) => !testCase.hidden),
  };
};
