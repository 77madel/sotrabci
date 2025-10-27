const express = require('express');
const router = express.Router();
const salarieController = require('../controllers/SalarieController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * /api/salaries:
 *   post:
 *     summary: Ajouter un nouveau salarié
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nom
 *               - prenom
 *               - poste
 *               - salaireBase
 *               - dateEmbauche
 *             properties:
 *               nom:
 *                 type: string
 *               prenom:
 *                 type: string
 *               poste:
 *                 type: string
 *               salaireBase:
 *                 type: number
 *               dateEmbauche:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Salarié créé avec succès
 */
router.post('/', 
    //authenticateToken, 
   // requireRole(['ADMIN', 'DIRIGEANT']), 
    salarieController.createSalarie);

/**
 * @swagger
 * /api/salaries:
 *   get:
 *     summary: Récupérer tous les salariés
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des salariés
 */
router.get('/', 
    //authenticateToken, 
    salarieController.getSalaries);

/**
 * @swagger
 * /api/salaries/affecter:
 *   post:
 *     summary: Affecter un salarié à un projet
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - salarieId
 *               - projetId
 *             properties:
 *               salarieId:
 *                 type: string
 *               projetId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Salarié affecté avec succès
 */
router.post('/affecter', 
    //authenticateToken, 
    //requireRole(['ADMIN', 'DIRIGEANT', 'RESPONSABLE']),
     salarieController.affecterSalarie);

/**
 * @swagger
 * /api/salaries/{salarieId}/bulletin:
 *   post:
 *     summary: Générer un bulletin de paie
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: salarieId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - mois
 *               - annee
 *             properties:
 *               mois:
 *                 type: number
 *               annee:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bulletin de paie généré
 */
router.post('/:salarieId/bulletin', 
    //authenticateToken, 
    salarieController.genererBulletinPaie);

/**
 * @swagger
 * /api/salaries/projet/{projetId}:
 *   get:
 *     summary: Récupérer les salariés d'un projet
 *     tags: [Salaries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des salariés du projet
 */
router.get('/projet/:projetId', 
    //authenticateToken, 
    salarieController.getSalariesByProjet);

module.exports = router;