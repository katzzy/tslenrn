export interface ParsedApiError {
  message: string;
  code?: string;
}

export const parseApiError = (error: unknown, fallback: string): ParsedApiError => {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      response?: { data?: { error?: string; errorCode?: string } };
      message?: string;
    };
    return {
      message: maybeError.response?.data?.error || maybeError.message || fallback,
      code: maybeError.response?.data?.errorCode,
    };
  }

  return { message: fallback };
};

export const getErrorMessage = (error: unknown, fallback: string): string =>
  parseApiError(error, fallback).message;
