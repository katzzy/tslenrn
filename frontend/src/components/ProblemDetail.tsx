import React, { useState } from 'react';
import type { Problem } from '../types/index';

interface ProblemDetailProps {
  problem: Problem;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem }) => {
  const [showHints, setShowHints] = useState(false);
  const difficultyLabel =
    problem.difficulty === 'easy' ? '简单' : problem.difficulty === 'medium' ? '中等' : '困难';

  return (
    <div className="h-full overflow-y-auto bg-transparent p-6">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {problem.id}. {problem.title}
        </h1>
        <span className={`px-3 py-1 text-sm rounded-full ${
          problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {difficultyLabel}
        </span>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-4">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </div>
      </div>

      <div className="mb-4 rounded-2xl border border-blue-200/80 bg-blue-50/80 px-3 py-2 text-sm text-blue-700 dark:border-blue-800/70 dark:bg-blue-900/25 dark:text-blue-300">
        当前为 ACM 模式：请按题目要求读取输入并输出结果。
      </div>

      <button
        onClick={() => setShowHints(!showHints)}
        className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 ${
          showHints
            ? 'bg-slate-700 hover:bg-slate-800 dark:bg-slate-500 dark:hover:bg-slate-400'
            : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400'
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {showHints ? '隐藏提示' : '查看提示'}
      </button>

      {showHints && (
        <div className="mt-4 rounded-2xl border border-amber-200/80 bg-amber-50/85 p-4 dark:border-amber-800/60 dark:bg-amber-900/20">
          <h3 className="font-semibold text-yellow-900 dark:text-yellow-200 mb-2">💡 提示</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-800 dark:text-yellow-300">
            {problem.hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemDetail;
