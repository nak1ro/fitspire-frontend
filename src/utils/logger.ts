/**
 * Centralized logger for Fitspire app
 * Provides structured logging with levels and tags
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

// Set minimum log level (change to 'warn' or 'error' for production)
const MIN_LEVEL: LogLevel = __DEV__ ? 'debug' : 'info';

const COLORS = {
  debug: '\x1b[36m', // cyan
  info: '\x1b[32m',  // green
  warn: '\x1b[33m',  // yellow
  error: '\x1b[31m', // red
  reset: '\x1b[0m',
};

function shouldLog(level: LogLevel): boolean {
  return LOG_LEVELS[level] >= LOG_LEVELS[MIN_LEVEL];
}

function formatMessage(level: LogLevel, tag: string, message: string): string {
  const timestamp = new Date().toISOString().slice(11, 23);
  return `${COLORS[level]}[${timestamp}] [${level.toUpperCase()}] [${tag}]${COLORS.reset} ${message}`;
}

function logWithData(level: LogLevel, tag: string, message: string, data?: unknown): void {
  if (!shouldLog(level)) return;

  const formatted = formatMessage(level, tag, message);

  switch (level) {
    case 'debug':
      data !== undefined ? console.debug(formatted, data) : console.debug(formatted);
      break;
    case 'info':
      data !== undefined ? console.info(formatted, data) : console.info(formatted);
      break;
    case 'warn':
      data !== undefined ? console.warn(formatted, data) : console.warn(formatted);
      break;
    case 'error':
      data !== undefined ? console.error(formatted, data) : console.error(formatted);
      break;
  }
}

/**
 * Create a tagged logger instance for a specific module
 */
export function createLogger(tag: string) {
  return {
    debug: (message: string, data?: unknown) => logWithData('debug', tag, message, data),
    info: (message: string, data?: unknown) => logWithData('info', tag, message, data),
    warn: (message: string, data?: unknown) => logWithData('warn', tag, message, data),
    error: (message: string, data?: unknown) => logWithData('error', tag, message, data),
  };
}

// Pre-configured loggers for common modules
export const log = {
  api: createLogger('API'),
  auth: createLogger('Auth'),
  nav: createLogger('Navigation'),
  profile: createLogger('Profile'),
  app: createLogger('App'),
};

export default log;

