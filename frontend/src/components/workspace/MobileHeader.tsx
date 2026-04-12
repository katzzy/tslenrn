import RunActions from './RunActions';
import ThemeToggle from './ThemeToggle';
import ProblemSelector from './ProblemSelector';
import type { ProblemSummary } from '../../types';
import type { ThemeMode } from '../../hooks/useThemeMode';
import type { MobilePane } from '../../hooks/useWorkspaceUIState';

interface MobileHeaderProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  selectedProblemId: number;
  problems: ProblemSummary[];
  onSelectProblem: (id: number) => void;
  onPreviousProblem: () => void;
  onNextProblem: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isLoading: boolean;
  onRun: () => void;
  onTest: () => void;
  onToggleProblemCollapsed: () => void;
  isProblemCollapsed: boolean;
  onOpenReset: () => void;
  isMoreMenuOpen: boolean;
  onToggleMoreMenu: () => void;
  onCloseMoreMenu: () => void;
  mobilePane: MobilePane;
  onSetMobilePane: (pane: MobilePane) => void;
  hasPendingResult: boolean;
  isResetConfirmOpen: boolean;
  onConfirmReset: () => void;
  onCancelReset: () => void;
}

const MobileHeader = ({
  themeMode,
  onToggleTheme,
  selectedProblemId,
  problems,
  onSelectProblem,
  onPreviousProblem,
  onNextProblem,
  canGoPrevious,
  canGoNext,
  isLoading,
  onRun,
  onTest,
  onToggleProblemCollapsed,
  isProblemCollapsed,
  onOpenReset,
  isMoreMenuOpen,
  onToggleMoreMenu,
  onCloseMoreMenu,
  mobilePane,
  onSetMobilePane,
  hasPendingResult,
  isResetConfirmOpen,
  onConfirmReset,
  onCancelReset,
}: MobileHeaderProps) => (
  <header className="sticky top-0 z-20 border-b border-white/80 bg-white/75 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/70 lg:hidden">
    <div className="mb-3 flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="ios-toolbar-dot bg-red-400" />
        <span className="ios-toolbar-dot bg-amber-400" />
        <span className="ios-toolbar-dot bg-emerald-400" />
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Workspace</span>
        <ThemeToggle themeMode={themeMode} onToggle={onToggleTheme} compact />
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          TypeScript 在线学习平台
        </h1>
        <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
          <span>编写代码，运行测试，掌握 TypeScript</span>
          <span className="ios-chip">ACM 模式</span>
          <span className="ios-chip">题号 #{selectedProblemId}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <RunActions onRun={onRun} onTest={onTest} isLoading={isLoading} />
        <div className="relative">
          <button
            onClick={onToggleMoreMenu}
            className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
          >
            更多
          </button>
          {isMoreMenuOpen && (
            <div className="absolute right-0 z-30 mt-2 w-36 rounded-2xl border border-white/80 bg-white/85 p-1 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
              <button
                onClick={() => {
                  onToggleProblemCollapsed();
                  onCloseMoreMenu();
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                {isProblemCollapsed ? '展开题面' : '收起题面'}
              </button>
              <button
                onClick={() => {
                  onOpenReset();
                  onCloseMoreMenu();
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                重置代码
              </button>
            </div>
          )}
        </div>
      </div>
    </div>

    <div className="mt-3 max-w-xl">
      <label htmlFor="problem-select" className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
        选择题目
      </label>
      <ProblemSelector
        id="problem-select"
        problems={problems}
        selectedProblemId={selectedProblemId}
        onSelect={onSelectProblem}
        className="w-full rounded-2xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-gray-900 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
      />
      <div className="mt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={onPreviousProblem}
          disabled={!canGoPrevious}
          className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          上一题
        </button>
        <button
          type="button"
          onClick={onNextProblem}
          disabled={!canGoNext}
          className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          下一题
        </button>
      </div>
    </div>

    <div className="mt-3">
      <div className="ios-segment grid grid-cols-3">
        <button
          onClick={() => onSetMobilePane('problem')}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mobilePane === 'problem'
              ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
              : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          题面
        </button>
        <button
          onClick={() => onSetMobilePane('editor')}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mobilePane === 'editor'
              ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
              : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          编辑
        </button>
        <button
          onClick={() => onSetMobilePane('result')}
          className={`rounded-md px-3 py-1.5 text-sm ${
            mobilePane === 'result'
              ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
              : 'text-gray-600 hover:bg-white/70 dark:text-gray-300 dark:hover:bg-gray-700'
          }`}
        >
          <span className="inline-flex items-center gap-1">
            结果
            {hasPendingResult && <span className="inline-block h-2 w-2 rounded-full bg-red-500" />}
          </span>
        </button>
      </div>
    </div>

    {isResetConfirmOpen && (
      <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
        <span>确定要重置当前题目的代码吗？</span>
        <div className="mt-2 flex gap-2">
          <button
            onClick={onConfirmReset}
            className="rounded-md bg-amber-600 px-3 py-1 text-white hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
          >
            确认重置
          </button>
          <button
            onClick={onCancelReset}
            className="rounded-md border border-amber-300 px-3 py-1 hover:bg-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 dark:border-amber-800 dark:hover:bg-amber-900/30"
          >
            取消
          </button>
        </div>
      </div>
    )}
  </header>
);

export default MobileHeader;
