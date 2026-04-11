import { Router, Request, Response } from 'express';
import { dockerExecutor } from '../services/dockerExecutor';
import { problems } from '../problems';

const router = Router();
const normalizeOutput = (value: string): string =>
  value
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim();

router.get('/problems', (req: Request, res: Response) => {
  const problemList = problems.map(p => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty
  }));
  res.json(problemList);
});

router.get('/problems/:id', (req: Request, res: Response) => {
  const rawId = req.params.id;
  const id = parseInt(Array.isArray(rawId) ? rawId[0] : rawId, 10);
  const problem = problems.find(p => p.id === id);
  
  if (!problem) {
    return res.status(404).json({ error: 'Problem not found' });
  }

  const visibleTestCases = problem.testCases.filter(tc => !tc.hidden);
  
  res.json({
    ...problem,
    testCases: visibleTestCases
  });
});

router.post('/test', async (req: Request, res: Response) => {
  try {
    const { code, problemId } = req.body;

    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Code is required and must be a string'
      });
    }

    if (typeof problemId !== 'number') {
      return res.status(400).json({
        success: false,
        error: 'Problem ID is required and must be a number'
      });
    }

    const problem = problems.find(p => p.id === problemId);
    if (!problem) {
      return res.status(404).json({
        success: false,
        error: 'Problem not found'
      });
    }

    const results = [];
    let passed = 0;

    for (const testCase of problem.testCases) {
      const result = await dockerExecutor.execute(code, { stdin: testCase.input });
      
      const actualOutput = normalizeOutput(result.output || '');
      const expectedOutput = normalizeOutput(testCase.expectedOutput);
      const testPassed = actualOutput === expectedOutput;

      if (testPassed) passed++;

      results.push({
        passed: testPassed,
        input: testCase.input,
        expected: expectedOutput,
        actual: actualOutput,
        hidden: testCase.hidden || false
      });
    }

    res.json({
      success: true,
      passed,
      total: problem.testCases.length,
      results
    });
  } catch (error: any) {
    console.error('Test error:', error);
    res.status(500).json({
      success: false,
      error: error.message || 'Test execution failed',
      passed: 0,
      total: 0,
      results: []
    });
  }
});

export default router;
