export interface UserProfile {
  id: string;
  name: string;
  createdAt: number;
}

const sameName = (left: string, right: string): boolean =>
  left.toLowerCase() === right.toLowerCase();

export const findUserByName = (users: UserProfile[], name: string): UserProfile | undefined =>
  users.find((user) => sameName(user.name, name));

export const selectExistingUserId = (users: UserProfile[], userId: string): string | null =>
  users.some((user) => user.id === userId) ? userId : null;

export const reconcileActiveUserId = (
  users: UserProfile[],
  activeUserId: string | null
): string | null => {
  if (activeUserId && users.some((user) => user.id === activeUserId)) {
    return activeUserId;
  }
  return users[0]?.id ?? null;
};

export const renameUserInList = (
  users: UserProfile[],
  userId: string,
  normalizedName: string
): { ok: true; users: UserProfile[]; user: UserProfile } | { ok: false; message: string } => {
  const target = users.find((user) => user.id === userId);
  if (!target) {
    return { ok: false, message: '用户不存在' };
  }

  const duplicated = users.find(
    (user) => user.id !== userId && sameName(user.name, normalizedName)
  );
  if (duplicated) {
    return { ok: false, message: '用户名已存在' };
  }

  if (target.name === normalizedName) {
    return { ok: true, users, user: target };
  }

  const nextUser = { ...target, name: normalizedName };
  return {
    ok: true,
    users: users.map((user) => (user.id === userId ? nextUser : user)),
    user: nextUser,
  };
};

export const deleteUserInList = (
  users: UserProfile[],
  userId: string,
  activeUserId: string | null
):
  | { ok: true; users: UserProfile[]; nextActiveUserId: string | null; deletedUser: UserProfile }
  | { ok: false; message: string } => {
  const target = users.find((user) => user.id === userId);
  if (!target) {
    return { ok: false, message: '用户不存在' };
  }

  const nextUsers = users.filter((user) => user.id !== userId);
  const nextActiveUserId = activeUserId === userId ? nextUsers[0]?.id ?? null : activeUserId;

  return { ok: true, users: nextUsers, nextActiveUserId, deletedUser: target };
};
