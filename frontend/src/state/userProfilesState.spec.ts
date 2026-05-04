import test from 'node:test';
import assert from 'node:assert/strict';
import {
  deleteUserInList,
  findUserByName,
  reconcileActiveUserId,
  renameUserInList,
  selectExistingUserId,
  type UserProfile,
} from './userProfilesState';

const users: UserProfile[] = [
  { id: 'u1', name: 'Alice', createdAt: 1 },
  { id: 'u2', name: 'Bob', createdAt: 2 },
];

test('findUserByName matches case-insensitively', () => {
  const found = findUserByName(users, 'alice');
  assert.equal(found?.id, 'u1');
});

test('selectExistingUserId returns null for unknown user', () => {
  assert.equal(selectExistingUserId(users, 'missing'), null);
});

test('reconcileActiveUserId falls back to first user', () => {
  assert.equal(reconcileActiveUserId(users, 'missing'), 'u1');
  assert.equal(reconcileActiveUserId([], 'missing'), null);
});

test('renameUserInList rejects duplicate names', () => {
  const result = renameUserInList(users, 'u1', 'bob');
  assert.equal(result.ok, false);
});

test('deleteUserInList removes user and updates active user', () => {
  const result = deleteUserInList(users, 'u1', 'u1');
  assert.equal(result.ok, true);
  if (!result.ok) {
    return;
  }
  assert.equal(result.users.length, 1);
  assert.equal(result.users[0].id, 'u2');
  assert.equal(result.nextActiveUserId, 'u2');
});
