import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_USER_NAME_LENGTH,
  normalizeUserName,
  validateUserName,
} from '@tslenrn/shared/userProfiles';

test('normalizeUserName trims and collapses whitespace', () => {
  assert.equal(normalizeUserName('  Linus   Torvalds  '), 'Linus Torvalds');
});

test('validateUserName rejects empty and reserved names', () => {
  const empty = validateUserName('   ');
  assert.equal(empty.ok, false);
  if (!empty.ok) {
    assert.equal(empty.errorCode, 'EMPTY');
  }

  const reserved = validateUserName('root');
  assert.equal(reserved.ok, false);
  if (!reserved.ok) {
    assert.equal(reserved.errorCode, 'RESERVED');
  }
});

test('validateUserName rejects too-long names', () => {
  const tooLong = validateUserName('a'.repeat(MAX_USER_NAME_LENGTH + 1));
  assert.equal(tooLong.ok, false);
  if (!tooLong.ok) {
    assert.equal(tooLong.errorCode, 'TOO_LONG');
  }
});

test('validateUserName accepts common identifiers', () => {
  const valid = validateUserName('Linus_01');
  assert.equal(valid.ok, true);
});
