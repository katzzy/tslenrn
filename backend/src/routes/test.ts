import { Router, Request, Response } from 'express';
import { getProblemByIdOrThrow, getProblemDetail, listProblems } from '../services/problemService';
import { runProblemTests } from '../services/testRunner';
import { asyncHandler } from '../utils/http';
import { validateCode, validateProblemId, validateProblemIdParam } from '../utils/validation';

const router = Router();

router.get('/problems', (req: Request, res: Response) => {
  res.json(listProblems());
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
    const problem = getProblemByIdOrThrow(problemId);
    const result = await runProblemTests(code, problem);

    res.json(result);
  })
);

export default router;
