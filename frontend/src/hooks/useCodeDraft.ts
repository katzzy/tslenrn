import { useEffect, useMemo, useState } from 'react';

const STORAGE_KEY = 'code-by-problem-v1';
const SAVE_DELAY_MS = 300;
const STORAGE_ERROR_MESSAGE = '本地草稿保存不可用，刷新页面后可能丢失当前代码。';

const readCodeMap = (): { codeMap: Record<number, string>; hasError: boolean } => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return {
      codeMap: raw ? (JSON.parse(raw) as Record<number, string>) : {},
      hasError: false,
    };
  } catch (error) {
    console.error('Failed to read code drafts from localStorage.', error);
    return {
      codeMap: {},
      hasError: true,
    };
  }
};

interface UseCodeDraftParams {
  selectedProblemId: number;
  starterCode?: string;
}

export function useCodeDraft({ selectedProblemId, starterCode }: UseCodeDraftParams) {
  const [initialDraftState] = useState(() => readCodeMap());
  const [savedCodeByProblem, setSavedCodeByProblem] = useState<Record<number, string>>(
    () => initialDraftState.codeMap
  );
  const [storageError, setStorageError] = useState<string | null>(
    initialDraftState.hasError ? STORAGE_ERROR_MESSAGE : null
  );

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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(savedCodeByProblem));
        setStorageError((prev) => (prev ? null : prev));
      } catch (error) {
        console.error('Failed to persist code drafts to localStorage.', error);
        setStorageError(STORAGE_ERROR_MESSAGE);
      }
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
    storageError,
  };
}
