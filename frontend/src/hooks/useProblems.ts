import { useEffect, useMemo, useState } from 'react';
import { getProblem, getProblems } from '../utils/api';
import { getErrorMessage } from '../utils/errors';
import type { Problem, ProblemSummary } from '../types/index';

export function useProblems() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [problemDetails, setProblemDetails] = useState<Record<number, Problem>>({});
  const [selectedProblemId, setSelectedProblemId] = useState<number>(0);
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
        setSelectedProblemId((prev) => (prev && list.some((item) => item.id === prev) ? prev : (list[0]?.id ?? 0)));
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
  }, []);

  useEffect(() => {
    if (!selectedProblemId || problemDetails[selectedProblemId]) return;

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
  }, [selectedProblemId, problemDetails]);

  const selectedProblem = useMemo(
    () => (selectedProblemId ? problemDetails[selectedProblemId] : undefined),
    [problemDetails, selectedProblemId]
  );

  const selectedProblemError = selectedProblemId ? detailErrors[selectedProblemId] : undefined;

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
