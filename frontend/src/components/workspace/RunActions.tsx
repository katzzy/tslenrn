interface RunActionsProps {
  onRun: () => void;
  onTest: () => void;
  onReset?: () => void;
  isLoading: boolean;
  compact?: boolean;
}

const RunActions = ({
  onRun,
  onTest,
  onReset,
  isLoading,
  compact = false,
}: RunActionsProps) => {
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
        className={`rounded-full bg-amber-600 font-medium text-white transition-colors hover:bg-amber-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-amber-500 dark:hover:bg-amber-600 ${sizeClass}`}
      >
        {compact ? '提交测试' : '✓ 提交测试'}
      </button>
      {onReset && (
        <button
          onClick={onReset}
          className={`rounded-full bg-rose-600 font-medium text-white transition-colors hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600 ${sizeClass}`}
        >
          重置
        </button>
      )}
    </div>
  );
};

export default RunActions;
