import type { Problem } from '../../types';
import type { ThemeMode } from '../../hooks/useThemeMode';
import ThemeToggle from './ThemeToggle';

interface DesktopNavBarProps {
  selectedProblemId: number;
  selectedProblem?: Problem;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  currentUserName: string;
  onSwitchUser: () => void;
}

const DesktopNavBar = ({
  selectedProblemId,
  selectedProblem,
  themeMode,
  onToggleTheme,
  currentUserName,
  onSwitchUser,
}: DesktopNavBarProps) => (
  <header className="hidden items-center justify-between border-b border-white/75 bg-white/70 px-5 py-3 backdrop-blur-xl dark:border-white/10 dark:bg-gray-900/65 lg:flex">
    <div>
      <h1 className="text-base font-semibold tracking-tight text-gray-900 dark:text-white">
        TypeScript 在线学习平台
      </h1>
      <p className="text-xs text-gray-500 dark:text-gray-400">ACM 练习工作区</p>
    </div>
    <div className="flex items-center gap-2">
      <span className="ios-chip">题号 #{selectedProblemId}</span>
      <span className="ios-chip max-w-36 truncate">用户：{currentUserName}</span>
      {selectedProblem && <span className="ios-chip max-w-56 truncate">{selectedProblem.title}</span>}
      <button
        type="button"
        onClick={onSwitchUser}
        className="rounded-full bg-slate-200 px-3 py-1 text-xs font-medium text-slate-700 transition-colors hover:bg-slate-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
      >
        切换用户
      </button>
      <ThemeToggle themeMode={themeMode} onToggle={onToggleTheme} />
    </div>
  </header>
);

export default DesktopNavBar;
