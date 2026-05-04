import { useEffect, useMemo, useState } from 'react';
import { getProblem, getProblems } from '../utils/api';
import { getErrorMessage } from '../utils/errors';
import type { Problem, ProblemSummary } from '../types/index';
import { readStringStorage, userStorageKey, writeStringStorage } from '../utils/storage';

const getSelectedProblemStorageKey = (userId: string): string =>
  userStorageKey(userId, 'selected-problem');

const readSelectedProblemId = (userId: string): number | null => {
  const raw = readStringStorage(getSelectedProblemStorageKey(userId));
  if (!raw) return null;
  const parsed = Number.parseInt(raw, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export function useProblems(userId: string) {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [problemDetails, setProblemDetails] = useState<Record<number, Problem>>({});
  const [selectedProblemId, setSelectedProblemIdState] = useState<number>(0);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<number, string>>({});

  useEffect(() => {
    let cancelled = false;

    const loadProblemList = async () => {
      try {
        const list = await getProblems();
        if (cancelled) return;
        setProblems(list);
        setListError(null);

        const preferredProblemId = readSelectedProblemId(userId);
        const hasPreferredProblem = preferredProblemId
          ? list.some((problem) => problem.id === preferredProblemId)
          : false;
        const nextSelectedId =
          (hasPreferredProblem ? preferredProblemId : null) ?? list[0]?.id ?? 0;
        setSelectedProblemIdState(nextSelectedId);
      } catch (error: unknown) {
        if (cancelled) return;
        setProblems([]);
        setListError(getErrorMessage(error, '获取题目列表失败'));
      } finally {
        if (!cancelled) {
          setIsBootstrapping(false);
        }
      }
    };

    loadProblemList();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const selectedProblem = useMemo(
    () => (selectedProblemId ? problemDetails[selectedProblemId] : undefined),
    [problemDetails, selectedProblemId]
  );

  useEffect(() => {
    if (!selectedProblemId || selectedProblem) return;

    let cancelled = false;

    const loadProblemDetail = async () => {
      try {
        const detail = await getProblem(selectedProblemId);
        if (cancelled) return;
        setProblemDetails((prev) => ({ ...prev, [selectedProblemId]: detail }));
        setDetailErrors((prev) => {
          if (!(selectedProblemId in prev)) return prev;
          const next = { ...prev };
          delete next[selectedProblemId];
          return next;
        });
      } catch (error: unknown) {
        if (cancelled) return;
        setDetailErrors((prev) => ({
          ...prev,
          [selectedProblemId]: getErrorMessage(error, '获取题目详情失败'),
        }));
      }
    };

    loadProblemDetail();

    return () => {
      cancelled = true;
    };
  }, [selectedProblemId, selectedProblem]);

  const selectedProblemError = selectedProblemId ? detailErrors[selectedProblemId] : undefined;

  const setSelectedProblemId = (id: number) => {
    const nextId = id || 0;
    setSelectedProblemIdState(nextId);
    if (nextId > 0) {
      writeStringStorage(getSelectedProblemStorageKey(userId), String(nextId));
    }
  };

  return {
    problems,
    selectedProblemId,
    selectedProblem,
    setSelectedProblemId,
    isBootstrapping,
    listError,
    selectedProblemError,
  };
}
