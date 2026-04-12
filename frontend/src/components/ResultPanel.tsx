import React, { useRef } from 'react';
import type { ExecutionResult, TestResult } from '../types/index';

interface ResultPanelProps {
  executionResult?: ExecutionResult | null;
  testResult?: TestResult | null;
  isLoading: boolean;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  activeTab: 'output' | 'tests';
  onTabChange: (tab: 'output' | 'tests') => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({
  executionResult,
  testResult,
  isLoading,
  customInput,
  onCustomInputChange,
  activeTab,
  onTabChange,
}) => {
  const testCaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const failedIndexes = testResult
    ? testResult.results.reduce<number[]>((indexes, result, index) => {
        if (!result.passed) indexes.push(index);
        return indexes;
      }, [])
    : [];

  const renderDiff = (source: string, target: string) => {
    const length = Math.max(source.length, target.length);
    const chars: React.ReactNode[] = [];
    for (let i = 0; i < length; i++) {
      const char = source[i] ?? '';
      const isDifferent = char !== (target[i] ?? '');
      chars.push(
        <span
          key={i}
          className={isDifferent ? 'bg-red-200/70 text-red-900 dark:bg-red-900/40 dark:text-red-100' : undefined}
        >
          {char || '∅'}
        </span>
      );
    }
    return chars;
  };

  const jumpToFirstFailed = () => {
    if (failedIndexes.length === 0) return;
    const firstFailedRef = testCaseRefs.current[failedIndexes[0]];
    firstFailedRef?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="p-3 pb-2">
        <label className="mb-1 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <span>输入</span>
        </label>
        <textarea
          value={customInput}
          onChange={(e) => onCustomInputChange(e.target.value)}
          placeholder="例如：&#10;1 2"
          className="h-24 w-full rounded-2xl border border-white/75 bg-white/90 px-3 py-2 font-mono text-sm text-gray-900 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
        />
      </div>

      {/* Tabs */}
      <div className="px-2 pb-2">
        <div className="flex items-center gap-2">
        <button
          onClick={() => onTabChange('output')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
            activeTab === 'output'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          运行输出
        </button>
        <button
          onClick={() => onTabChange('tests')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
            activeTab === 'tests'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-gray-900'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
          }`}
        >
          测试结果
        </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-400">执行中...</span>
          </div>
        )}

        {!isLoading && activeTab === 'output' && executionResult && (
          <div className="space-y-4">
            {executionResult.success ? (
              <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">运行成功</span>
                {executionResult.executionTime && (
                  <span className="text-sm text-gray-500">({executionResult.executionTime}ms)</span>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">运行失败</span>
              </div>
            )}

            {executionResult.output && (
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">输出：</h3>
                <pre className="bg-gray-50 dark:bg-gray-900 p-3 rounded-xl text-sm font-mono whitespace-pre-wrap overflow-x-auto border border-gray-200 dark:border-gray-800">
                  {executionResult.output}
                </pre>
              </div>
            )}

            {executionResult.error && (
              <div>
                <h3 className="text-sm font-semibold text-red-700 dark:text-red-300 mb-2">错误：</h3>
                <pre className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm font-mono text-red-800 dark:text-red-200 whitespace-pre-wrap overflow-x-auto border border-red-200 dark:border-red-900/40">
                  {executionResult.error}
                </pre>
              </div>
            )}
          </div>
        )}

        {!isLoading && activeTab === 'tests' && testResult && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {testResult.passed === testResult.total ? (
                  <>
                    <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-green-600">全部通过！</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium text-yellow-600">部分通过</span>
                  </>
                )}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                通过 {testResult.passed}/{testResult.total} 个测试用例
              </span>
            </div>

            {failedIndexes.length > 0 && (
              <div className="flex justify-end">
                <button
                  onClick={jumpToFirstFailed}
                  className="text-sm px-3 py-1.5 rounded-md border border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
                >
                  跳到首个失败用例
                </button>
              </div>
            )}

            {testResult.error && (
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-xl text-sm text-red-800 dark:text-red-200 border border-red-200 dark:border-red-900/40">
                  {testResult.error}
                </div>
              )}

            <div className="space-y-3">
              {testResult.results.map((result, index) => (
                <div
                  key={index}
                  ref={(element) => {
                    testCaseRefs.current[index] = element;
                  }}
                  className={`p-3 rounded-xl border ${
                    result.passed
                      ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                      : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {result.passed ? (
                      <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    )}
                    <span className={`text-sm font-medium ${
                      result.passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                    }`}>
                      测试用例 {index + 1} {result.hidden ? '(隐藏)' : ''}
                    </span>
                  </div>

                  {!result.hidden && (
                    <>
                      <div className="text-xs space-y-1">
                        <div>
                          <span className="font-semibold">输入：</span>
                          <code className="ml-1 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded">{result.input}</code>
                        </div>
                        {result.passed ? (
                          <>
                            <div>
                              <span className="font-semibold">期望：</span>
                              <code className="ml-1 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded">{result.expected}</code>
                            </div>
                            <div>
                              <span className="font-semibold">实际：</span>
                              <code className="ml-1 bg-white dark:bg-gray-800 px-1.5 py-0.5 rounded">{result.actual}</code>
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-semibold">期望（差异高亮）：</span>
                              <pre className="mt-1 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono">
                                {renderDiff(result.expected, result.actual)}
                              </pre>
                            </div>
                            <div>
                              <span className="font-semibold">实际（差异高亮）：</span>
                              <pre className="mt-1 bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700 whitespace-pre-wrap font-mono">
                                {renderDiff(result.actual, result.expected)}
                              </pre>
                            </div>
                          </>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && !executionResult && !testResult && (
          <div className="flex h-full items-center justify-center text-gray-500 dark:text-gray-400">
            <div className="text-center">
              <div className="text-3xl mb-2">🚀</div>
              <p className="font-medium">准备就绪</p>
              <p className="text-sm">点击“运行”查看输出，或点击“提交测试”检验答案</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPanel;
