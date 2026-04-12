import { useState } from 'react';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import CodeEditor from './components/CodeEditor';
import ResultPanel from './components/ResultPanel';
import { useProblems } from './hooks/useProblems';
import { useCodeDraft } from './hooks/useCodeDraft';
import { useRunner } from './hooks/useRunner';

function App() {
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isProblemCollapsed, setIsProblemCollapsed] = useState(false);
  const [mobilePane, setMobilePane] = useState<'problem' | 'editor' | 'result'>('problem');
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
    setMobilePane('problem');
    resetForProblemChange();
  };

  const handleRunCode = () => {
    runCode(code, customInput);
    setMobilePane('result');
  };

  const handleRunTests = () => {
    runTests(code, selectedProblemId);
    setMobilePane('result');
  };

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

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-slate-100/60 dark:bg-gray-950 p-3 gap-3">
      <ProblemList
        className="hidden lg:flex"
        problems={problems}
        selectedId={selectedProblemId}
        onSelect={handleSelectProblem}
      />

      <div className="min-h-0 flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900 shadow-sm backdrop-blur">
        <header className="border-b border-gray-200/80 dark:border-gray-800 px-6 py-4 bg-white/80 dark:bg-gray-900/80">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                TypeScript 在线学习平台
              </h1>
              <div className="mt-1 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>编写代码，运行测试，掌握 TypeScript</span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 text-xs">ACM 模式</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300 text-xs">题号 #{selectedProblemId}</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsProblemCollapsed((prev) => !prev)}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                {isProblemCollapsed ? '展开题面' : '收起题面'}
              </button>
              <button
                onClick={handleResetCode}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                重置代码
              </button>
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                ▶ 运行
              </button>
              <button
                onClick={handleRunTests}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-900"
              >
                ✓ 提交测试
              </button>
            </div>
          </div>

          <div className="mt-3 lg:hidden">
            <label htmlFor="problem-select" className="mb-1 block text-sm text-gray-600 dark:text-gray-300">
              选择题目
            </label>
            <select
              id="problem-select"
              value={selectedProblemId}
              onChange={(event) => {
                const id = Number(event.target.value);
                handleSelectProblem(id);
              }}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              {problems.map((problem) => (
                <option key={problem.id} value={problem.id}>
                  {problem.id}. {problem.title}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 lg:hidden">
            <div className="inline-flex rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-1">
              <button
                onClick={() => setMobilePane('problem')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'problem'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                题面
              </button>
              <button
                onClick={() => setMobilePane('editor')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'editor'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                编辑
              </button>
              <button
                onClick={() => setMobilePane('result')}
                className={`px-3 py-1.5 text-sm rounded-md ${
                  mobilePane === 'result'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                结果
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

        {selectedProblem && !isProblemCollapsed ? (
          <>
            <div className="hidden lg:block">
              <ProblemDetail problem={selectedProblem} />
            </div>
            {mobilePane === 'problem' && (
              <div className="lg:hidden">
                <ProblemDetail problem={selectedProblem} />
              </div>
            )}
          </>
        ) : selectedProblem && isProblemCollapsed ? (
          <>
            <div className="hidden lg:block px-6 py-3 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300">
              题面已收起，点击“展开题面”查看完整描述。
            </div>
            {mobilePane === 'problem' && (
              <div className="lg:hidden px-6 py-3 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800 text-sm text-gray-600 dark:text-gray-300">
                题面已收起，点击“展开题面”查看完整描述。
              </div>
            )}
          </>
        ) : (
          <>
            <div className="hidden lg:block p-6 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {selectedProblemError || '正在加载题目详情...'}
              </div>
            </div>
            {mobilePane === 'problem' && (
              <div className="lg:hidden p-6 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedProblemError || '正在加载题目详情...'}
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex-1 min-h-0 flex flex-col xl:flex-row overflow-hidden bg-slate-50/40 dark:bg-gray-900/40">
          <div
            className={`${mobilePane === 'editor' ? 'flex' : 'hidden'} lg:flex flex-1 min-h-[300px] xl:min-h-0 flex-col border-b xl:border-b-0 xl:border-r border-gray-200 dark:border-gray-800`}
          >
            <div className="px-4 py-2 bg-slate-100/80 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                代码编辑器
              </span>
            </div>
            <div className="flex-1">
              <CodeEditor code={code} onChange={setCode} />
            </div>
          </div>

          <div
            className={`${mobilePane === 'result' ? 'flex' : 'hidden'} lg:flex xl:w-1/2 min-h-[280px] xl:min-h-0 flex-col bg-white/80 dark:bg-gray-900/70`}
          >
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
