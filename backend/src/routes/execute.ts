import { Router, Request, Response } from 'express';
import { executeUserCode } from '../services/executionService';
import { dockerExecutor } from '../services/dockerExecutor';
import { ExecutionFailure } from '../types/execution';
import { toExecutionHttpError } from '../utils/executionHttp';
import { asyncHandler } from '../utils/http';
import { validateCode, validateOptionalExecutorMode, validateOptionalInput } from '../utils/validation';

const router = Router();

router.get(
  '/executor/capabilities',
  asyncHandler(async (_req: Request, res: Response) => {
    const capabilities = await dockerExecutor.getCapabilities();
    res.json(capabilities);
  })
);

router.post(
  '/execute',
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const code = validateCode(body.code);
    const input = validateOptionalInput(body.input);
    const executorMode = validateOptionalExecutorMode(body.executorMode);
    try {
      const result = await executeUserCode(code, input, executorMode);
      res.json({
        success: true,
        output: result.output,
        executionTime: result.executionTime,
      });
    } catch (error: unknown) {
      if (error instanceof ExecutionFailure) {
        throw toExecutionHttpError(error);
      }
      throw error;
    }
  })
);

export default router;
