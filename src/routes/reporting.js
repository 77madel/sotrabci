const express = require('express');
const router = express.Router();
const reportingController = require('../controllers/ReportingController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * /api/reporting/dashboard:
 *   get:
 *     summary: Récupérer le tableau de bord
 *     tags: [Reporting]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Tableau de bord avec statistiques
 */
router.get('/dashboard', 
    //authenticateToken, 
    reportingController.getTableauDeBord);

/**
 * @swagger
 * /api/reporting/financier:
 *   get:
 *     summary: Générer un rapport financier
 *     tags: [Reporting]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: debut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début (YYYY-MM-DD)
 *       - in: query
 *         name: fin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Rapport financier généré
 */
router.get('/financier', 
    //authenticateToken, 
    reportingController.getRapportFinancier);

module.exports = router;