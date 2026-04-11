import React from 'react';
import type { ProblemSummary } from '../types/index';

interface ProblemListProps {
  problems: ProblemSummary[];
  selectedId: number;
  onSelect: (id: number) => void;
}

const ProblemList: React.FC<ProblemListProps> = ({ problems, selectedId, onSelect }) => {
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
    <div className="w-72 bg-white/90 dark:bg-gray-900 border border-slate-200/70 dark:border-gray-800 rounded-2xl overflow-y-auto shadow-sm backdrop-blur">
      <div className="p-4 border-b border-gray-200/80 dark:border-gray-800">
        <h2 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">题目列表</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">{problems.length} 道题目</p>
      </div>
      <div className="p-3">
        {problems.map((problem) => (
          <button
            key={problem.id}
            onClick={() => onSelect(problem.id)}
            className={`w-full text-left p-3 rounded-xl mb-2 transition-all ${
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
              {problem.difficulty}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProblemList;
