import winston from 'winston';

const { combine, timestamp, printf, colorize, align } = winston.format;

// Define the different log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Choose the level based on the environment
const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'warn';
};

// Define colors for each log level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};
winston.addColors(colors);

// Define the log format
const logFormat = combine(
  timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  align(),
  printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
);

// Define different "transports" (destinations) for the logs
const transports = [
  // Always log to the console
  new winston.transports.Console({
    format: combine(
      colorize({ all: true }) // Add colors to the console output
    ),
  }),
  // Also log to files in a production environment
  ...(process.env.NODE_ENV === 'production' ? [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // Only log errors to this file
    }),
    new winston.transports.File({ filename: 'logs/all.log' }),
  ] : []),
];

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format: logFormat,
  transports,
});

export default logger;