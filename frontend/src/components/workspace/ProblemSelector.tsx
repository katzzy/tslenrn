import { useEffect, useMemo, useRef, useState } from 'react';
import type { ProblemSummary } from '../../types';

interface ProblemSelectorProps {
  problems: ProblemSummary[];
  selectedProblemId: number;
  onSelect: (id: number) => void;
  id?: string;
  className?: string;
}

const ProblemSelector = ({
  problems,
  selectedProblemId,
  onSelect,
  id,
  className = '',
}: ProblemSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.id === selectedProblemId),
    [problems, selectedProblemId]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={`text-left pr-9 ${className}`}
      >
        {selectedProblem ? `${selectedProblem.id}. ${selectedProblem.title}` : '请选择题目'}
      </button>

      <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
        <svg
          className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </span>

      {isOpen && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-white/80 bg-white/90 p-1 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/90">
          <ul className="max-h-72 overflow-y-auto" role="listbox" aria-labelledby={id}>
            {problems.map((problem) => {
              const isSelected = problem.id === selectedProblemId;
              return (
                <li key={problem.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(problem.id);
                      setIsOpen(false);
                    }}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : 'text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {problem.id}. {problem.title}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProblemSelector;
