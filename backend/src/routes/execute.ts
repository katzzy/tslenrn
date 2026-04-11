import { Router, Request, Response } from 'express';
import { dockerExecutor } from '../services/dockerExecutor';

const router = Router();

router.post('/execute', async (req: Request, res: Response) => {
  try {
    const { code, input } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Code is required and must be a string'
      });
    }

    if (code.length > 50000) {
      return res.status(400).json({
        success: false,
        error: 'Code is too long (max 50KB)'
      });
    }

    if (input !== undefined && typeof input !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Input must be a string'
      });
    }

    const result = await dockerExecutor.execute(code, { stdin: input || '' });
    res.json(result);
  } catch (error: any) {
    console.error('Execution error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Execution failed'
    });
  }
});

export default router;
