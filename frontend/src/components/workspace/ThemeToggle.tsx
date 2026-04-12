import type { ThemeMode } from '../../hooks/useThemeMode';

interface ThemeToggleProps {
  themeMode: ThemeMode;
  onToggle: () => void;
  compact?: boolean;
}

const ThemeToggle = ({ themeMode, onToggle, compact = false }: ThemeToggleProps) => (
  <button
    onClick={onToggle}
    className="rounded-full border border-white/80 bg-white/85 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-white dark:border-white/10 dark:bg-gray-800/80 dark:text-gray-200 dark:hover:bg-gray-800"
  >
    {compact ? (themeMode === 'dark' ? '浅色' : '深色') : themeMode === 'dark' ? '浅色模式' : '深色模式'}
  </button>
);

export default ThemeToggle;
