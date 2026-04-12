import { useEffect, useMemo, useRef, useState } from 'react';
import { getProblem, getProblems } from '../utils/api';
import { getErrorMessage } from '../utils/errors';
import type { Problem, ProblemSummary } from '../types/index';

export function useProblems() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [problemDetails, setProblemDetails] = useState<Record<number, Problem>>({});
  const [selectedProblemId, setSelectedProblemIdState] = useState<number>(0);
  const [isBootstrapping, setIsBootstrapping] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [detailErrors, setDetailErrors] = useState<Record<number, string>>({});
  const pendingSelectionRef = useRef<number | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadProblemList = async () => {
      try {
        const list = await getProblems();
        if (cancelled) return;
        setProblems(list);
        setListError(null);

        const nextSelectedId = list[0]?.id ?? 0;

        if (nextSelectedId) {
          try {
            const detail = await getProblem(nextSelectedId);
            if (!cancelled) {
              setProblemDetails((prev) => ({ ...prev, [nextSelectedId]: detail }));
            }
          } catch (detailError: unknown) {
            if (!cancelled) {
              setDetailErrors((prev) => ({
                ...prev,
                [nextSelectedId]: getErrorMessage(detailError, '获取题目详情失败'),
              }));
            }
          }
        }

        if (!cancelled) {
          setSelectedProblemIdState(nextSelectedId);
        }
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

  const setSelectedProblemId = (id: number) => {
    if (!id) {
      pendingSelectionRef.current = null;
      setSelectedProblemIdState(0);
      return;
    }

    if (problemDetails[id]) {
      pendingSelectionRef.current = id;
      setSelectedProblemIdState(id);
      return;
    }

    pendingSelectionRef.current = id;

    void (async () => {
      try {
        const detail = await getProblem(id);
        setProblemDetails((prev) => ({ ...prev, [id]: detail }));
        setDetailErrors((prev) => {
          if (!(id in prev)) return prev;
          const next = { ...prev };
          delete next[id];
          return next;
        });
      } catch (error: unknown) {
        setDetailErrors((prev) => ({
          ...prev,
          [id]: getErrorMessage(error, '获取题目详情失败'),
        }));
      } finally {
        if (pendingSelectionRef.current === id) {
          setSelectedProblemIdState(id);
        }
      }
    })();
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
