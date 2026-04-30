import type { ThemeMode } from '../../hooks/useThemeMode';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
  compact?: boolean;
}

const ThemeToggle = ({ themeMode, onToggle, compact = false }: ThemeToggleProps) => (
  <button
    onClick={onToggle}
    className="rounded-full bg-violet-600 px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-violet-700 dark:bg-violet-500 dark:hover:bg-violet-600"
  >
    {compact ? (themeMode === 'dark' ? '浅色' : '深色') : themeMode === 'dark' ? '浅色模式' : '深色模式'}
  </button>
);

export default ThemeToggle;
