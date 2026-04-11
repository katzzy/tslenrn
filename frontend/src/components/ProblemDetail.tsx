import React, { useState } from 'react';
import type { Problem } from '../types/index';

interface ProblemDetailProps {
  problem: Problem;
}

const ProblemDetail: React.FC<ProblemDetailProps> = ({ problem }) => {
  const [showHints, setShowHints] = useState(false);

  return (
    <div className="p-6 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800 overflow-y-auto max-h-72">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {problem.id}. {problem.title}
        </h1>
        <span className={`px-3 py-1 text-sm rounded-full ${
          problem.difficulty === 'easy' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' :
          problem.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
        }`}>
          {problem.difficulty}
        </span>
      </div>

      <div className="prose dark:prose-invert max-w-none mb-4">
        <div className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
          {problem.description}
        </div>
      </div>

      <div className="mb-4 px-3 py-2 text-sm rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
        当前为 ACM 模式：请从 stdin 读取输入，并通过 stdout 输出结果。
      </div>

      <button
        onClick={() => setShowHints(!showHints)}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors font-medium"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {showHints ? '隐藏提示' : '查看提示'}
      </button>

      {showHints && (
        <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border border-yellow-200 dark:border-yellow-800">
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
