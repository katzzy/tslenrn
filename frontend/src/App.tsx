import DesktopNavBar from './components/workspace/DesktopNavBar';
import DesktopWorkspace from './components/workspace/DesktopWorkspace';
import MobileHeader from './components/workspace/MobileHeader';
import MobileWorkspace from './components/workspace/MobileWorkspace';
import { useProblems } from './hooks/useProblems';
import { useCodeDraft } from './hooks/useCodeDraft';
import { useRunner } from './hooks/useRunner';
import { useSplitPane } from './hooks/useSplitPane';
import { useThemeMode } from './hooks/useThemeMode';
import { useWorkspaceUIState } from './hooks/useWorkspaceUIState';

function App() {
  const { themeMode, toggleTheme } = useThemeMode();
  const ui = useWorkspaceUIState();
  const { layoutRef, editorPaneRatio, onResizeStart } = useSplitPane();
  const {
    problems,
    selectedProblemId,
    selectedProblem,
    setSelectedProblemId,
    isBootstrapping,
    listError,
    selectedProblemError,
  } = useProblems();
  const { code, setCode, resetToStarterCode } = useCodeDraft({
    selectedProblemId,
    starterCode: selectedProblem?.starterCode,
  });
  const {
    executionResult,
    testResult,
    isLoading,
    customInput,
    setCustomInput,
    activeTab,
    setActiveTab,
    runCode,
    runTests,
    resetForProblemChange,
  } = useRunner();

  const handleSelectProblem = (id: number) => {
    setSelectedProblemId(id);
    ui.resetForProblemSelect();
    resetForProblemChange();
  };

  const handleRunCode = () => {
    runCode(code, customInput);
    ui.closeMoreMenu();
    ui.showResultPane();
  };

  const handleRunTests = () => {
    runTests(code, selectedProblemId);
    ui.closeMoreMenu();
    ui.showResultPane();
  };

  const selectedProblemIndex = problems.findIndex((problem) => problem.id === selectedProblemId);
  const previousProblemId = selectedProblemIndex > 0 ? problems[selectedProblemIndex - 1]?.id : null;
  const nextProblemId =
    selectedProblemIndex >= 0 && selectedProblemIndex < problems.length - 1
      ? problems[selectedProblemIndex + 1]?.id
      : null;

  const handlePreviousProblem = () => {
    if (!previousProblemId) return;
    handleSelectProblem(previousProblemId);
  };

  const handleNextProblem = () => {
    if (!nextProblemId) return;
    handleSelectProblem(nextProblemId);
  };

  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100/60 dark:bg-gray-950">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <div className="mb-2 text-3xl">📚</div>
          <p className="font-medium">正在加载题目</p>
          <p className="text-sm">请稍候...</p>
        </div>
      </div>
    );
  }

  if (!selectedProblemId || problems.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100/60 dark:bg-gray-950">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <div className="mb-2 text-3xl">⚠️</div>
          <p className="font-medium">{listError || '未获取到题目列表'}</p>
          <p className="text-sm">请检查后端服务与 API 配置</p>
        </div>
      </div>
    );
  }

  const hasPendingResult = Boolean(
    !isLoading && ui.mobilePane !== 'result' && (executionResult || testResult)
  );

  return (
    <div className="flex h-screen flex-col gap-3 bg-slate-100 p-3 dark:bg-gray-950 lg:flex-row">
      <div className="ios-surface min-h-0 flex flex-1 flex-col overflow-hidden">
        <DesktopNavBar
          selectedProblemId={selectedProblemId}
          selectedProblem={selectedProblem}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />

        <MobileHeader
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
          selectedProblemId={selectedProblemId}
          problems={problems}
          onSelectProblem={handleSelectProblem}
          onPreviousProblem={handlePreviousProblem}
          onNextProblem={handleNextProblem}
          canGoPrevious={Boolean(previousProblemId)}
          canGoNext={Boolean(nextProblemId)}
          isLoading={isLoading}
          onRun={handleRunCode}
          onTest={handleRunTests}
          onToggleProblemCollapsed={ui.toggleProblemCollapsed}
          isProblemCollapsed={ui.isProblemCollapsed}
          onOpenReset={ui.openResetConfirm}
          isMoreMenuOpen={ui.isMoreMenuOpen}
          onToggleMoreMenu={ui.toggleMoreMenu}
          onCloseMoreMenu={ui.closeMoreMenu}
          mobilePane={ui.mobilePane}
          onSetMobilePane={ui.setMobilePane}
          hasPendingResult={hasPendingResult}
          isResetConfirmOpen={ui.isResetConfirmOpen && Boolean(selectedProblem)}
          onConfirmReset={() => ui.confirmReset(resetToStarterCode)}
          onCancelReset={ui.cancelResetConfirm}
        />

        <DesktopWorkspace
          layoutRef={layoutRef}
          editorPaneRatio={editorPaneRatio}
          onResizeStart={onResizeStart}
          problems={problems}
          selectedProblemId={selectedProblemId}
          selectedProblem={selectedProblem}
          selectedProblemError={selectedProblemError}
          onSelectProblem={handleSelectProblem}
          onPreviousProblem={handlePreviousProblem}
          onNextProblem={handleNextProblem}
          canGoPrevious={Boolean(previousProblemId)}
          canGoNext={Boolean(nextProblemId)}
          code={code}
          onCodeChange={setCode}
          selectedProblemIdForEditor={selectedProblemId}
          themeMode={themeMode}
          onRun={handleRunCode}
          onTest={handleRunTests}
          onReset={resetToStarterCode}
          isLoading={isLoading}
          executionResult={executionResult}
          testResult={testResult}
          customInput={customInput}
          onCustomInputChange={setCustomInput}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <MobileWorkspace
          mobilePane={ui.mobilePane}
          isProblemCollapsed={ui.isProblemCollapsed}
          selectedProblem={selectedProblem}
          selectedProblemError={selectedProblemError}
          selectedProblemId={selectedProblemId}
          code={code}
          onCodeChange={setCode}
          themeMode={themeMode}
          executionResult={executionResult}
          testResult={testResult}
          isLoading={isLoading}
          customInput={customInput}
          onCustomInputChange={setCustomInput}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>
    </div>
  );
}

export default App;
