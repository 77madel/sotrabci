// src/config/logger.js
// const winston = require('winston');

// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.json()
//     ),
//     transports: [
//         new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
//         new winston.transports.File({ filename: 'logs/combined.log' }),
//     ],
// });

// if (process.env.NODE_ENV !== 'production') {
//     logger.add(new winston.transports.Console({
//         format: winston.format.simple()
//     }));
// }

// module.exports = logger;

const winston = require('winston');
const path = require('path');
require('winston-daily-rotate-file');

// Définir les niveaux de log personnalisés
const logLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warn: 2,
        info: 3,
        debug: 4,
        trace: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warn: 'yellow',
        info: 'cyan',
        debug: 'blue',
        trace: 'gray'
    }
};

// Format personnalisé
const customFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.printf(({ timestamp, level, message, ...meta }) => {
        let metaStr = '';
        if (Object.keys(meta).length > 0) {
            metaStr = JSON.stringify(meta, null, 2);
        }
        return `[${timestamp}] ${level.toUpperCase()}: ${message} ${metaStr}`;
    })
);

// Dossier des logs
const logsDir = process.env.LOGS_DIR || './logs';

// Créer le logger
const logger = winston.createLogger({
    levels: logLevels.levels,
    format: customFormat,
    defaultMeta: { service: 'sotrab-ci-api' },
    transports: [
        // Logs d'erreur
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'error-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'error',
            maxSize: '20m',
            maxDays: '30d',
            tailable: true
        }),
        // Logs d'informations
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'combined-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            maxSize: '20m',
            maxDays: '30d',
            tailable: true
        }),
        // Logs d'audit (modifications importantes)
        new winston.transports.DailyRotateFile({
            filename: path.join(logsDir, 'audit-%DATE%.log'),
            datePattern: 'YYYY-MM-DD',
            level: 'info',
            maxSize: '20m',
            maxDays: '90d'
        })
    ]
});

// Console output en développement
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({ colors: logLevels.colors }),
            customFormat
        )
    }));
}

// Logs HTTP avec Morgan
const morganStream = {
    write: (message) => {
        logger.info(message.trim());
    }
};

/**
 * Logger d'audit pour les actions importantes
 */
const auditLog = (action, userId, ressource, changes = {}) => {
    logger.info('AUDIT', {
        action,
        userId,
        ressource,
        changes,
        timestamp: new Date().toISOString()
    });
};

/**
 * Logger d'erreur avec contexte
 */
const errorLog = (error, context = {}) => {
    logger.error('ERROR', {
        message: error.message,
        stack: error.stack,
        code: error.code,
        ...context
    });
};

/**
 * Logger de performance
 */
const performanceLog = (operation, duration, status = 'success') => {
    const level = duration > 1000 ? 'warn' : 'debug';
    logger[level]('PERFORMANCE', {
        operation,
        duration: `${duration}ms`,
        status
    });
};

module.exports = logger;
module.exports.morganStream = morganStream;
module.exports.auditLog = auditLog;
module.exports.errorLog = errorLog;
module.exports.performanceLog = performanceLog;
