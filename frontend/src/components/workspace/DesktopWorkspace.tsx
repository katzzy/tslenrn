import type { RefObject } from 'react';
import ProblemDetail from '../ProblemDetail';
import ResultPanel from '../ResultPanel';
import ProblemSelector from './ProblemSelector';
import EditorPane from './EditorPane';
import type {
  ExecutionResult,
  ExecutorMode,
  Problem,
  ProblemSummary,
  TestResult,
} from '../../types';
import type { ThemeMode } from '../../hooks/useThemeMode';

interface DesktopWorkspaceProps {
  layoutRef: RefObject<HTMLDivElement | null>;
  editorPaneRatio: number;
  onResizeStart: () => void;
  problems: ProblemSummary[];
  selectedProblemId: number;
  selectedProblem?: Problem;
  selectedProblemError?: string;
  onSelectProblem: (id: number) => void;
  onPreviousProblem: () => void;
  onNextProblem: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
  code: string;
  onCodeChange: (value: string) => void;
  themeMode: ThemeMode;
  onRun: () => void;
  onTest: () => void;
  executorMode: ExecutorMode;
  executorBadgeLabel?: string;
  onToggleExecutorMode: () => void;
  onReset: () => void;
  isLoading: boolean;
  executionResult?: ExecutionResult | null;
  testResult?: TestResult | null;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  activeTab: 'output' | 'tests';
  onTabChange: (tab: 'output' | 'tests') => void;
}

const DesktopWorkspace = ({
  layoutRef,
  editorPaneRatio,
  onResizeStart,
  problems,
  selectedProblemId,
  selectedProblem,
  selectedProblemError,
  onSelectProblem,
  onPreviousProblem,
  onNextProblem,
  canGoPrevious,
  canGoNext,
  code,
  onCodeChange,
  themeMode,
  onRun,
  onTest,
  executorMode,
  executorBadgeLabel,
  onToggleExecutorMode,
  onReset,
  isLoading,
  executionResult,
  testResult,
  customInput,
  onCustomInputChange,
  activeTab,
  onTabChange,
}: DesktopWorkspaceProps) => (
  <div
    ref={layoutRef}
    className="min-h-0 flex flex-1 gap-3 overflow-hidden bg-slate-50/20 p-2.5 dark:bg-gray-900/10"
  >
    <aside className="ios-panel flex min-h-0 w-[360px] min-w-[320px] flex-col overflow-hidden">
      <div className="p-4 pb-3">
        <div className="mb-2 flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">题目</h2>
        </div>
        <ProblemSelector
          problems={problems}
          selectedProblemId={selectedProblemId}
          onSelect={onSelectProblem}
          className="mt-2 w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
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
      {selectedProblem ? (
        <ProblemDetail problem={selectedProblem} />
      ) : (
        <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
          {selectedProblemError || '正在加载题目详情...'}
        </div>
      )}
    </aside>

    <EditorPane
      className="min-w-0 flex-1"
      style={{ flexBasis: `${editorPaneRatio * 100}%` }}
      code={code}
      onCodeChange={onCodeChange}
      editorPath={`problem-${selectedProblemId}.ts`}
      themeMode={themeMode}
      showActions
      onRun={onRun}
      onTest={onTest}
      onReset={onReset}
      isLoading={isLoading}
      compactActions
    />

    <div className="group flex w-3 cursor-col-resize items-center justify-center bg-transparent" onMouseDown={onResizeStart}>
      <div className="h-16 w-[3px] rounded-full bg-slate-300/40 transition-colors group-hover:bg-slate-400 dark:bg-gray-700/70 dark:group-hover:bg-gray-600" />
    </div>

    <div className="ios-panel flex min-h-0 min-w-[300px] flex-col overflow-hidden" style={{ flexBasis: `${(1 - editorPaneRatio) * 100}%` }}>
      <ResultPanel
        executionResult={executionResult}
        testResult={testResult}
        isLoading={isLoading}
        customInput={customInput}
        onCustomInputChange={onCustomInputChange}
        executorMode={executorMode}
        executorBadgeLabel={executorBadgeLabel}
        onToggleExecutorMode={onToggleExecutorMode}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  </div>
);

export default DesktopWorkspace;
