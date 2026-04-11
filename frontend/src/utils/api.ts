import axios from 'axios';
import type { ExecutionResult, TestResult, Problem, ProblemSummary } from '../types/index';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const executeCode = async (code: string, input = ''): Promise<ExecutionResult> => {
  const response = await api.post<ExecutionResult>('/execute', { code, input });
  return response.data;
};

export const testCode = async (code: string, problemId: number): Promise<TestResult> => {
  const response = await api.post<TestResult>('/test', { code, problemId });
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

export default api;
