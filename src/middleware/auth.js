// const jwt = require('jsonwebtoken');
// const prisma = require('../config/database');

// const authenticateToken = async (req, res, next) => {
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1];

//     if (!token) {
//         return res.status(401).json({ error: 'Token d\'accès requis' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await prisma.utilisateur.findUnique({
//             where: { id: decoded.userId },
//             select: { id: true, email: true, role: true, nom: true }
//         });

//         if (!user) {
//             return res.status(401).json({ error: 'Utilisateur non trouvé' });
//         }

//         req.user = user;
//         next();
//     } catch (error) {
//         return res.status(403).json({ error: 'Token invalide' });
//     }
// };

// const requireRole = (roles) => {
//     return (req, res, next) => {
//         if (!roles.includes(req.user.role)) {
//             return res.status(403).json({ error: 'Permissions insuffisantes' });
//         }
//         next();
//     };
// };

// module.exports = { authenticateToken, requireRole };

const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

// Permissions par rôle (RBAC)
const rolePermissions = {
    DIRIGEANT: ['*'], // Toutes les permissions
    RESPONSABLE_MINISTERE: [
        'view:projets',
        'create:projets',
        'edit:projets',
        'view:stocks',
        'create:demandes',
        'view:demandes',
        'validate:demandes',
        'view:utilisateurs',
        'view:rapports'
    ],
    ASSISTANT_ADMIN: [
        'view:projets',
        'create:demandes',
        'view:demandes',
        'view:stocks',
        'create:stocks',
        'view:utilisateurs'
    ],
    COMPTABLE: [
        'view:projets',
        'view:depenses',
        'create:depenses',
        'view:rapports_financiers',
        'export:rapports'
    ]
};

/**
 * Middleware d'authentification JWT
 */
const authMiddleware = (requiredRoles = []) => {
    return (req, res, next) => {
        try {
            // Extraire le token du header Authorization
            const token = req.headers.authorization?.split(' ')[1];

            if (!token) {
                logger.warn('Tentative d\'accès sans token', {
                    ip: req.ip,
                    path: req.path
                });
                return res.status(401).json({
                    success: false,
                    message: 'Token non fourni'
                });
            }

            // Vérifier le token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
            
            // Attacher l'utilisateur à la requête
            req.utilisateur = decoded;

            // Vérifier les rôles requis
            if (requiredRoles.length > 0) {
                const userRole = decoded.role;
                const hasPermission = requiredRoles.includes(userRole);

                if (!hasPermission) {
                    logger.warn('Tentative d\'accès non autorisé', {
                        userId: decoded.id,
                        role: userRole,
                        requiredRoles,
                        path: req.path
                    });
                    return res.status(403).json({
                        success: false,
                        message: 'Permissions insuffisantes'
                    });
                }
            }

            logger.debug('Authentification réussie', {
                userId: decoded.id,
                role: decoded.role
            });

            next();
        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                logger.warn('Token expiré', { 
                    expiredAt: error.expiredAt 
                });
                return res.status(401).json({
                    success: false,
                    message: 'Token expiré'
                });
            }

            if (error.name === 'JsonWebTokenError') {
                logger.warn('Token invalide', { error: error.message });
                return res.status(401).json({
                    success: false,
                    message: 'Token invalide'
                });
            }

            logger.error('Erreur d\'authentification', error);
            res.status(500).json({
                success: false,
                message: 'Erreur d\'authentification'
            });
        }
    };
};

/**
 * Middleware de vérification des permissions
 */
const checkPermission = (requiredPermission) => {
    return (req, res, next) => {
        const userRole = req.utilisateur?.role;

        if (!userRole) {
            return res.status(401).json({
                success: false,
                message: 'Utilisateur non authentifié'
            });
        }

        const permissions = rolePermissions[userRole] || [];

        // Vérifier si le rôle a toutes les permissions
        const hasAllPermissions = permissions.includes('*');
        const hasPermission = permissions.includes(requiredPermission) || hasAllPermissions;

        if (!hasPermission) {
            logger.warn('Accès refusé - permission insuffisante', {
                userId: req.utilisateur.id,
                role: userRole,
                requiredPermission
            });
            return res.status(403).json({
                success: false,
                message: 'Permission refusée'
            });
        }

        next();
    };
};

/**
 * Middleware pour vérifier l'propriété d'une ressource
 */
const checkResourceOwnership = async (getResourceOwner) => {
    return async (req, res, next) => {
        try {
            const resourceId = req.params.id;
            const userId = req.utilisateur.id;
            const userRole = req.utilisateur.role;

            // Les DIRIGEANT peuvent accéder à toutes les ressources
            if (userRole === 'DIRIGEANT') {
                return next();
            }

            // Vérifier l'ownership
            const ownerId = await getResourceOwner(resourceId);
            
            if (ownerId !== userId && userRole !== 'DIRIGEANT') {
                logger.warn('Tentative d\'accès à une ressource non autorisée', {
                    userId,
                    resourceId,
                    resourceOwnerId: ownerId
                });
                return res.status(403).json({
                    success: false,
                    message: 'Accès refusé'
                });
            }

            next();
        } catch (error) {
            logger.error('Erreur lors de la vérification de propriété', error);
            res.status(500).json({
                success: false,
                message: 'Erreur serveur'
            });
        }
    };
};

/**
 * Générer un JWT
 */
const generateToken = (utilisateur, expiresIn = '24h') => {
    return jwt.sign(
        {
            id: utilisateur.id,
            login: utilisateur.login,
            email: utilisateur.email,
            role: utilisateur.role,
            nom: utilisateur.nom,
            prenom: utilisateur.prenom
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn }
    );
};

/**
 * Middleware de rate limiting
 */
const rateLimit = require('express-rate-limit');

const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100, message = 'Trop de requêtes') => {
    return rateLimit({
        windowMs,
        max,
        message,
        standardHeaders: true,
        legacyHeaders: false,
        handler: (req, res) => {
            logger.warn('Rate limit dépassée', {
                ip: req.ip,
                path: req.path
            });
            res.status(429).json({
                success: false,
                message: message
            });
        }
    });
};

// Rate limiters prédéfinis
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100);
const authLimiter = createRateLimiter(15 * 60 * 1000, 5, 'Trop de tentatives de connexion');
const createLimiter = createRateLimiter(60 * 60 * 1000, 50); // 50 créations par heure

module.exports = {
    authMiddleware,
    checkPermission,
    checkResourceOwnership,
    generateToken,
    rolePermissions,
    apiLimiter,
    authLimiter,
    createLimiter
};
