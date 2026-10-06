export const logger = {
  info: (context: Record<string, any>, message: string) => {
    // Redact potential secrets from context if needed
    const safeContext = { ...context };
    if (safeContext.secret) safeContext.secret = '[REDACTED]';
    if (safeContext.token) safeContext.token = '[REDACTED]';

    console.log(JSON.stringify({
      level: 'info',
      timestamp: new Date().toISOString(),
      ...safeContext,
      message,
    }));
  },
  error: (context: Record<string, any>, message: string, error?: any) => {
    const safeContext = { ...context };
    if (safeContext.secret) safeContext.secret = '[REDACTED]';
    if (safeContext.token) safeContext.token = '[REDACTED]';

    console.error(JSON.stringify({
      level: 'error',
      timestamp: new Date().toISOString(),
      ...safeContext,
      message,
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
    }));
  },
  warn: (context: Record<string, any>, message: string) => {
    const safeContext = { ...context };
    if (safeContext.secret) safeContext.secret = '[REDACTED]';
    if (safeContext.token) safeContext.token = '[REDACTED]';

    console.warn(JSON.stringify({
      level: 'warn',
      timestamp: new Date().toISOString(),
      ...safeContext,
      message,
    }));
  }
};
