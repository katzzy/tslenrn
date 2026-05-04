import { useEffect, useReducer, useState } from 'react';
import UserSelectionScreen from './components/UserSelectionScreen';
import DesktopNavBar from './components/workspace/DesktopNavBar';
import DesktopWorkspace from './components/workspace/DesktopWorkspace';
import MobileHeader from './components/workspace/MobileHeader';
import MobileWorkspace from './components/workspace/MobileWorkspace';
import { useProblems } from './hooks/useProblems';
import { useCodeDraft } from './hooks/useCodeDraft';
import { useRunner } from './hooks/useRunner';
import { useSplitPane } from './hooks/useSplitPane';
import { useThemeMode, type ThemeMode } from './hooks/useThemeMode';
import { useUserProfiles } from './hooks/useUserProfiles';
import { useWorkspaceUIState } from './hooks/useWorkspaceUIState';
import {
  appScreenReducer,
  initialAppScreenState,
} from './state/appScreenState';
import type { UserProfile } from './state/userProfilesState';

interface WorkspaceProps {
  user: UserProfile;
  onSwitchUser: () => void;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

function Workspace({ user, onSwitchUser, themeMode, onToggleTheme }: WorkspaceProps) {
  const [isSwitchUserConfirmOpen, setIsSwitchUserConfirmOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(min-width: 1024px)').matches;
  });
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
  } = useProblems(user.id);
  const { code, setCode, resetToStarterCode, storageError } = useCodeDraft({
    userId: user.id,
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
    executorMode,
    executorBadgeLabel,
    toggleExecutorMode,
    runCode,
    runTests,
    resetForProblemChange,
  } = useRunner(user.id);

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

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)');
    const handleChange = (event: MediaQueryListEvent) => {
      setIsDesktop(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

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
        {isDesktop ? (
          <DesktopNavBar
            selectedProblemId={selectedProblemId}
            selectedProblem={selectedProblem}
            themeMode={themeMode}
            onToggleTheme={onToggleTheme}
            currentUserName={user.name}
            onSwitchUser={() => setIsSwitchUserConfirmOpen(true)}
          />
        ) : (
          <MobileHeader
            themeMode={themeMode}
            onToggleTheme={onToggleTheme}
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
            currentUserName={user.name}
            onSwitchUser={() => setIsSwitchUserConfirmOpen(true)}
          />
        )}

        {storageError && (
          <div className="mx-3 mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
            {storageError}
          </div>
        )}

        {isDesktop ? (
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
            themeMode={themeMode}
            onRun={handleRunCode}
            onTest={handleRunTests}
            executorMode={executorMode}
            executorBadgeLabel={executorBadgeLabel}
            onToggleExecutorMode={toggleExecutorMode}
            onReset={resetToStarterCode}
            isLoading={isLoading}
            executionResult={executionResult}
            testResult={testResult}
            customInput={customInput}
            onCustomInputChange={setCustomInput}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        ) : (
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
            executorMode={executorMode}
            executorBadgeLabel={executorBadgeLabel}
            onToggleExecutorMode={toggleExecutorMode}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </div>
      {isSwitchUserConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="ios-panel w-full max-w-sm p-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              切换用户将返回用户选择页，是否继续？
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsSwitchUserConfirmOpen(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsSwitchUserConfirmOpen(false);
                  onSwitchUser();
                }}
                className="rounded-full bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                切换用户
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function App() {
  const { themeMode, toggleTheme } = useThemeMode();
  const { users, activeUser, activeUserId, selectUser, createUser, renameUser, deleteUser } =
    useUserProfiles();
  const [appScreen, dispatchAppScreen] = useReducer(appScreenReducer, initialAppScreenState);

  if (appScreen.view !== 'workspace' || !activeUser) {
    return (
      <UserSelectionScreen
        themeMode={themeMode}
        onToggleTheme={toggleTheme}
        users={users}
        selectedUserId={activeUserId}
        onSelectUser={selectUser}
        onCreateUser={createUser}
        onRenameUser={renameUser}
        onDeleteUser={deleteUser}
        onEnterWorkspace={() => dispatchAppScreen({ type: 'ENTER_WORKSPACE' })}
      />
    );
  }

  return (
    <Workspace
      key={activeUser.id}
      user={activeUser}
      onSwitchUser={() => dispatchAppScreen({ type: 'OPEN_USER_SELECT' })}
      themeMode={themeMode}
      onToggleTheme={toggleTheme}
    />
  );
}

export default App;
