export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (typeof error === 'object' && error !== null) {
    const maybeError = error as {
      response?: { data?: { error?: string } };
      message?: string;
    };
    return maybeError.response?.data?.error || maybeError.message || fallback;
  }

  return fallback;
};
