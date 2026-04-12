import ProblemDetail from '../ProblemDetail';
import ResultPanel from '../ResultPanel';
import EditorPane from './EditorPane';
import type { ExecutionResult, Problem, TestResult } from '../../types';
import type { ThemeMode } from '../../hooks/useThemeMode';
import type { MobilePane } from '../../hooks/useWorkspaceUIState';

interface MobileWorkspaceProps {
  mobilePane: MobilePane;
  isProblemCollapsed: boolean;
  selectedProblem?: Problem;
  selectedProblemError?: string;
  selectedProblemId: number;
  code: string;
  onCodeChange: (value: string) => void;
  themeMode: ThemeMode;
  executionResult?: ExecutionResult | null;
  testResult?: TestResult | null;
  isLoading: boolean;
  customInput: string;
  onCustomInputChange: (value: string) => void;
  activeTab: 'output' | 'tests';
  onTabChange: (tab: 'output' | 'tests') => void;
}

const MobileWorkspace = ({
  mobilePane,
  isProblemCollapsed,
  selectedProblem,
  selectedProblemError,
  selectedProblemId,
  code,
  onCodeChange,
  themeMode,
  executionResult,
  testResult,
  isLoading,
  customInput,
  onCustomInputChange,
  activeTab,
  onTabChange,
}: MobileWorkspaceProps) => (
  <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-hidden bg-slate-50/20 p-3 dark:bg-gray-900/10 lg:hidden">
    {!isProblemCollapsed && (
      <div className={`${mobilePane === 'problem' ? 'flex' : 'hidden'} ios-panel min-h-[260px] flex-col overflow-hidden`}>
        {selectedProblem ? (
          <ProblemDetail problem={selectedProblem} />
        ) : (
          <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
            {selectedProblemError || '正在加载题目详情...'}
          </div>
        )}
      </div>
    )}

    {isProblemCollapsed && mobilePane === 'problem' && (
      <div className="ios-panel flex min-h-[160px] items-center justify-center p-6 text-sm text-gray-500 dark:text-gray-400">
        题面已收起，请在“更多”中展开题面。
      </div>
    )}

    <EditorPane
      className={mobilePane === 'editor' ? 'flex' : 'hidden'}
      code={code}
      onCodeChange={onCodeChange}
      editorPath={`problem-${selectedProblemId}.ts`}
      themeMode={themeMode}
    />

    <div className={`${mobilePane === 'result' ? 'flex' : 'hidden'} ios-panel min-h-[280px] flex-col overflow-hidden`}>
      <ResultPanel
        executionResult={executionResult}
        testResult={testResult}
        isLoading={isLoading}
        customInput={customInput}
        onCustomInputChange={onCustomInputChange}
        activeTab={activeTab}
        onTabChange={onTabChange}
      />
    </div>
  </div>
);

export default MobileWorkspace;
