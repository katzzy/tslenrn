import { useEffect, useRef, useState } from 'react';
import ProblemDetail from './components/ProblemDetail';
import CodeEditor from './components/CodeEditor';
import ResultPanel from './components/ResultPanel';
import DesktopNavBar from './components/workspace/DesktopNavBar';
import ProblemSelector from './components/workspace/ProblemSelector';
import ThemeToggle from './components/workspace/ThemeToggle';
import { useProblems } from './hooks/useProblems';
import { useCodeDraft } from './hooks/useCodeDraft';
import { useRunner } from './hooks/useRunner';
import { useThemeMode } from './hooks/useThemeMode';

function App() {
  const { themeMode, toggleTheme } = useThemeMode();
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor' | 'result'>('problem');
  const [editorPaneRatio, setEditorPaneRatio] = useState(0.68);
  const layoutRef = useRef<HTMLDivElement | null>(null);
  const isDraggingRef = useRef(false);
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

  const handleResetCode = () => {
    setIsResetConfirmOpen(true);
  };

  const handleSelectProblem = (id: number) => {
    setSelectedProblemId(id);
    setIsResetConfirmOpen(false);
    setIsProblemCollapsed(false);
    setIsMoreMenuOpen(false);
    setMobilePane('problem');
    resetForProblemChange();
  };

  const handleRunCode = () => {
    runCode(code, customInput);
    setIsMoreMenuOpen(false);
    setMobilePane('result');
  };

  const handleRunTests = () => {
    runTests(code, selectedProblemId);
    setIsMoreMenuOpen(false);
    setMobilePane('result');
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!isDraggingRef.current || !layoutRef.current) return;
      const rect = layoutRef.current.getBoundingClientRect();
      const ratio = (event.clientX - rect.left) / rect.width;
      const clampedRatio = Math.min(0.85, Math.max(0.45, ratio));
      setEditorPaneRatio(clampedRatio);
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  if (isBootstrapping) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-100/60 dark:bg-gray-950">
        <div className="text-center text-gray-600 dark:text-gray-300">
          <div className="text-3xl mb-2">📚</div>
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
          <div className="text-3xl mb-2">⚠️</div>
          <p className="font-medium">{listError || '未获取到题目列表'}</p>
          <p className="text-sm">请检查后端服务与 API 配置</p>
        </div>
      </div>
    );
  }

  const hasPendingResult = !isLoading && mobilePane !== 'result' && (executionResult || testResult);

    return (
    <div className={`${themeMode === 'dark' ? 'dark' : ''} flex h-screen flex-col gap-3 bg-slate-100 p-3 dark:bg-gray-950 lg:flex-row`}>
      <div className="ios-surface min-h-0 flex flex-1 flex-col overflow-hidden">
        <DesktopNavBar
          selectedProblemId={selectedProblemId}
          selectedProblem={selectedProblem}
          themeMode={themeMode}
          onToggleTheme={toggleTheme}
        />

        <header className="sticky top-0 z-20 border-b border-white/80 bg-white/75 px-6 py-4 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/70 lg:hidden">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="ios-toolbar-dot bg-red-400" />
              <span className="ios-toolbar-dot bg-amber-400" />
              <span className="ios-toolbar-dot bg-emerald-400" />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">Workspace</span>
              <ThemeToggle themeMode={themeMode} onToggle={toggleTheme} compact />
            </div>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                TypeScript 在线学习平台
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>编写代码，运行测试，掌握 TypeScript</span>
                <span className="ios-chip">ACM 模式</span>
                <span className="ios-chip">题号 #{selectedProblemId}</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_18px_-10px_rgba(37,99,235,0.9)] transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                ▶ 运行
              </button>
              <button
                onClick={handleRunTests}
                disabled={isLoading}
                className="rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-[0_8px_18px_-12px_rgba(15,23,42,0.95)] transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                ✓ 提交测试
              </button>
              <div className="relative">
                <button
                  onClick={() => setIsMoreMenuOpen((prev) => !prev)}
                  className="rounded-full border border-slate-200 bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
                >
                  更多
                </button>
                {isMoreMenuOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-36 rounded-2xl border border-white/80 bg-white/85 p-1 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/80">
                    <button
                      onClick={() => {
                        setIsProblemCollapsed((prev) => !prev);
                        setIsMoreMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-gray-700 hover:bg-slate-100 dark:text-gray-200 dark:hover:bg-gray-800"
                    >
                      {isProblemCollapsed ? '展开题面' : '收起题面'}
                    </button>
                    <button
                      onClick={() => {
                        handleResetCode();
                        setIsMoreMenuOpen(false);
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
              onSelect={handleSelectProblem}
              className="w-full rounded-2xl border border-white/80 bg-white/80 px-3 py-2 text-sm text-gray-900 backdrop-blur-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
            />
          </div>

          <div className="mt-3 lg:hidden">
            <div className="ios-segment grid grid-cols-3">
              <button
                onClick={() => setMobilePane('problem')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'problem'
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700'
                }`}
              >
                题面
              </button>
              <button
                onClick={() => setMobilePane('editor')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'editor'
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700'
                }`}
              >
                编辑
              </button>
              <button
                onClick={() => setMobilePane('result')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'result'
                    ? 'bg-blue-600 text-white shadow-sm dark:bg-blue-500'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-white/70 dark:hover:bg-gray-700'
                }`}
              >
                <span className="inline-flex items-center gap-1">
                  结果
                  {hasPendingResult && <span className="inline-block w-2 h-2 rounded-full bg-red-500" />}
                </span>
              </button>
            </div>
          </div>

          {isResetConfirmOpen && selectedProblem && (
            <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
              <span>确定要重置当前题目的代码吗？</span>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={() => {
                    resetToStarterCode();
                    setIsResetConfirmOpen(false);
                  }}
                  className="rounded-md bg-amber-600 px-3 py-1 text-white hover:bg-amber-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  确认重置
                </button>
                <button
                  onClick={() => setIsResetConfirmOpen(false)}
                  className="rounded-md border border-amber-300 px-3 py-1 hover:bg-amber-100 dark:border-amber-800 dark:hover:bg-amber-900/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
                >
                  取消
                </button>
              </div>
            </div>
          )}
        </header>

        <div
          ref={layoutRef}
          className="hidden min-h-0 flex-1 gap-3 overflow-hidden bg-slate-50/20 p-2.5 dark:bg-gray-900/10 lg:flex"
        >
          <aside className="ios-panel flex min-h-0 w-[360px] min-w-[320px] flex-col overflow-hidden">
            <div className="border-b border-white/70 bg-slate-100/70 p-4 backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60">
              <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-200">题目</h2>
              <ProblemSelector
                problems={problems}
                selectedProblemId={selectedProblemId}
                onSelect={handleSelectProblem}
                className="mt-2 w-full rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
              />
            </div>
            {selectedProblem ? (
              <ProblemDetail problem={selectedProblem} />
            ) : (
              <div className="p-6 text-sm text-gray-500 dark:text-gray-400">
                {selectedProblemError || '正在加载题目详情...'}
              </div>
            )}
          </aside>

          <div className="ios-panel flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden" style={{ flexBasis: `${editorPaneRatio * 100}%` }}>
            <div className="flex items-center justify-between border-b border-white/70 bg-slate-100/70 px-4 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">代码编辑器</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRunCode}
                  disabled={isLoading}
                  className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  运行
                </button>
                <button
                  onClick={handleRunTests}
                  disabled={isLoading}
                  className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
                >
                  提交测试
                </button>
                <button
                  onClick={handleResetCode}
                  className="rounded-full border border-white/80 bg-white/85 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
                >
                  重置
                </button>
              </div>
            </div>
            <div className="flex-1 p-2">
              <div className="h-full overflow-hidden rounded-xl border border-white/70 dark:border-white/10">
                <CodeEditor code={code} onChange={setCode} theme={themeMode === 'dark' ? 'vs-dark' : 'vs'} />
              </div>
            </div>
          </div>

          <div
            className="group flex w-3 cursor-col-resize items-center justify-center bg-transparent"
            onMouseDown={() => {
              isDraggingRef.current = true;
            }}
          >
            <div className="h-16 w-[3px] rounded-full bg-slate-300/40 transition-colors group-hover:bg-slate-400 dark:bg-gray-700/70 dark:group-hover:bg-gray-600" />
          </div>

          <div className="ios-panel flex min-h-0 min-w-[300px] flex-col overflow-hidden" style={{ flexBasis: `${(1 - editorPaneRatio) * 100}%` }}>
            <ResultPanel
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

          <div className={`${mobilePane === 'editor' ? 'flex' : 'hidden'} ios-panel min-h-[300px] flex-col overflow-hidden`}>
            <div className="border-b border-white/70 bg-slate-100/70 px-4 py-2 backdrop-blur-xl dark:border-white/10 dark:bg-gray-800/60">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                代码编辑器
              </span>
            </div>
            <div className="flex-1 p-2">
              <div className="h-full overflow-hidden rounded-xl border border-white/70 dark:border-white/10">
                <CodeEditor code={code} onChange={setCode} theme={themeMode === 'dark' ? 'vs-dark' : 'vs'} />
              </div>
            </div>
          </div>

          <div className={`${mobilePane === 'result' ? 'flex' : 'hidden'} ios-panel min-h-[280px] flex-col overflow-hidden`}>
            <ResultPanel
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
      </div>
    </div>
  );
}

export default App;
