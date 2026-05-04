import { useEffect, useMemo, useState } from 'react';
import { executeCode, getExecutorCapabilities, testCode } from '../utils/api';
import { parseApiError } from '../utils/errors';
import type { ExecutionResult, ExecutorCapabilities, ExecutorMode, TestResult } from '../types/index';
import {
  getExecutorHint,
  getNextExecutorMode,
  persistExecutorModePreference,
  readExecutorModePreference,
} from './executorModeState';
import {
  readStringStorage,
  userStorageKey,
  writeStringStorage,
} from '../utils/storage';

const getRunnerInputStorageKey = (userId: string): string => userStorageKey(userId, 'runner-input');
const getRunnerTabStorageKey = (userId: string): string => userStorageKey(userId, 'runner-tab');

const readRunnerTabPreference = (userId: string): 'output' | 'tests' => {
  const raw = readStringStorage(getRunnerTabStorageKey(userId));
  return raw === 'tests' ? 'tests' : 'output';
};

export function useRunner(userId: string) {
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState(() => readStringStorage(getRunnerInputStorageKey(userId)) ?? '');
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>(() => readRunnerTabPreference(userId));
  const [executorMode, setExecutorMode] = useState<ExecutorMode>(() =>
    readExecutorModePreference(userId)
  );
  const [executorCapabilities, setExecutorCapabilities] = useState<ExecutorCapabilities | null>(null);

  const toggleExecutorMode = () => {
    setExecutorMode((prev) => {
      const next = getNextExecutorMode(prev);
      persistExecutorModePreference(userId, next);
      return next;
    });
  };

  useEffect(() => {
    let cancelled = false;
    const loadCapabilities = async () => {
      try {
        const capabilities = await getExecutorCapabilities();
        if (cancelled) return;
        setExecutorCapabilities(capabilities);
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

  useEffect(() => {
    writeStringStorage(getRunnerInputStorageKey(userId), customInput);
  }, [customInput, userId]);

  useEffect(() => {
    writeStringStorage(getRunnerTabStorageKey(userId), activeTab);
  }, [activeTab, userId]);

  const getExecutorModeForRequest = (): ExecutorMode => executorMode;

  const executorBadgeLabel = useMemo(
    () => getExecutorHint(executorMode, executorCapabilities),
    [executorCapabilities, executorMode]
  );

  const withDockerHint = (message: string, code?: string): string => {
    if (executorMode !== 'docker' || code !== 'DOCKER_UNAVAILABLE') {
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
