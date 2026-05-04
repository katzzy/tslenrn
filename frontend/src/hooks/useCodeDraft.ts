import { useEffect, useMemo, useState } from 'react';
import { readJsonStorage, userStorageKey, writeJsonStorage } from '../utils/storage';

const SAVE_DELAY_MS = 300;
const STORAGE_ERROR_MESSAGE = '本地草稿保存不可用，刷新页面后可能丢失当前代码。';

const getStorageKey = (userId: string): string => userStorageKey(userId, 'code-drafts');

const readCodeMap = (userId: string): { codeMap: Record<number, string>; hasError: boolean } => ({
  codeMap: readJsonStorage<Record<number, string>>(getStorageKey(userId), {}),
  hasError: false,
});

interface UseCodeDraftParams {
  userId: string;
  selectedProblemId: number;
  starterCode?: string;
}

export function useCodeDraft({ userId, selectedProblemId, starterCode }: UseCodeDraftParams) {
  const [initialDraftState] = useState(() => readCodeMap(userId));
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
      const success = writeJsonStorage(getStorageKey(userId), savedCodeByProblem);
      if (success) {
        setStorageError((prev) => (prev ? null : prev));
      } else {
        setStorageError(STORAGE_ERROR_MESSAGE);
      }
    }, SAVE_DELAY_MS);

    return () => {
      window.clearTimeout(timer);
    };
  }, [savedCodeByProblem, userId]);

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
