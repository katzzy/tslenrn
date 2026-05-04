import type { ExecutorCapabilities, ExecutorMode } from '../types';
import { readStringStorage, userStorageKey, writeStringStorage } from '../utils/storage';

const MODE_CYCLE: Record<ExecutorMode, ExecutorMode> = {
  auto: 'docker',
  docker: 'local',
  local: 'auto',
};

const getStorageKey = (userId: string): string => userStorageKey(userId, 'executor-mode');

export const getNextExecutorMode = (current: ExecutorMode): ExecutorMode => MODE_CYCLE[current];

export const readExecutorModePreference = (userId: string): ExecutorMode => {
  const raw = readStringStorage(getStorageKey(userId));
  if (raw === 'auto' || raw === 'docker' || raw === 'local') {
    return raw;
  }
  return 'auto';
};

export const persistExecutorModePreference = (userId: string, mode: ExecutorMode): void => {
  writeStringStorage(getStorageKey(userId), mode);
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
