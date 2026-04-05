/**
 * logger.js
 * A centralized logging utility that silences logs in production environment.
 */

const isDev = process.env.NODE_ENV === 'development';

const logger = {
    log: (...args) => {
        if (isDev) console.log(...args);
    },
    warn: (...args) => {
        if (isDev) console.warn(...args);
    },
    error: (...args) => {
        // Even in production, we might want to log critical errors, 
        // but for now, we follow the user's request for a clean console.
        if (isDev) console.error(...args);
    },
    info: (...args) => {
        if (isDev) console.info(...args);
    },
    debug: (...args) => {
        if (isDev) console.debug(...args);
    }
};

export default logger;
