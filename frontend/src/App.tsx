import { useState, useEffect } from 'react';
import ProblemList from './components/ProblemList';
import ProblemDetail from './components/ProblemDetail';
import CodeEditor from './components/CodeEditor';
import ResultPanel from './components/ResultPanel';
import { executeCode, testCode, getProblems, getProblem } from './utils/api';
import type { ExecutionResult, TestResult, Problem, ProblemSummary } from './types/index';

const acmStarterCode = `import * as fs from 'fs';
const input = fs.readFileSync(0, 'utf8').trim();
const tokens = input.length ? input.split(/\\s+/) : [];
let idx = 0;
const next = () => tokens[idx++];

// ACM 模式：从 stdin 读取，按题目要求输出到 stdout
`;

const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      response?: { data?: { error?: string } };
      message?: string;
    };
    return maybeError.response?.data?.error || maybeError.message || fallback;
  }
  return fallback;
};

function App() {
  const [problems, setProblems] = useState<ProblemSummary[]>([]);
  const [problemDetails, setProblemDetails] = useState<Record<number, Problem>>({});
  const [selectedProblemId, setSelectedProblemId] = useState<number>(0);
  const selectedProblem = selectedProblemId ? problemDetails[selectedProblemId] : undefined;
  const [code, setCode] = useState(acmStarterCode);
  const [executionResult, setExecutionResult] = useState<ExecutionResult | null>(null);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [activeTab, setActiveTab] = useState<'output' | 'tests'>('output');
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  useEffect(() => {
    const loadProblemList = async () => {
      try {
        const list = await getProblems();
        setProblems(list);
        if (list.length > 0) {
          setSelectedProblemId(list[0].id);
        }
      } catch {
        setProblems([]);
      } finally {
        setIsBootstrapping(false);
      }
    };

    loadProblemList();
  }, []);

  useEffect(() => {
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('code-')) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach((key) => localStorage.removeItem(key));
  }, []);

  useEffect(() => {
    if (!selectedProblemId || problemDetails[selectedProblemId]) return;

    const loadProblemDetail = async () => {
      try {
        const detail = await getProblem(selectedProblemId);
        setProblemDetails((prev) => ({ ...prev, [selectedProblemId]: detail }));
      } catch {
        // Keep previous state and let UI show fallback loading state.
      }
    };

    loadProblemDetail();
  }, [selectedProblemId, problemDetails]);

  useEffect(() => {
    if (!selectedProblemId) return;
    setCode(selectedProblem?.starterCode || acmStarterCode);
  }, [selectedProblemId, selectedProblem]);

  const handleRunCode = async () => {
    setIsLoading(true);
    setActiveTab('output');
    setExecutionResult(null);
    setTestResult(null);

    try {
      const result = await executeCode(code, customInput);
      setExecutionResult(result);
    } catch (error: unknown) {
      setExecutionResult({
        success: false,
        error: getErrorMessage(error, '执行失败'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestCode = async () => {
    setIsLoading(true);
    setActiveTab('tests');
    setExecutionResult(null);
    setTestResult(null);

    try {
      const result = await testCode(code, selectedProblemId);
      setTestResult(result);
    } catch (error: unknown) {
      setTestResult({
        success: false,
        passed: 0,
        total: 0,
        results: [],
        error: getErrorMessage(error, '测试失败'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetCode = () => {
    if (selectedProblem && confirm('确定要重置代码吗？')) {
      setCode(selectedProblem.starterCode || acmStarterCode);
    }
  };

  if (isBootstrapping) {
    return <div className="flex items-center justify-center h-screen">加载题目中...</div>;
  }

  if (!selectedProblemId || problems.length === 0) {
    return <div className="flex items-center justify-center h-screen">未获取到题目列表</div>;
  }

  return (
    <div className="flex h-screen bg-slate-100/60 dark:bg-gray-950 p-3 gap-3">
      <ProblemList
        problems={problems}
        selectedId={selectedProblemId}
        onSelect={(id) => {
          setSelectedProblemId(id);
          setExecutionResult(null);
          setTestResult(null);
          setCustomInput('');
        }}
      />

      <div className="flex-1 flex flex-col overflow-hidden rounded-2xl border border-slate-200/70 dark:border-gray-800 bg-white/90 dark:bg-gray-900 shadow-sm backdrop-blur">
        <header className="border-b border-gray-200/80 dark:border-gray-800 px-6 py-4 bg-white/80 dark:bg-gray-900/80">
          <div className="flex items-center justify-between">
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
            <div className="flex gap-3">
              <button
                onClick={handleResetCode}
                className="px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/80 transition-colors shadow-sm"
              >
                重置代码
              </button>
              <button
                onClick={handleRunCode}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                ▶ 运行
              </button>
              <button
                onClick={handleTestCode}
                disabled={isLoading}
                className="px-4 py-2 text-sm bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
              >
                ✓ 提交测试
              </button>
            </div>
          </div>
        </header>

        {selectedProblem ? (
          <ProblemDetail problem={selectedProblem} />
        ) : (
          <div className="p-6 bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/80 dark:border-gray-800">
            <div className="text-sm text-gray-500 dark:text-gray-400">正在加载题目详情...</div>
          </div>
        )}

        <div className="flex-1 flex overflow-hidden bg-slate-50/40 dark:bg-gray-900/40">
          <div className="flex-1 flex flex-col border-r border-gray-200 dark:border-gray-800">
            <div className="px-4 py-2 bg-slate-100/80 dark:bg-gray-800/70 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                代码编辑器
              </span>
            </div>
            <div className="flex-1">
              <CodeEditor code={code} onChange={setCode} />
            </div>
          </div>

          <div className="w-1/2 flex flex-col bg-white/80 dark:bg-gray-900/70">
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
