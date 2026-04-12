import { useState } from 'react';
import { executeCode, testCode } from '../utils/api';
import { getErrorMessage } from '../utils/errors';
import type { ExecutionResult, TestResult } from '../types/index';

export function useRunner() {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');

  const runCode = async (code: string, input: string) => {
    setIsLoading(true);
    setActiveTab('output');
    setExecutionResult(null);
    setTestResult(null);

    try {
      const result = await executeCode(code, input);
      setExecutionResult(result);
    } catch (error: unknown) {
      setExecutionResult({
        success: false,
        error: getErrorMessage(error, '执行失败'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const runTests = async (code: string, problemId: number) => {
    setIsLoading(true);
    setActiveTab('tests');
    setExecutionResult(null);
    setTestResult(null);

    try {
      const result = await testCode(code, problemId);
      setTestResult(result);
    } catch (error: unknown) {
      setTestResult({
        success: false,
        passed: 0,
        total: 0,
        results: [],
        error: getErrorMessage(error, '测试失败'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForProblemChange = () => {
    setExecutionResult(null);
    setTestResult(null);
    setCustomInput('');
  };

  return {
    executionResult,
    testResult,
    isLoading,
    customInput,
    setCustomInput,
    activeTab,
    setActiveTab,
    runCode,
    runTests,
    resetForProblemChange,
  };
}
