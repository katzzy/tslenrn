import { useEffect, useMemo, useState } from 'react';
import { executeCode, getExecutorCapabilities, testCode } from '../utils/api';
import { parseApiError } from '../utils/errors';
import type { ExecutionResult, ExecutorCapabilities, ExecutorMode, TestResult } from '../types/index';

export function useRunner() {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');
  const [executorMode, setExecutorMode] = useState<ExecutorMode>('auto');
  const [executorCapabilities, setExecutorCapabilities] = useState<ExecutorCapabilities | null>(null);

  const toggleExecutorMode = () => {
    setExecutorMode((prev) => {
      if (prev === 'auto') return 'docker';
      if (prev === 'docker') return 'local';
      return 'auto';
    });
  };

  useEffect(() => {
    let cancelled = false;
    const loadCapabilities = async () => {
      try {
        const capabilities = await getExecutorCapabilities();
        if (cancelled) return;
        setExecutorCapabilities(capabilities);
        setExecutorMode(capabilities.defaultMode);
      } catch {
        if (cancelled) return;
        setExecutorCapabilities(null);
      }
    };
    loadCapabilities();
    return () => {
      cancelled = true;
    };
  }, []);

  const getExecutorModeForRequest = (): ExecutorMode | undefined =>
    executorMode === 'auto' ? undefined : executorMode;

  const executorBadgeLabel = useMemo(() => {
    if (!executorCapabilities) return undefined;
    if (executorMode === 'docker' && !executorCapabilities.dockerAvailable) {
      return 'Docker 不可用';
    }
    if (executorMode === 'local' && !executorCapabilities.allowUnsafeLocalFallback) {
      return '本地模式受控';
    }
    return undefined;
  }, [executorCapabilities, executorMode]);

  const withDockerHint = (message: string, code?: string): string => {
    if (executorMode !== 'docker') {
      return message;
    }
    if (code !== 'DOCKER_UNAVAILABLE' && !/docker/i.test(message)) {
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
      const parsedError = parseApiError(error, '执行失败');
      setExecutionResult({
        success: false,
        error: withDockerHint(parsedError.message, parsedError.code),
        errorCode: parsedError.code,
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
      const parsedError = parseApiError(error, '测试失败');
      setTestResult({
        success: false,
        passed: 0,
        total: 0,
        results: [],
        error: withDockerHint(parsedError.message, parsedError.code),
        errorCode: parsedError.code,
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
    executorBadgeLabel,
    runCode,
    runTests,
    resetForProblemChange,
  };
}
