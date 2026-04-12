import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import executeRouter from './routes/execute';
import testRouter from './routes/test';
import { errorMiddleware } from './utils/http';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'TypeScript Learning Platform API' });
});

app.use('/api', executeRouter);
app.use('/api', testRouter);

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /api/execute - Run code`);
  console.log(`   POST /api/test - Test code against problem`);
});
