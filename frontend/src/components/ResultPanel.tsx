import React from 'react';
import type { ExecutionResult, ExecutorMode, TestResult } from '../types/index';
import OutputResult from './result/OutputResult';
import TestResultList from './result/TestResultList';

interface ResultPanelProps {
  executionResult?: ExecutionResult | null;
  testResult?: TestResult | null;
  isLoading: boolean;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  executorMode: ExecutorMode;
  onToggleExecutorMode: () => void;
  activeTab: 'output' | 'tests';
  onTabChange: (tab: 'output' | 'tests') => void;
}

const ResultPanel: React.FC<ResultPanelProps> = ({
  executionResult,
  testResult,
  isLoading,
  customInput,
  onCustomInputChange,
  executorMode,
  onToggleExecutorMode,
  activeTab,
  onTabChange,
}) => {
  const modeLabel = executorMode === 'docker' ? 'Docker 判题' : executorMode === 'local' ? '本地判题' : '自动判题';

  return (
    <div className="flex h-full flex-col bg-transparent">
      <div className="space-y-3 p-3 pb-2">
        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>判题方式</span>
          </label>
          <button
            type="button"
            onClick={onToggleExecutorMode}
            disabled={isLoading}
            className="rounded-full bg-cyan-700 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-600 dark:hover:bg-cyan-700"
          >
            {modeLabel}
          </button>
        </div>

        <div>
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

        <div className="h-px bg-slate-200/70 dark:bg-white/10" />

        <div className="flex items-center justify-between gap-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
            <span>输出</span>
          </label>
          <div className="flex items-center rounded-full bg-slate-100/90 p-1 dark:bg-gray-800/80">
            <button
              onClick={() => onTabChange('output')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                activeTab === 'output'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              运行输出
            </button>
            <button
              onClick={() => onTabChange('tests')}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
                activeTab === 'tests'
                  ? 'bg-emerald-600 text-white dark:bg-emerald-500'
                  : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              }`}
            >
              测试结果
            </button>
          </div>
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
          <OutputResult executionResult={executionResult} />
        )}

        {!isLoading && activeTab === 'tests' && testResult && (
          <TestResultList testResult={testResult} />
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
