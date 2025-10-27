// const express = require('express');
// const router = express.Router();
// const { authMiddleware, checkPermission } = require('../../middleware/auth-middleware');
// const reportService = require('../../services/report-service');
// const monitoringService = require('../../services/monitoring-service');
// const logger = require('../../config/logger');

// /**
//  * @swagger
//  * /exports/projets:
//  *   get:
//  *     summary: Exporter la liste des projets en Excel
//  *     tags: [Exports]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: query
//  *         name: statut
//  *         schema:
//  *           type: string
//  *         description: Filtrer par statut
//  *       - in: query
//  *         name: ministereId
//  *         schema:
//  *           type: integer
//  *         description: Filtrer par ministère
//  *     responses:
//  *       200:
//  *         description: Fichier Excel généré
//  *       401:
//  *         description: Non authentifié
//  */
// router.get('/projets', 
    
//     //authMiddleware(),
//      checkPermission('export:rapports'), async (req, res) => {
//     try {
//         const { statut, ministereId } = req.query;
        
//         const filters = {};
//         if (statut) filters.statut = statut;
//         if (ministereId) filters.ministereId = parseInt(ministereId);

//         const filePath = await reportService.generateProjetsExcel(filters);

//         // Envoyer le fichier
//         res.download(filePath, `projets_${Date.now()}.xlsx`, (err) => {
//             if (err) {
//                 logger.error('Erreur lors du téléchargement', err);
//             }
//         });

//         logger.info('Export projets généré', { userId: req.utilisateur.id });
//     } catch (error) {
//         logger.error('Erreur export projets', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la génération du rapport'
//         });
//     }
// });

// /**
//  * @swagger
//  * /exports/depenses:
//  *   get:
//  *     summary: Exporter la liste des dépenses en Excel
//  *     tags: [Exports]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/depenses', 
//     //authMiddleware(), 
//     checkPermission('export:rapports'), async (req, res) => {
//     try {
//         const { projetId, siteId, dateDebut, dateFin } = req.query;

//         const filters = {};
//         if (projetId) filters.projetId = parseInt(projetId);
//         if (siteId) filters.siteId = parseInt(siteId);
//         if (dateDebut) filters.dateCreation = { gte: new Date(dateDebut) };
//         if (dateFin) {
//             if (filters.dateCreation) {
//                 filters.dateCreation.lte = new Date(dateFin);
//             } else {
//                 filters.dateCreation = { lte: new Date(dateFin) };
//             }
//         }

//         const filePath = await reportService.generateDepensesExcel(filters);

//         res.download(filePath, `depenses_${Date.now()}.xlsx`, (err) => {
//             if (err) {
//                 logger.error('Erreur lors du téléchargement', err);
//             }
//         });

//         logger.info('Export dépenses généré', { userId: req.utilisateur.id });
//     } catch (error) {
//         logger.error('Erreur export dépenses', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la génération du rapport'
//         });
//     }
// });

// /**
//  * @swagger
//  * /exports/projet/{id}/pdf:
//  *   get:
//  *     summary: Exporter un projet en PDF
//  *     tags: [Exports]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: id
//  *         required: true
//  *         schema:
//  *           type: integer
//  */
// router.get('/projet/:id/pdf', 
//     //authMiddleware(),
//      async (req, res) => {
//     try {
//         const filePath = await reportService.generateProjetPDF(req.params.id);

//         res.download(filePath, `projet_${req.params.id}_${Date.now()}.pdf`, (err) => {
//             if (err) {
//                 logger.error('Erreur lors du téléchargement PDF', err);
//             }
//         });

//         logger.audit('Export PDF générée', req.utilisateur.id, 'Projet', { projetId: req.params.id });
//     } catch (error) {
//         logger.error('Erreur export PDF', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la génération du PDF'
//         });
//     }
// });

// /**
//  * @swagger
//  * /exports/synthesis:
//  *   get:
//  *     summary: Exporter un rapport de synthèse générale
//  *     tags: [Exports]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/synthesis', 
//     //authMiddleware(), 
//     checkPermission('export:rapports'), async (req, res) => {
//     try {
//         const filePath = await reportService.generateSynthesisExcel();

//         res.download(filePath, `synthesis_${Date.now()}.xlsx`, (err) => {
//             if (err) {
//                 logger.error('Erreur lors du téléchargement', err);
//             }
//         });

//         logger.info('Export synthèse généré', { userId: req.utilisateur.id });
//     } catch (error) {
//         logger.error('Erreur export synthèse', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la génération du rapport'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/health:
//  *   get:
//  *     summary: Vérifier la santé du système
//  *     tags: [Monitoring]
//  */
// router.get('/health', async (req, res) => {
//     try {
//         const health = await monitoringService.healthCheck();

//         const statusCode = health.status === 'healthy' ? 200 : 503;
//         res.status(statusCode).json(health);
//     } catch (error) {
//         logger.error('Erreur health check', error);
//         res.status(503).json({
//             status: 'unhealthy',
//             error: error.message
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/metrics:
//  *   get:
//  *     summary: Obtenir les métriques du système
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/metrics', 
//     //authMiddleware(), 
//     checkPermission('view:rapports'), async (req, res) => {
//     try {
//         const metrics = await monitoringService.getMetrics();

//         res.json({
//             success: true,
//             message: 'Métriques récupérées avec succès',
//             data: metrics
//         });

//         logger.debug('Métriques consultées', { userId: req.utilisateur.id });
//     } catch (error) {
//         logger.error('Erreur récupération métriques', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération des métriques'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/alerts:
//  *   get:
//  *     summary: Obtenir les alertes en cours
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/alerts', authMiddleware(), async (req, res) => {
//     try {
//         const alerts = await monitoringService.getAllAlerts();

//         res.json({
//             success: true,
//             message: 'Alertes récupérées avec succès',
//             data: alerts,
//             count: alerts.length,
//             criticalCount: alerts.filter(a => a.niveau === 'CRITIQUE').length
//         });

//         logger.debug('Alertes consultées', { userId: req.utilisateur.id, alertCount: alerts.length });
//     } catch (error) {
//         logger.error('Erreur récupération alertes', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération des alertes'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/alerts/{type}:
//  *   get:
//  *     summary: Obtenir les alertes d'un type spécifique
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: type
//  *         required: true
//  *         schema:
//  *           type: string
//  *           enum: [BUDGET_DEPASSE, ALERTE_BUDGET, STOCK_BAS, PROJET_EN_RETARD]
//  */
// router.get('/alerts/:type', 
//     //authMiddleware(), 
//     async (req, res) => {
//     try {
//         const { type } = req.params;
//         const alerts = await monitoringService.getAllAlerts();
        
//         const filteredAlerts = alerts.filter(a => a.type === type);

//         res.json({
//             success: true,
//             message: `Alertes ${type} récupérées`,
//             data: filteredAlerts,
//             count: filteredAlerts.length
//         });
//     } catch (error) {
//         logger.error('Erreur filtrage alertes', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors du filtrage des alertes'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/dashboard:
//  *   get:
//  *     summary: Obtenir le tableau de bord complet
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/dashboard', 
//     //authMiddleware(), 
//     async (req, res) => {
//     try {
//         const dashboard = await monitoringService.getDashboard();

//         res.json({
//             success: true,
//             message: 'Tableau de bord récupéré avec succès',
//             data: dashboard
//         });

//         logger.debug('Dashboard consulté', { userId: req.utilisateur.id });
//     } catch (error) {
//         logger.error('Erreur chargement dashboard', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors du chargement du tableau de bord'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/alerts/budget:
//  *   get:
//  *     summary: Obtenir spécifiquement les alertes budgétaires
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/budget-alerts', 
//     //authMiddleware(),
//      async (req, res) => {
//     try {
//         const alerts = await monitoringService.checkBudgetAlerts();

//         res.json({
//             success: true,
//             message: 'Alertes budgétaires récupérées',
//             data: alerts,
//             count: alerts.length
//         });
//     } catch (error) {
//         logger.error('Erreur alertes budgétaires', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération des alertes budgétaires'
//         });
//     }
// });

// /**
//  * @swagger
//  * /monitoring/stock-alerts:
//  *   get:
//  *     summary: Obtenir les alertes de stock
//  *     tags: [Monitoring]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/stock-alerts', 
//   //authMiddleware(), 
//    async (req, res) => {
//     try {
//         const alerts = await monitoringService.checkStockAlerts();

//         res.json({
//             success: true,
//             message: 'Alertes de stock récupérées',
//             data: alerts,
//             count: alerts.length
//         });
//     } catch (error) {
//         logger.error('Erreur alertes stock', error);
//         res.status(500).json({
//             success: false,
//             message: 'Erreur lors de la récupération des alertes de stock'
//         });
//     }
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const { authMiddleware, checkPermission } = require('../../middleware/auth-middleware');
const reportService = require('../../services/report-service');
const monitoringService = require('../../services/monitoring-service');
const logger = require('../../config/logger');

/**
 * @swagger
 * tags:
 *   - name: Exports
 *     description: Export de données en Excel et PDF
 *   - name: Monitoring
 *     description: Surveillance du système et alertes
 */

/**
 * @swagger
 * /exports/projets:
 *   get:
 *     summary: Exporter la liste des projets en Excel
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: statut
 *         schema:
 *           type: string
 *         description: Filtrer par statut
 *       - in: query
 *         name: ministereId
 *         schema:
 *           type: integer
 *         description: Filtrer par ministère
 *     responses:
 *       200:
 *         description: Fichier Excel généré
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 *       500:
 *         description: Erreur lors de la génération
 */
router.get('/projets', 
    //authMiddleware(),
    //checkPermission('export:rapports'), 
    async (req, res) => {
    try {
        const { statut, ministereId } = req.query;
        
        const filters = {};
        if (statut) filters.statut = statut;
        if (ministereId) filters.ministereId = parseInt(ministereId);

        const filePath = await reportService.generateProjetsExcel(filters);

        res.download(filePath, `projets_${Date.now()}.xlsx`, (err) => {
            if (err) {
                logger.error('Erreur lors du téléchargement', err);
            }
        });

        logger.info('Export projets généré', { userId: req.utilisateur?.id });
    } catch (error) {
        logger.error('Erreur export projets', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du rapport'
        });
    }
});

/**
 * @swagger
 * /exports/depenses:
 *   get:
 *     summary: Exporter la liste des dépenses en Excel
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: projetId
 *         schema:
 *           type: integer
 *         description: Filtrer par projet
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: integer
 *         description: Filtrer par site
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Fichier Excel généré
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 *       500:
 *         description: Erreur lors de la génération
 */
router.get('/depenses', 
    //authMiddleware(), 
    //checkPermission('export:rapports'), 
    async (req, res) => {
    try {
        const { projetId, siteId, dateDebut, dateFin } = req.query;

        const filters = {};
        if (projetId) filters.projetId = parseInt(projetId);
        if (siteId) filters.siteId = parseInt(siteId);
        if (dateDebut) filters.dateCreation = { gte: new Date(dateDebut) };
        if (dateFin) {
            if (filters.dateCreation) {
                filters.dateCreation.lte = new Date(dateFin);
            } else {
                filters.dateCreation = { lte: new Date(dateFin) };
            }
        }

        const filePath = await reportService.generateDepensesExcel(filters);

        res.download(filePath, `depenses_${Date.now()}.xlsx`, (err) => {
            if (err) {
                logger.error('Erreur lors du téléchargement', err);
            }
        });

        logger.info('Export dépenses généré', { userId: req.utilisateur?.id });
    } catch (error) {
        logger.error('Erreur export dépenses', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du rapport'
        });
    }
});

/**
 * @swagger
 * /exports/projet/{id}/pdf:
 *   get:
 *     summary: Exporter un projet en PDF
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Fichier PDF généré
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur lors de la génération
 */
router.get('/projet/:id/pdf', 
    //authMiddleware(),
    async (req, res) => {
    try {
        const filePath = await reportService.generateProjetPDF(req.params.id);

        res.download(filePath, `projet_${req.params.id}_${Date.now()}.pdf`, (err) => {
            if (err) {
                logger.error('Erreur lors du téléchargement PDF', err);
            }
        });

        logger.audit('Export PDF générée', req.utilisateur?.id, 'Projet', { projetId: req.params.id });
    } catch (error) {
        logger.error('Erreur export PDF', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du PDF'
        });
    }
});

/**
 * @swagger
 * /exports/synthesis:
 *   get:
 *     summary: Exporter un rapport de synthèse générale
 *     tags: [Exports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Fichier Excel de synthèse généré
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 *       500:
 *         description: Erreur lors de la génération
 */
router.get('/synthesis', 
    //authMiddleware(), 
    //checkPermission('export:rapports'), 
    async (req, res) => {
    try {
        const filePath = await reportService.generateSynthesisExcel();

        res.download(filePath, `synthesis_${Date.now()}.xlsx`, (err) => {
            if (err) {
                logger.error('Erreur lors du téléchargement', err);
            }
        });

        logger.info('Export synthèse généré', { userId: req.utilisateur?.id });
    } catch (error) {
        logger.error('Erreur export synthèse', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la génération du rapport'
        });
    }
});

/**
 * @swagger
 * /monitoring/health:
 *   get:
 *     summary: Vérifier la santé du système
 *     tags: [Monitoring]
 *     responses:
 *       200:
 *         description: Système en bonne santé
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "healthy"
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 *                 services:
 *                   type: object
 *       503:
 *         description: Système dégradé
 */
router.get('/health', async (req, res) => {
    try {
        const health = await monitoringService.healthCheck();

        const statusCode = health.status === 'healthy' ? 200 : 503;
        res.status(statusCode).json(health);
    } catch (error) {
        logger.error('Erreur health check', error);
        res.status(503).json({
            status: 'unhealthy',
            error: error.message
        });
    }
});

/**
 * @swagger
 * /monitoring/metrics:
 *   get:
 *     summary: Obtenir les métriques du système
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Métriques récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     projetsCount:
 *                       type: integer
 *                     depensesTotal:
 *                       type: number
 *                     alertesCount:
 *                       type: integer
 *                     performance:
 *                       type: number
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Permission refusée
 *       500:
 *         description: Erreur serveur
 */
router.get('/metrics', 
    //authMiddleware(), 
    //checkPermission('view:rapports'), 
    async (req, res) => {
    try {
        const metrics = await monitoringService.getMetrics();

        res.json({
            success: true,
            message: 'Métriques récupérées avec succès',
            data: metrics
        });

        logger.debug('Métriques consultées', { userId: req.utilisateur?.id });
    } catch (error) {
        logger.error('Erreur récupération métriques', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des métriques'
        });
    }
});

/**
 * @swagger
 * /monitoring/alerts:
 *   get:
 *     summary: Obtenir les alertes en cours
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des alertes récupérée
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alerte'
 *                 count:
 *                   type: integer
 *                 criticalCount:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/alerts', 
    //authMiddleware(), 
    async (req, res) => {
    try {
        const alerts = await monitoringService.getAllAlerts();

        res.json({
            success: true,
            message: 'Alertes récupérées avec succès',
            data: alerts,
            count: alerts.length,
            criticalCount: alerts.filter(a => a.niveau === 'CRITIQUE').length
        });

        logger.debug('Alertes consultées', { userId: req.utilisateur?.id, alertCount: alerts.length });
    } catch (error) {
        logger.error('Erreur récupération alertes', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des alertes'
        });
    }
});

/**
 * @swagger
 * /monitoring/alerts/{type}:
 *   get:
 *     summary: Obtenir les alertes d'un type spécifique
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [BUDGET_DEPASSE, ALERTE_BUDGET, STOCK_BAS, PROJET_EN_RETARD]
 *         description: Type d'alerte
 *     responses:
 *       200:
 *         description: Alertes filtrées récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alerte'
 *                 count:
 *                   type: integer
 *       400:
 *         description: Type d'alerte invalide
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/alerts/:type', 
    //authMiddleware(), 
    async (req, res) => {
    try {
        const { type } = req.params;
        const alerts = await monitoringService.getAllAlerts();
        
        const filteredAlerts = alerts.filter(a => a.type === type);

        res.json({
            success: true,
            message: `Alertes ${type} récupérées`,
            data: filteredAlerts,
            count: filteredAlerts.length
        });
    } catch (error) {
        logger.error('Erreur filtrage alertes', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du filtrage des alertes'
        });
    }
});

/**
 * @swagger
 * /monitoring/dashboard:
 *   get:
 *     summary: Obtenir le tableau de bord complet
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tableau de bord récupéré
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Dashboard'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/dashboard', 
    //authMiddleware(), 
    async (req, res) => {
    try {
        const dashboard = await monitoringService.getDashboard();

        res.json({
            success: true,
            message: 'Tableau de bord récupéré avec succès',
            data: dashboard
        });

        logger.debug('Dashboard consulté', { userId: req.utilisateur?.id });
    } catch (error) {
        logger.error('Erreur chargement dashboard', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors du chargement du tableau de bord'
        });
    }
});

/**
 * @swagger
 * /monitoring/alerts/budget:
 *   get:
 *     summary: Obtenir spécifiquement les alertes budgétaires
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alertes budgétaires récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alerte'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/budget-alerts', 
    //authMiddleware(),
    async (req, res) => {
    try {
        const alerts = await monitoringService.checkBudgetAlerts();

        res.json({
            success: true,
            message: 'Alertes budgétaires récupérées',
            data: alerts,
            count: alerts.length
        });
    } catch (error) {
        logger.error('Erreur alertes budgétaires', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des alertes budgétaires'
        });
    }
});

/**
 * @swagger
 * /monitoring/stock-alerts:
 *   get:
 *     summary: Obtenir les alertes de stock
 *     tags: [Monitoring]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alertes de stock récupérées
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Alerte'
 *                 count:
 *                   type: integer
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/stock-alerts', 
    //authMiddleware(), 
    async (req, res) => {
    try {
        const alerts = await monitoringService.checkStockAlerts();

        res.json({
            success: true,
            message: 'Alertes de stock récupérées',
            data: alerts,
            count: alerts.length
        });
    } catch (error) {
        logger.error('Erreur alertes stock', error);
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des alertes de stock'
        });
    }
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Alerte:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         type:
 *           type: string
 *           enum: [BUDGET_DEPASSE, ALERTE_BUDGET, STOCK_BAS, PROJET_EN_RETARD]
 *         niveau:
 *           type: string
 *           enum: [CRITIQUE, ELEVE, MOYEN, FAIBLE]
 *         titre:
 *           type: string
 *         description:
 *           type: string
 *         entiteId:
 *           type: string
 *         entiteType:
 *           type: string
 *         dateCreation:
 *           type: string
 *           format: date-time
 *         estResolue:
 *           type: boolean
 *     Dashboard:
 *       type: object
 *       properties:
 *         projets:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             enCours:
 *               type: integer
 *             termines:
 *               type: integer
 *         budget:
 *           type: object
 *           properties:
 *             totalAlloue:
 *               type: number
 *             totalDepense:
 *               type: number
 *             pourcentageUtilise:
 *               type: number
 *         alertes:
 *           type: object
 *           properties:
 *             total:
 *               type: integer
 *             critiques:
 *               type: integer
 *         performance:
 *           type: object
 *           properties:
 *             moyenne:
 *               type: number
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;