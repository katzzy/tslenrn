import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'code-by-problem-v1';
const SAVE_DELAY_MS = 300;

const readCodeMap = (): Record<number, string> => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<number, string>) : {};
  } catch {
    return {};
  }
};

interface UseCodeDraftParams {
  selectedProblemId: number;
  starterCode?: string;
}

export function useCodeDraft({ selectedProblemId, starterCode }: UseCodeDraftParams) {
  const [savedCodeByProblem, setSavedCodeByProblem] = useState<Record<number, string>>(() => readCodeMap());

  const code = useMemo(() => {
    if (!selectedProblemId) return '';
    const savedCode = savedCodeByProblem[selectedProblemId];

    // Monaco may emit a transient empty change when model switches; don't let that
    // permanently override non-empty starter code.
    if (savedCode === '' && starterCode && starterCode.length > 0) {
      return starterCode;
    }

    return savedCode ?? starterCode ?? '';
  }, [savedCodeByProblem, selectedProblemId, starterCode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCodeByProblem));
    }, SAVE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [savedCodeByProblem]);

  const setCode = (nextCode: string) => {
    if (!selectedProblemId) return;
    setSavedCodeByProblem((prev) => {
      if (
        nextCode === '' &&
        prev[selectedProblemId] === undefined &&
        starterCode &&
        starterCode.length > 0
      ) {
        return prev;
      }
      if (prev[selectedProblemId] === nextCode) return prev;
      return { ...prev, [selectedProblemId]: nextCode };
    });
  };

  const resetToStarterCode = () => {
    if (!selectedProblemId || starterCode === undefined) return;
    setSavedCodeByProblem((prev) =>
      prev[selectedProblemId] === starterCode ? prev : { ...prev, [selectedProblemId]: starterCode }
    );
  };

  return {
    code,
    setCode,
    resetToStarterCode,
  };
}
