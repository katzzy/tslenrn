import React from 'react';
import type { ProblemSummary } from '../types/index';

interface ProblemListProps {
  problems: ProblemSummary[];
  selectedId: number;
  onSelect: (id: number) => void;
  className?: string;
}

const difficultyLabels: Record<ProblemSummary['difficulty'], string> = {
  easy: '简单',
  medium: '中等',
  hard: '困难',
};

const ProblemList: React.FC<ProblemListProps> = ({ problems, selectedId, onSelect, className = '' }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  return (
    <div className={`w-full lg:w-72 h-full min-h-0 flex flex-col bg-white/90 dark:bg-gray-900 border border-slate-200/70 dark:border-gray-800 rounded-2xl overflow-hidden shadow-sm backdrop-blur ${className}`}>
      <div className="p-4 border-b border-gray-200/80 dark:border-gray-800">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">题目列表</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{problems.length} 道题目</p>
      </div>
      <div className="p-3 flex gap-2 overflow-x-auto lg:block lg:flex-1 lg:overflow-y-auto">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => onSelect(problem.id)}
            className={`min-w-56 lg:min-w-0 w-full text-left p-3 rounded-xl transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900 lg:mb-2 ${
              selectedId === problem.id
                ? 'bg-blue-50 dark:bg-blue-900/20 border border-blue-400 dark:border-blue-500 shadow-sm'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-medium text-gray-900 dark:text-white line-clamp-1">
                {problem.id}. {problem.title}
              </span>
            </div>
            <span className={`inline-block px-2 py-0.5 text-xs rounded-full font-medium ${getDifficultyColor(problem.difficulty)}`}>
              {difficultyLabels[problem.difficulty]}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
