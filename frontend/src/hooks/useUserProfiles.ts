import { useEffect, useMemo, useState } from 'react';
import { validateUserName } from '@tslenrn/shared/userProfiles';
import {
  type UserScopedStorageArea,
  appStorageKey,
  readJsonStorage,
  readStringStorage,
  removeStorage,
  subscribeStorageKeys,
  userStorageKey,
  writeJsonStorage,
  writeStringStorage,
} from '../utils/storage';
import {
  deleteUserInList,
  findUserByName,
  reconcileActiveUserId,
  renameUserInList,
  selectExistingUserId,
  type UserProfile,
} from '../state/userProfilesState';

const USERS_STORAGE_KEY = appStorageKey('users');
const ACTIVE_USER_STORAGE_KEY = appStorageKey('active-user-id');
const USER_SCOPED_STORAGE_AREAS: readonly UserScopedStorageArea[] = [
  'code-drafts',
  'selected-problem',
  'executor-mode',
  'runner-input',
  'runner-tab',
];

type UserProfileMutationResult = { ok: true; user?: UserProfile } | { ok: false; message: string };

const readUsers = (): UserProfile[] => {
  const parsed = readJsonStorage<unknown>(USERS_STORAGE_KEY, []);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .filter(
      (item): item is UserProfile =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as { id?: unknown }).id === 'string' &&
        ((item as { id: string }).id.length > 0) &&
        typeof (item as { name?: unknown }).name === 'string' &&
        ((item as { name: string }).name.length > 0) &&
        typeof (item as { createdAt?: unknown }).createdAt === 'number'
    )
    .sort((a, b) => a.createdAt - b.createdAt);
};

const createUserId = (): string =>
  `u_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;

export function useUserProfiles() {
  const [initialUserState] = useState(() => {
    if (typeof window === 'undefined') return null;
    const initialUsers = readUsers();
    const storedActiveUserId = readStringStorage(ACTIVE_USER_STORAGE_KEY);
    return {
      users: initialUsers,
      activeUserId: reconcileActiveUserId(initialUsers, storedActiveUserId),
    };
  });
  const [users, setUsers] = useState<UserProfile[]>(() => initialUserState?.users ?? []);
  const [activeUserId, setActiveUserId] = useState<string | null>(
    () => initialUserState?.activeUserId ?? null
  );

  useEffect(() => {
    writeJsonStorage(USERS_STORAGE_KEY, users);
  }, [users]);

  useEffect(() => {
    if (activeUserId) {
      writeStringStorage(ACTIVE_USER_STORAGE_KEY, activeUserId);
      return;
    }
    removeStorage(ACTIVE_USER_STORAGE_KEY);
  }, [activeUserId]);

  const activeUser = useMemo(
    () => (activeUserId ? users.find((user) => user.id === activeUserId) ?? null : null),
    [activeUserId, users]
  );

  const selectUser = (userId: string) => {
    setActiveUserId(selectExistingUserId(users, userId));
  };

  const clearActiveUser = () => {
    setActiveUserId(null);
  };

  const createUser = (name: string): UserProfileMutationResult => {
    const validation = validateUserName(name);
    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const normalizedName = validation.normalizedName;

    const existing = findUserByName(users, normalizedName);
    if (existing) {
      setActiveUserId(existing.id);
      return { ok: true, user: existing };
    }

    const nextUser: UserProfile = {
      id: createUserId(),
      name: normalizedName,
      createdAt: Date.now(),
    };

    setUsers((prev) => [...prev, nextUser]);
    setActiveUserId(nextUser.id);
    return { ok: true, user: nextUser };
  };

  const renameUser = (userId: string, nextName: string): UserProfileMutationResult => {
    const validation = validateUserName(nextName);
    if (!validation.ok) {
      return { ok: false, message: validation.message };
    }

    const result = renameUserInList(users, userId, validation.normalizedName);
    if (!result.ok) {
      return result;
    }

    setUsers(result.users);
    return { ok: true, user: result.user };
  };

  const deleteUser = (userId: string): UserProfileMutationResult => {
    const result = deleteUserInList(users, userId, activeUserId);
    if (!result.ok) {
      return result;
    }

    setUsers(result.users);
    setActiveUserId(result.nextActiveUserId);

    for (const area of USER_SCOPED_STORAGE_AREAS) {
      removeStorage(userStorageKey(userId, area));
    }

    return { ok: true };
  };

  useEffect(
    () =>
      subscribeStorageKeys([USERS_STORAGE_KEY, ACTIVE_USER_STORAGE_KEY], (event) => {
        if (event.key === USERS_STORAGE_KEY) {
          const nextUsers = readUsers();
          setUsers(nextUsers);
          setActiveUserId((previousActiveUserId) =>
            reconcileActiveUserId(nextUsers, previousActiveUserId)
          );
          return;
        }
        if (event.key === ACTIVE_USER_STORAGE_KEY) {
          setActiveUserId(readStringStorage(ACTIVE_USER_STORAGE_KEY));
        }
      }),
    []
  );

  return {
    users,
    activeUser,
    activeUserId,
    selectUser,
    clearActiveUser,
    createUser,
    renameUser,
    deleteUser,
  };
}
