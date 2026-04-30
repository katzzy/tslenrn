export type ExecutorMode = 'auto' | 'docker' | 'local';

export interface ExecutorCapabilities {
  defaultMode: ExecutorMode;
  dockerAvailable: boolean;
  allowUnsafeLocalFallback: boolean;
}
