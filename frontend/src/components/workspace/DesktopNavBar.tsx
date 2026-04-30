import type { Problem } from '../../types';
import type { ThemeMode } from '../../hooks/useThemeMode';
import ThemeToggle from './ThemeToggle';

interface DesktopNavBarProps {
  selectedProblemId: number;
  selectedProblem?: Problem;
  themeMode: ThemeMode;
  onToggleTheme: () => void;
}

const DesktopNavBar = ({
  selectedProblemId,
  selectedProblem,
  themeMode,
  onToggleTheme,
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
      {selectedProblem && <span className="ios-chip max-w-56 truncate">{selectedProblem.title}</span>}
      <ThemeToggle themeMode={themeMode} onToggle={onToggleTheme} />
    </div>
  </header>
);

export default DesktopNavBar;
