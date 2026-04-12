import { useRef } from 'react';
import type { ReactNode } from 'react';
import type { TestResult } from '../../types';

interface TestResultListProps {
  testResult: TestResult;
}

const TestResultList = ({ testResult }: TestResultListProps) => {
  const testCaseRefs = useRef<Array<HTMLDivElement | null>>([]);
  const failedIndexes = testResult.results.reduce<number[]>((indexes, result, index) => {
    if (!result.passed) indexes.push(index);
    return indexes;
  }, []);

  const renderDiff = (source: string, target: string) => {
    const length = Math.max(source.length, target.length);
    const chars: ReactNode[] = [];
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
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {testResult.passed === testResult.total ? (
            <>
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium text-green-600">全部通过！</span>
            </>
          ) : (
            <>
              <svg className="w-5 h-5 text-yellow-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
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
            className="rounded-md border border-red-200 px-3 py-1.5 text-sm text-red-700 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-800 dark:text-red-300 dark:hover:bg-red-900/20"
          >
            跳到首个失败用例
          </button>
        </div>
      )}

      {testResult.error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
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
            className={`rounded-xl border p-3 ${
              result.passed
                ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/10'
                : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/10'
            }`}
          >
            <div className="mb-2 flex items-center gap-2">
              {result.passed ? (
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              <span
                className={`text-sm font-medium ${
                  result.passed ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
                }`}
              >
                测试用例 {index + 1} {result.hidden ? '(隐藏)' : ''}
              </span>
            </div>

            {!result.hidden && (
              <div className="space-y-1 text-xs">
                <div>
                  <span className="font-semibold">输入：</span>
                  <code className="ml-1 rounded bg-white px-1.5 py-0.5 dark:bg-gray-800">{result.input}</code>
                </div>
                {result.passed ? (
                  <>
                    <div>
                      <span className="font-semibold">期望：</span>
                      <code className="ml-1 rounded bg-white px-1.5 py-0.5 dark:bg-gray-800">
                        {result.expected}
                      </code>
                    </div>
                    <div>
                      <span className="font-semibold">实际：</span>
                      <code className="ml-1 rounded bg-white px-1.5 py-0.5 dark:bg-gray-800">
                        {result.actual}
                      </code>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <span className="font-semibold">期望（差异高亮）：</span>
                      <pre className="mt-1 rounded border border-gray-200 bg-white p-2 font-mono whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-800">
                        {renderDiff(result.expected, result.actual)}
                      </pre>
                    </div>
                    <div>
                      <span className="font-semibold">实际（差异高亮）：</span>
                      <pre className="mt-1 rounded border border-gray-200 bg-white p-2 font-mono whitespace-pre-wrap dark:border-gray-700 dark:bg-gray-800">
                        {renderDiff(result.actual, result.expected)}
                      </pre>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TestResultList;
