export const MAX_USER_NAME_LENGTH = 24;

const RESERVED_USER_NAMES = new Set(['root', 'admin', 'system']);

export interface UserNameValidationSuccess {
  ok: true;
  normalizedName: string;
}

export interface UserNameValidationFailure {
  ok: false;
  errorCode: 'EMPTY' | 'TOO_LONG' | 'INVALID_CHARS' | 'RESERVED';
  message: string;
}

export type UserNameValidationResult = UserNameValidationSuccess | UserNameValidationFailure;

export const normalizeUserName = (rawName: string): string => rawName.trim().replace(/\s+/g, ' ');

export const validateUserName = (rawName: string): UserNameValidationResult => {
  const normalizedName = normalizeUserName(rawName);

  if (!normalizedName) {
    return {
      ok: false,
      errorCode: 'EMPTY',
      message: '请输入用户名',
    };
  }

  if (normalizedName.length > MAX_USER_NAME_LENGTH) {
    return {
      ok: false,
      errorCode: 'TOO_LONG',
      message: `用户名最长 ${MAX_USER_NAME_LENGTH} 个字符`,
    };
  }

  if (!/^[\p{L}\p{N}_\-\s]+$/u.test(normalizedName)) {
    return {
      ok: false,
      errorCode: 'INVALID_CHARS',
      message: '用户名仅支持字母、数字、空格、下划线和短横线',
    };
  }

  if (RESERVED_USER_NAMES.has(normalizedName.toLowerCase())) {
    return {
      ok: false,
      errorCode: 'RESERVED',
      message: '该用户名不可用，请更换一个',
    };
  }

  return {
    ok: true,
    normalizedName,
  };
};
