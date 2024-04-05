/* eslint-disable no-console */

const IS_BROWSER = typeof window !== 'undefined';

const LOG_LEVELS = ['debug', 'info', 'warn', 'error'] as const;
type LogLevel = (typeof LOG_LEVELS)[number];

const LOG_LEVEL: LogLevel =
  LOG_LEVELS.find((l) => l === process.env.LOG_LEVEL) ??
  // Default to 'debug' in dev, 'info' in prod
  process.env.NODE_ENV === 'development'
    ? 'debug'
    : 'info';

type Options = {
  category?: string;
  metadata?: Record<string, unknown>;
  elapsed?: {
    start?: boolean;
    last?: boolean;
  };
};

type ErrorOptions =
  | Options & {
      exception?: Error;
    };

export function timerStart() {
  if (IS_BROWSER) {
    return;
  }
  return process.hrtime();
}

export function timerEnd(since?: [number, number]): number | undefined {
  if (IS_BROWSER || !since) {
    return;
  }

  const diff = process.hrtime(since);
  const elapsed = diff[0] * 1e9 + diff[1];
  const elapsedAsSeconds = elapsed / 1e9;

  return Number(elapsedAsSeconds.toFixed(4));
}

export type ILogger = {
  debug(message: string, options?: Options): void;
  info(message: string, options?: Options): void;
  warn(message: string, options?: Options): void;
  error(message: string, options?: ErrorOptions): void;
  groupStart(label: string): void;
  groupEnd(message?: string, options?: Options): void;
};

export class Logger implements ILogger {
  private isVerbose;
  private isSilent;
  private showDatetime;

  private start?: [number, number];
  private last?: [number, number];

  constructor({ silent = false, verbose = false, showDatetime = false } = {}) {
    this.isSilent = silent;
    this.isVerbose = verbose;
    this.showDatetime = showDatetime;

    this.start = timerStart();
  }

  debug(message: string, { category, metadata, elapsed }: Options = {}) {
    if (LOG_LEVEL === 'info' || LOG_LEVEL === 'warn' || LOG_LEVEL === 'error') {
      return;
    }

    if (!this.isVerbose || this.isSilent) {
      return;
    }

    console.info(
      ...this.assembleMessage('debug', message, { category, metadata, elapsed })
    );
    this.last = timerStart();
  }

  info(message: string, { category, metadata, elapsed }: Options = {}) {
    if (LOG_LEVEL === 'warn' || LOG_LEVEL === 'error') {
      return;
    }

    if (this.isSilent) {
      return;
    }

    console.info(
      ...this.assembleMessage('info', message, { category, metadata, elapsed })
    );
    this.last = timerStart();
  }

  warn(message: string, { category, metadata, elapsed }: Options = {}) {
    if (LOG_LEVEL === 'error') {
      return;
    }

    if (this.isSilent) {
      return;
    }

    console.warn(
      ...this.assembleMessage('warn', message, { category, metadata, elapsed })
    );
    this.last = timerStart();
  }

  error(message: string, { exception, metadata, category, elapsed }: ErrorOptions = {}) {
    this.last = timerStart();
    if (this.isSilent) {
      return;
    }

    console.error(
      ...this.assembleMessage('error', message, {
        exception,
        category,
        metadata,
        elapsed,
      })
    );
    this.last = timerStart();
  }

  groupStart(label: string) {
    if (this.isSilent) {
      return;
    }
    console.group(label);
    this.last = timerStart();
  }

  groupEnd(message?: string, { category, metadata, elapsed }: Options = {}) {
    if (this.isSilent) {
      return;
    }
    console.groupEnd();

    const data = this.assembleMessage(null, message, { category, metadata, elapsed });

    if (data.length > 0) {
      console.info(...data);
    }

    this.last = timerStart();
  }

  private assembleMessage(
    level: LogLevel | null,
    message?: string,
    { exception, category, metadata, elapsed }: ErrorOptions = {}
  ): Array<unknown> {
    const data: Array<unknown> = [];

    if (level) {
      data.push(`${level.toUpperCase()}`, '-');
    }

    if (this.showDatetime) {
      data.push(new Date().toISOString(), '-');
    }

    if (category) {
      data.push(`[${category}]`, '-');
    }

    if (message) {
      data.push(message, '-');
    }

    if (metadata) {
      data.push(metadata);
    }

    if (exception) {
      // Delete potential request and response from the exception, the objects are much to large and
      // can contain PII/sensitive info
      const exceptionAsPotentialHttpException = exception as Error & {
        response?: unknown;
        request?: unknown;
      };

      if (exceptionAsPotentialHttpException.response) {
        delete exceptionAsPotentialHttpException.response;
      }

      if (exceptionAsPotentialHttpException.request) {
        delete exceptionAsPotentialHttpException.request;
      }

      data.push('exception', '-', exception);
    }

    if (elapsed) {
      const sinceLast = timerEnd(this.last);
      const sinceStart = timerEnd(this.start);
      elapsed.last && sinceLast && data.push(`(since last: ${sinceLast})`);
      elapsed.start && sinceStart && data.push(`(since start: ${sinceStart})`);
    }

    if (data[data.length - 1] === '-') {
      data.pop();
    }

    return data;
  }
}

export const logger = new Logger({ verbose: process.env.NODE_ENV === 'development' });
