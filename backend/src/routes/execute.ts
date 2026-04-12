import { Router, Request, Response } from 'express';
import { executeUserCode } from '../services/executionService';
import { asyncHandler } from '../utils/http';
import { validateCode, validateOptionalInput } from '../utils/validation';

const router = Router();

router.post(
  '/execute',
  asyncHandler(async (req: Request, res: Response) => {
    const body = req.body as Record<string, unknown>;
    const code = validateCode(body.code);
    const input = validateOptionalInput(body.input);

    const result = await executeUserCode(code, input);
    res.json(result);
  })
);

export default router;
