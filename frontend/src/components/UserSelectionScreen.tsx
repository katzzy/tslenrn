import { useMemo, useState } from 'react';
import type { ThemeMode } from '../hooks/useThemeMode';
import ThemeToggle from './workspace/ThemeToggle';
import type { UserProfile } from '../state/userProfilesState';

interface UserSelectionScreenProps {
  themeMode: ThemeMode;
  onToggleTheme: () => void;
  users: UserProfile[];
  selectedUserId: string | null;
  onSelectUser: (userId: string) => void;
  onCreateUser: (name: string) => { ok: true; user?: UserProfile } | { ok: false; message: string };
  onRenameUser: (
    userId: string,
    name: string
  ) => { ok: true; user?: UserProfile } | { ok: false; message: string };
  onDeleteUser: (userId: string) => { ok: true; user?: UserProfile } | { ok: false; message: string };
  onEnterWorkspace: () => void;
}

const UserSelectionScreen = ({
  themeMode,
  onToggleTheme,
  users,
  selectedUserId,
  onSelectUser,
  onCreateUser,
  onRenameUser,
  onDeleteUser,
  onEnterWorkspace,
}: UserSelectionScreenProps) => {
  const [newUserName, setNewUserName] = useState('');
  const [renameUserName, setRenameUserName] = useState('');
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const selectedUser = useMemo(
    () => users.find((user) => user.id === selectedUserId) ?? null,
    [selectedUserId, users]
  );

  const handleCreate = () => {
    const result = onCreateUser(newUserName);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    setNewUserName('');
  };

  const handleRename = () => {
    if (!selectedUser) {
      setErrorMessage('请先选择一个用户');
      return;
    }
    const result = onRenameUser(selectedUser.id, renameUserName);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    setRenameUserName('');
  };

  const handleDelete = () => {
    if (!selectedUser) {
      setErrorMessage('请先选择一个用户');
      return;
    }
    const result = onDeleteUser(selectedUser.id);
    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }
    setErrorMessage(null);
    setRenameUserName('');
    setIsDeleteConfirmOpen(false);
  };

  const handleEnter = () => {
    if (!selectedUserId || !selectedUser) {
      setErrorMessage('请先选择一个用户');
      return;
    }
    setErrorMessage(null);
    onEnterWorkspace();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4 dark:bg-gray-950">
      <div className="ios-surface w-full max-w-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-white/75 bg-white/70 px-5 py-4 dark:border-white/10 dark:bg-gray-900/65">
          <div>
            <h1 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">
              TypeScript 在线学习平台
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">进入题库前先选择用户</p>
          </div>
          <ThemeToggle themeMode={themeMode} onToggle={onToggleTheme} />
        </div>

        <div className="space-y-4 p-5">
          <div className="ios-panel p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>已有本地用户</span>
            </label>
            <div className="max-h-56 space-y-2 overflow-y-auto pr-1">
              {users.length === 0 && (
                <div className="rounded-xl border border-dashed border-slate-300/80 bg-slate-50/80 px-3 py-4 text-sm text-slate-500 dark:border-slate-700 dark:bg-gray-900/40 dark:text-slate-400">
                  还没有用户，请先创建一个。
                </div>
              )}
              {users.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    setErrorMessage(null);
                    onSelectUser(user.id);
                  }}
                  className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left transition-colors ${
                    selectedUserId === user.id
                      ? 'border-blue-500 bg-blue-50 text-blue-700 dark:border-blue-400 dark:bg-blue-500/10 dark:text-blue-200'
                      : 'border-white/80 bg-white/85 text-gray-700 hover:bg-white dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-200 dark:hover:bg-gray-800'
                  }`}
                >
                  <span className="font-medium">{user.name}</span>
                  {selectedUserId === user.id && <span className="text-xs">当前选择</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="ios-panel p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>创建新用户</span>
            </label>
            <div className="flex gap-2">
              <input
                value={newUserName}
                onChange={(event) => setNewUserName(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    handleCreate();
                  }
                }}
                placeholder="例如：Linus"
                className="flex-1 rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              >
                创建
              </button>
            </div>
          </div>

          <div className="ios-panel p-4">
            <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-500" />
              <span>管理当前用户</span>
            </label>
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  value={renameUserName}
                  onChange={(event) => setRenameUserName(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      handleRename();
                    }
                  }}
                  placeholder={selectedUser ? `重命名：${selectedUser.name}` : '先选择用户再重命名'}
                  disabled={!selectedUser}
                  className="flex-1 rounded-xl border border-white/80 bg-white/85 px-3 py-2 text-sm text-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/10 dark:bg-gray-900/80 dark:text-gray-100"
                />
                <button
                  type="button"
                  onClick={handleRename}
                  disabled={!selectedUser}
                  className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                >
                  重命名
                </button>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(true)}
                disabled={!selectedUser}
                className="rounded-full bg-rose-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-rose-500 dark:hover:bg-rose-600"
              >
                删除当前用户
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/60 dark:bg-amber-900/20 dark:text-amber-200">
              {errorMessage}
            </div>
          )}

          <div className="flex items-center justify-between rounded-xl border border-white/80 bg-white/80 px-3 py-2 dark:border-white/10 dark:bg-gray-900/70">
            <div className="text-sm text-gray-600 dark:text-gray-300">
              当前用户：<span className="font-semibold">{selectedUser?.name ?? '未选择'}</span>
            </div>
            <button
              type="button"
              onClick={handleEnter}
              className="rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              进入题库
            </button>
          </div>
        </div>
      </div>
      {isDeleteConfirmOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="ios-panel w-full max-w-sm p-4">
            <p className="text-sm text-gray-700 dark:text-gray-200">
              删除用户“{selectedUser.name}”后，将清除该用户本地草稿与偏好。是否继续？
            </p>
            <div className="mt-3 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsDeleteConfirmOpen(false)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="rounded-full bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-rose-700 dark:bg-rose-500 dark:hover:bg-rose-600"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserSelectionScreen;
