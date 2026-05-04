import { Router, Request, Response } from 'express';
import { ExecutionFailure } from '../types/execution';
import {
  getProblemBankStats,
  getProblemByIdOrThrow,
  getProblemDetail,
  listProblems,
} from '../services/problemService';
import { runProblemTests } from '../services/testRunner';
import { toExecutionHttpError } from '../utils/executionHttp';
import { asyncHandler } from '../utils/http';
import {
  validateCode,
  validateOptionalExecutorMode,
  validateProblemId,
  validateProblemIdParam,
} from '../utils/validation';

const router = Router();

router.get('/problems', (req: Request, res: Response) => {
  res.json(listProblems());
});

router.get('/problems/stats', (req: Request, res: Response) => {
  res.json(getProblemBankStats());
});

router.get('/problems/:id', (req: Request, res: Response) => {
  const problemId = validateProblemIdParam(req.params.id);
  const detail = getProblemDetail(problemId);
  res.json(detail);
});

router.post(
  '/test',
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const code = validateCode(body.code);
    const problemId = validateProblemId(body.problemId);
    const executorMode = validateOptionalExecutorMode(body.executorMode);
    const problem = getProblemByIdOrThrow(problemId);
    try {
      const result = await runProblemTests(code, problem, executorMode);
      res.json(result);
    } catch (error: unknown) {
      if (error instanceof ExecutionFailure) {
        throw toExecutionHttpError(error);
      }
      throw error;
    }
  })
);

export default router;
