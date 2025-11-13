/**
 * Mocked logger function for error handling
 */
export const log = (error: Error | string, context?: Record<string, unknown>) => {
  // In a real app, this would send to a logging service
  console.error('[Logger]', error, context);
};

