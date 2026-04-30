import { useState } from 'react';
import { executeCode, testCode } from '../utils/api';
import { getErrorMessage } from '../utils/errors';
import type { ExecutionResult, ExecutorMode, TestResult } from '../types/index';

export function useRunner() {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');
  const [executorMode, setExecutorMode] = useState<ExecutorMode>('auto');

  const toggleExecutorMode = () => {
    setExecutorMode((prev) => {
      if (prev === 'auto') return 'docker';
      if (prev === 'docker') return 'local';
      return 'auto';
    });
  };

  const getExecutorModeForRequest = (): ExecutorMode | undefined =>
    executorMode === 'auto' ? undefined : executorMode;

  const withDockerHint = (message: string): string => {
    if (executorMode !== 'docker') {
      return message;
    }
    if (!/docker/i.test(message)) {
      return message;
    }
    return `${message}。当前选择了 Docker 判题，请先启动 Docker，或切换到本地/自动判题。`;
  };

  const runCode = async (code: string, input: string) => {
    setIsLoading(true);
    setActiveTab('output');
    setExecutionResult(null);
    setTestResult(null);

    try {
      const result = await executeCode(code, input, getExecutorModeForRequest());
      setExecutionResult(result);
    } catch (error: unknown) {
      setExecutionResult({
        success: false,
        error: withDockerHint(getErrorMessage(error, '执行失败')),
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
      const result = await testCode(code, problemId, getExecutorModeForRequest());
      setTestResult(result);
    } catch (error: unknown) {
      setTestResult({
        success: false,
        passed: 0,
        total: 0,
        results: [],
        error: withDockerHint(getErrorMessage(error, '测试失败')),
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
    executorMode,
    toggleExecutorMode,
    runCode,
    runTests,
    resetForProblemChange,
  };
}
