import type { ExecutionResult } from '../../types';

interface OutputResultProps {
  executionResult: ExecutionResult;
}

const OutputResult = ({ executionResult }: OutputResultProps) => (
  <div className="space-y-4">
    {executionResult.success ? (
      <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">运行成功</span>
        {executionResult.executionTime && (
          <span className="text-sm text-gray-500">({executionResult.executionTime}ms)</span>
        )}
      </div>
    ) : (
      <div className="flex items-center gap-2 text-red-600 dark:text-red-400">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
            clipRule="evenodd"
          />
        </svg>
        <span className="font-medium">运行失败</span>
      </div>
    )}

    {executionResult.output && (
      <div>
        <h3 className="mb-2 text-sm font-semibold text-gray-700 dark:text-gray-300">输出：</h3>
        <pre className="rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm font-mono whitespace-pre-wrap overflow-x-auto dark:border-gray-800 dark:bg-gray-900">
          {executionResult.output}
        </pre>
      </div>
    )}

    {executionResult.error && (
      <div>
        <h3 className="mb-2 text-sm font-semibold text-red-700 dark:text-red-300">错误：</h3>
        <pre className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-mono text-red-800 whitespace-pre-wrap overflow-x-auto dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-200">
          {executionResult.error}
        </pre>
      </div>
    )}
  </div>
);

export default OutputResult;
