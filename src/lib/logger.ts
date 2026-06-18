import pino from 'pino';

const isDev = process.env.NODE_ENV !== 'production';

const canUseNodeRuntime = typeof window === 'undefined' && typeof globalThis.process !== 'undefined';

const options: pino.LoggerOptions = {
  level: process.env.LOG_LEVEL || (isDev ? 'debug' : 'info'),
  timestamp: pino.stdTimeFunctions.isoTime,
};

const getTransport = () => {
  if (!canUseNodeRuntime) return undefined;

  if (isDev) {
    return pino.transport({
      target: 'pino-pretty',
      options: {
        colorize: true,
        ignore: 'pid,hostname',
      },
    });
  }

  return undefined;
};

const transport = getTransport();

const logger = transport ? pino(options, transport) : pino(options);

export default logger;
