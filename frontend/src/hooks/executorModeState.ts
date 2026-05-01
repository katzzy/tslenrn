import type { ExecutorCapabilities, ExecutorMode } from '../types';

const MODE_CYCLE: Record<ExecutorMode, ExecutorMode> = {
  auto: 'docker',
  docker: 'local',
  local: 'auto',
};

const STORAGE_KEY = 'tslenrn.executor-mode';

export const getNextExecutorMode = (current: ExecutorMode): ExecutorMode => MODE_CYCLE[current];

export const readExecutorModePreference = (): ExecutorMode => {
  if (typeof window === 'undefined') return 'auto';
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === 'auto' || raw === 'docker' || raw === 'local') {
    return raw;
  }
  return 'auto';
};

export const persistExecutorModePreference = (mode: ExecutorMode): void => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, mode);
};

export const getExecutorHint = (
  mode: ExecutorMode,
  capabilities: ExecutorCapabilities | null
): string | undefined => {
  if (!capabilities) return undefined;
  if (mode === 'docker' && !capabilities.dockerAvailable) {
    return 'Docker 当前不可用';
  }
  if (mode === 'auto' && !capabilities.dockerAvailable && !capabilities.allowUnsafeLocalFallback) {
    return '自动模式下不会回退到本地执行';
  }
  return undefined;
};
