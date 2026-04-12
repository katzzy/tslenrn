interface RunActionsProps {
  onRun: () => void;
  onTest: () => void;
  onReset?: () => void;
  isLoading: boolean;
  compact?: boolean;
}

const RunActions = ({ onRun, onTest, onReset, isLoading, compact = false }: RunActionsProps) => {
  const sizeClass = compact ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onRun}
        disabled={isLoading}
        className={`rounded-full bg-blue-600 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass}`}
      >
        {compact ? '运行' : '▶ 运行'}
      </button>
      <button
        onClick={onTest}
        disabled={isLoading}
        className={`rounded-full bg-slate-900 font-medium text-white transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 ${sizeClass}`}
      >
        {compact ? '提交测试' : '✓ 提交测试'}
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className={`rounded-full border border-white/80 bg-white/85 font-medium text-gray-700 hover:bg-white dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800 ${sizeClass}`}
        >
          重置
        </button>
      )}
    </div>
  );
};

export default RunActions;
