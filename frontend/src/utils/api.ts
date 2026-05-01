import axios from 'axios';
import type {
  ExecutionResult,
  ExecutorCapabilities,
  ExecutorMode,
  TestResult,
  Problem,
  ProblemSummary,
} from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const executeCode = async (
  code: string,
  input = '',
  executorMode?: ExecutorMode
): Promise<ExecutionResult> => {
  const payload: { code: string; input: string; executorMode?: ExecutorMode } = { code, input };
  if (executorMode !== undefined) {
    payload.executorMode = executorMode;
  }
  const response = await api.post<ExecutionResult>('/execute', payload);
  return response.data;
};

export const testCode = async (
  code: string,
  problemId: number,
  executorMode?: ExecutorMode
): Promise<TestResult> => {
  const payload: { code: string; problemId: number; executorMode?: ExecutorMode } = { code, problemId };
  if (executorMode !== undefined) {
    payload.executorMode = executorMode;
  }
  const response = await api.post<TestResult>('/test', payload);
  return response.data;
};

export const getProblems = async (): Promise<ProblemSummary[]> => {
  const response = await api.get<ProblemSummary[]>('/problems');
  return response.data;
};

export const getProblem = async (id: number): Promise<Problem> => {
  const response = await api.get(`/problems/${id}`);
  return response.data;
};

export const getExecutorCapabilities = async (): Promise<ExecutorCapabilities> => {
  const response = await api.get<ExecutorCapabilities>('/executor/capabilities');
  return response.data;
};

export default api;
