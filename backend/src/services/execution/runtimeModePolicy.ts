import { ExecutionFailure } from '../../types/execution';
import type { ExecutorMode } from '../../types/executor';

export type RuntimeMode = 'docker' | 'local';

interface RuntimeModePolicyConfig {
  defaultExecutorMode: ExecutorMode;
  allowUnsafeLocalFallback: boolean;
}

interface RuntimeModeDecisionInput {
  requestedMode?: ExecutorMode;
  dockerAvailable: boolean;
}

export class RuntimeModePolicy {
  constructor(private readonly config: RuntimeModePolicyConfig) {}

  resolveMode(input: RuntimeModeDecisionInput): RuntimeMode {
    const selectedMode = input.requestedMode ?? this.config.defaultExecutorMode;

    switch (selectedMode) {
      case 'docker':
        if (!input.dockerAvailable) {
          throw new ExecutionFailure('Executor mode is docker but Docker is unavailable.', {
            code: 'DOCKER_UNAVAILABLE',
          });
        }
        return 'docker';
      case 'local':
        return 'local';
      case 'auto':
        if (input.dockerAvailable) {
          return 'docker';
        }
        if (!this.config.allowUnsafeLocalFallback) {
          throw new ExecutionFailure(
            'Docker is unavailable and automatic local fallback is disabled. Choose local mode explicitly or set ALLOW_UNSAFE_LOCAL_EXECUTION=true.',
            { code: 'LOCAL_FALLBACK_DISABLED' }
          );
        }
        return 'local';
      default: {
        const exhaustive: never = selectedMode;
        throw new ExecutionFailure(`Unsupported executor mode: ${String(exhaustive)}`, {
          code: 'INVALID_EXECUTOR_MODE',
        });
      }
    }
  }
}
