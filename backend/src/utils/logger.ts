// Simple logger implementation
const logger = {
  error: (message: string, meta?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()}: ${message}`, meta || '');
  },
  warn: (message: string, meta?: any) => {
    console.warn(`[WARN] ${new Date().toISOString()}: ${message}`, meta || '');
  },
  info: (message: string, meta?: any) => {
    console.log(`[INFO] ${new Date().toISOString()}: ${message}`, meta || '');
  },
  debug: (message: string, meta?: any) => {
    if (process.env.LOG_LEVEL === 'debug') {
      console.log(`[DEBUG] ${new Date().toISOString()}: ${message}`, meta || '');
    }
  },
};

export default logger;
