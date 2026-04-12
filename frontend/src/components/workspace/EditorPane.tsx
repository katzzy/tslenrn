import type { CSSProperties } from 'react';
import CodeEditor from '../CodeEditor';
import RunActions from './RunActions';
import type { ThemeMode } from '../../hooks/useThemeMode';

interface EditorPaneProps {
  code: string;
  onCodeChange: (value: string) => void;
  themeMode: ThemeMode;
  editorPath?: string;
  className?: string;
  style?: CSSProperties;
  showActions?: boolean;
  onRun?: () => void;
  onTest?: () => void;
  onReset?: () => void;
  isLoading?: boolean;
  compactActions?: boolean;
}

const EditorPane = ({
  code,
  onCodeChange,
  themeMode,
  editorPath = 'solution.ts',
  className = '',
  style,
  showActions = false,
  onRun,
  onTest,
  onReset,
  isLoading = false,
  compactActions = false,
}: EditorPaneProps) => (
  <div className={`ios-panel flex min-h-[300px] flex-col overflow-hidden ${className}`} style={style}>
    <div className="flex items-center justify-between px-3 pt-3 pb-1">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">代码编辑器</span>
      </div>
      {showActions && onRun && onTest && (
        <RunActions
          onRun={onRun}
          onTest={onTest}
          onReset={onReset}
          isLoading={isLoading}
          compact={compactActions}
        />
      )}
    </div>
    <div className="flex-1 p-3 pt-2">
      <div className="h-full overflow-hidden rounded-xl border border-white/70 dark:border-white/10">
        <CodeEditor
          code={code}
          onChange={onCodeChange}
          path={editorPath}
          theme={themeMode === 'dark' ? 'tslenrn-dark' : 'tslenrn-light'}
        />
      </div>
    </div>
  </div>
);

export default EditorPane;
