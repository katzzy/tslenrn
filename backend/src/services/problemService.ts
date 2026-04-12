import { problems } from '../problems';
import type { Problem } from '../types/problem';
import { HttpError } from '../utils/http';

export interface ProblemSummary {
  id: number;
  title: string;
  difficulty: Problem['difficulty'];
}

export const listProblems = (): ProblemSummary[] =>
  problems.map((problem) => ({
    id: problem.id,
    title: problem.title,
    difficulty: problem.difficulty,
  }));

export const getProblemByIdOrThrow = (problemId: number): Problem => {
  const problem = problems.find((item) => item.id === problemId);
  if (!problem) {
    throw new HttpError(404, 'Problem not found');
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
