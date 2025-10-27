const logger = require('../config/logger');

/**
 * Middleware pour valider les données avec un schéma Zod
 * @param {z.ZodSchema} schema - Schéma Zod
 * @param {string} source - 'body', 'query' ou 'params'
 */
const validateWithSchema = (schema, source = 'body') => {
    return (req, res, next) => {
        try {
            const dataToValidate = req[source];
            const result = schema.safeParse(dataToValidate);

            if (!result.success) {
                const errors = result.error.errors.map(err => ({
                    field: err.path.join('.') || source,
                    message: err.message
                }));

                logger.warn('Erreur de validation', { 
                    source, 
                    errors,
                    path: req.path 
                });

                return res.status(400).json({
                    success: false,
                    message: 'Erreur de validation',
                    errors
                });
            }

            // Remplacer les données par les données validées
            req[source] = result.data;
            next();
        } catch (error) {
            logger.error('Erreur lors de la validation', error);
            res.status(500).json({
                success: false,
                message: 'Erreur interne du serveur'
            });
        }
    };
};

/**
 * Middleware pour gérer les erreurs de validation
 */
const handleValidationErrors = (err, req, res, next) => {
    if (err.isJoi || err.isYup) {
        const errors = err.details?.map(detail => ({
            field: detail.path.join('.'),
            message: detail.message
        })) || [];

        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors
        });
    }

    next(err);
};

module.exports = {
    validateWithSchema,
    handleValidationErrors
};
