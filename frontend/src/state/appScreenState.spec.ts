import test from 'node:test';
import assert from 'node:assert/strict';
import { appScreenReducer, initialAppScreenState } from './appScreenState';

test('app screen starts from user select', () => {
  assert.equal(initialAppScreenState.view, 'user-select');
});

test('app screen reducer enters workspace', () => {
  const next = appScreenReducer(initialAppScreenState, { type: 'ENTER_WORKSPACE' });
  assert.equal(next.view, 'workspace');
});

test('app screen reducer returns to user select', () => {
  const workspaceState = appScreenReducer(initialAppScreenState, { type: 'ENTER_WORKSPACE' });
  const next = appScreenReducer(workspaceState, { type: 'OPEN_USER_SELECT' });
  assert.equal(next.view, 'user-select');
});
