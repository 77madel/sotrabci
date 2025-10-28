// /*
// const express = require('express');
// const router = express.Router();
// const besoinController = require('../controllers/BesoinController');
// const { authenticateToken, requireRole } = require('../middleware/auth');

// /!**
//  * @swagger
//  * /api/besoins:
//  *   post:
//  *     summary: Soumettre un nouveau besoin
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - description
//  *               - montantEstime
//  *               - projetId
//  *             properties:
//  *               description:
//  *                 type: string
//  *               montantEstime:
//  *                 type: number
//  *               projetId:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Besoin soumis avec succès
//  *!/
// router.post('/',
//    // authenticateToken,
//     besoinController.createBesoin);

// /!**
//  * @swagger
//  * /api/besoins/projet/{projetId}:
//  *   get:
//  *     summary: Récupérer les besoins d'un projet
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: projetId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     responses:
//  *       200:
//  *         description: Liste des besoins du projet
//  *!/
// router.get('/projet/:projetId',
//     //authenticateToken,
//     besoinController.getBesoinsByProjet);

// /!**
//  * @swagger
//  * /api/besoins/{besoinId}/valider:
//  *   patch:
//  *     summary: Valider ou refuser un besoin
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  *     parameters:
//  *       - in: path
//  *         name: besoinId
//  *         required: true
//  *         schema:
//  *           type: string
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - decision
//  *             properties:
//  *               decision:
//  *                 type: boolean
//  *                 description: true pour valider, false pour refuser
//  *     responses:
//  *       200:
//  *         description: Besoin validé/refusé avec succès
//  *!/
// router.patch('/:besoinId/valider',
//     //authenticateToken,
//     //requireRole(['ADMIN', 'DIRIGEANT']),
//     besoinController.validerBesoin);

// /!**
//  * @swagger
//  * /api/besoins/en-attente:
//  *   get:
//  *     summary: Récupérer les besoins en attente de validation
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Liste des besoins en attente
//  *!/
// router.get('/en-attente',
//     //authenticateToken,
//     besoinController.getBesoinsEnAttente);

// module.exports = router;*/

// const express = require('express');
// const router = express.Router();
// const besoinController = require('../controllers/BesoinController');
// const { authenticateToken, requireRole } = require('../middleware/auth');

// /**
//  * @swagger
//  * tags:
//  *   name: Besoins
//  *   description: Gestion des besoins
//  */

// /**
//  * @swagger
//  * /api/besoins:
//  *   post:
//  *     summary: Créer un nouveau besoin
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/',
//     //authenticateToken,
//     besoinController.createBesoin);

// /**
//  * @swagger
//  * /api/besoins/projet/{projetId}:
//  *   get:
//  *     summary: Récupérer les besoins d'un projet
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/projet/:projetId',
//     //authenticateToken,
//     besoinController.getBesoinsByProjet);

// /**
//  * @swagger
//  * /api/besoins/{besoinId}/valider:
//  *   patch:
//  *     summary: Valider ou refuser un besoin
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.patch('/:besoinId/valider',
//     //authenticateToken,
//     //requireRole(['ADMIN', 'DIRIGEANT']),
//     besoinController.validerBesoin);

// /**
//  * @swagger
//  * /api/besoins/en-attente:
//  *   get:
//  *     summary: Récupérer les besoins en attente de validation
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/en-attente',
//     //authenticateToken,
//     //requireRole(['ADMIN', 'DIRIGEANT']),
//     besoinController.getBesoinsEnAttente);

// /**
//  * @swagger
//  * /api/besoins/{id}:
//  *   get:
//  *     summary: Récupérer un besoin par son ID
//  *     tags: [Besoins]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/:id',
//     //authenticateToken,
//     besoinController.getBesoinById);

// module.exports = router;



const express = require('express');
const router = express.Router();
const besoinController = require('../controllers/BesoinController');
const { authenticateToken, requireRole } = require('../middleware/auth');

// MIDDLEWARE TEMPORAIRE
// const authenticateToken = (req, res, next) => {
//     console.log('Middleware auth temporaire appelé');
//     // Simuler un user pour les tests
//     req.user = { id: 'user-temporaire', role: 'RESPONSABLE' };
//     next();
// };

// Utilisez le middleware temporaire
//router.post('/', authenticateToken, besoinController.createBesoin);

/**
 * @swagger
 * tags:
 *   name: Besoins
 *   description: Gestion des besoins financiers des projets
 */

/**
 * @swagger
 * /api/besoins:
 *   post:
 *     summary: Créer un nouveau besoin
 *     tags: [Besoins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - description
 *               - montantEstime
 *               - projetId
 *             properties:
 *               description:
 *                 type: string
 *                 example: "Achat de matériel informatique"
 *               montantEstime:
 *                 type: number
 *                 example: 5000
 *               projetId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Besoin créé avec succès
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
 *                   $ref: '#/components/schemas/Besoin'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 */
router.post('/',
    authenticateToken(),
    besoinController.createBesoin);

/**
 * @swagger
 * /api/besoins/projet/{projetId}:
 *   get:
 *     summary: Récupérer les besoins d'un projet
 *     tags: [Besoins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Liste des besoins du projet
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Besoin'
 *       400:
 *         description: ID projet manquant
 *       500:
 *         description: Erreur serveur
 */
router.get('/projet/:projetId',
    authenticateToken(),
    besoinController.getBesoinsByProjet);

/**
 * @swagger
 * /api/besoins/{besoinId}/valider:
 *   patch:
 *     summary: Valider ou refuser un besoin
 *     tags: [Besoins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: besoinId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du besoin à valider
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - decision
 *             properties:
 *               decision:
 *                 type: boolean
 *                 description: true pour valider, false pour refuser
 *                 example: true
 *     responses:
 *       200:
 *         description: Besoin validé/refusé avec succès
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
 *                   $ref: '#/components/schemas/Besoin'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Besoin non trouvé
 */
router.patch('/:besoinId/valider',
    // authenticateToken,
    // requireRole(['ADMIN', 'DIRIGEANT']),
    besoinController.validerBesoin);

/**
 * @swagger
 * /api/besoins/en-attente:
 *   get:
 *     summary: Récupérer les besoins en attente de validation
 *     tags: [Besoins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des besoins en attente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Besoin'
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/en-attente',
    // authenticateToken,
    // requireRole(['ADMIN', 'DIRIGEANT']),
    besoinController.getBesoinsEnAttente);

/**
 * @swagger
 * /api/besoins/{id}:
 *   get:
 *     summary: Récupérer un besoin par son ID
 *     tags: [Besoins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du besoin
 *     responses:
 *       200:
 *         description: Détails du besoin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Besoin'
 *       400:
 *         description: ID manquant
 *       404:
 *         description: Besoin non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id',
    authenticateToken(),
    besoinController.getBesoinById);

/**
 * @swagger
 * components:
 *   schemas:
 *     Besoin:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du besoin
 *         description:
 *           type: string
 *           description: Description du besoin
 *         montantEstime:
 *           type: number
 *           description: Montant estimé du besoin
 *         statut:
 *           type: string
 *           enum: [EN_ATTENTE, VALIDE, REFUSE]
 *           description: Statut du besoin
 *         projetId:
 *           type: string
 *           description: ID du projet associé
 *         createurId:
 *           type: string
 *           description: ID du créateur du besoin
 *         validateurId:
 *           type: string
 *           description: ID du validateur (si validé/refusé)
 *         dateValidation:
 *           type: string
 *           format: date-time
 *           description: Date de validation
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */

module.exports = router;