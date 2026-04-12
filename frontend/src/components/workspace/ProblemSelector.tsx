import { type KeyboardEvent as ReactKeyboardEvent, useEffect, useId, useMemo, useRef, useState } from 'react';
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
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const listboxId = useId();
  const selectedProblem = useMemo(
    () => problems.find((problem) => problem.id === selectedProblemId),
    [problems, selectedProblemId]
  );
  const selectedIndex = useMemo(
    () => problems.findIndex((problem) => problem.id === selectedProblemId),
    [problems, selectedProblemId]
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!rootRef.current) return;
      if (rootRef.current.contains(event.target as Node)) return;
      setIsOpen(false);
    };

    const handleEsc = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  useEffect(() => {
    if (!isOpen || highlightedIndex < 0) return;
    itemRefs.current[highlightedIndex]?.scrollIntoView({ block: 'nearest' });
  }, [highlightedIndex, isOpen]);

  const openMenu = () => {
    const nextIndex = selectedIndex >= 0 ? selectedIndex : 0;
    setHighlightedIndex(nextIndex);
    setIsOpen(true);
  };

  const selectAtIndex = (index: number) => {
    const target = problems[index];
    if (!target) return;
    onSelect(target.id);
    setIsOpen(false);
  };

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      setHighlightedIndex((prev) => Math.min(problems.length - 1, Math.max(prev + 1, 0)));
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (!isOpen) {
        openMenu();
        return;
      }
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
      return;
    }

    if (event.key === 'Enter') {
      if (!isOpen) return;
      event.preventDefault();
      selectAtIndex(highlightedIndex);
      return;
    }

    if (event.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        id={id}
        type="button"
        onClick={() => {
          if (isOpen) {
            setIsOpen(false);
            return;
          }
          openMenu();
        }}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        aria-activedescendant={isOpen && highlightedIndex >= 0 ? `${listboxId}-option-${highlightedIndex}` : undefined}
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
          <ul id={listboxId} className="max-h-72 overflow-y-auto" role="listbox" aria-labelledby={id}>
            {problems.map((problem, index) => {
              const isSelected = problem.id === selectedProblemId;
              const isHighlighted = index === highlightedIndex;
              return (
                <li key={problem.id}>
                  <button
                    ref={(element) => {
                      itemRefs.current[index] = element;
                    }}
                    type="button"
                    onClick={() => {
                      onSelect(problem.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full rounded-xl px-3 py-2 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-blue-600 text-white dark:bg-blue-500'
                        : isHighlighted
                          ? 'bg-slate-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200'
                          : 'text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800'
                    }`}
                    role="option"
                    id={`${listboxId}-option-${index}`}
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
