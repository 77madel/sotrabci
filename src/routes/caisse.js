const express = require('express');
const router = express.Router();
const caisseController = require('../controllers/CaisseController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Caisse
 *   description: Gestion de la caisse générale et des mouvements financiers
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Caisse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID de la caisse
 *         soldeInitial:
 *           type: number
 *           format: float
 *           description: Solde initial de la caisse
 *           example: 100000.00
 *         soldeActuel:
 *           type: number
 *           format: float
 *           description: Solde actuel de la caisse
 *           example: 75000.50
 *         devise:
 *           type: string
 *           description: Devise utilisée
 *           example: "EUR"
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     MouvementCaisse:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         typeMouvement:
 *           type: string
 *           enum: [APPROVISIONNEMENT, ALLOCATION, DEPENSE]
 *         montant:
 *           type: number
 *           format: float
 *         description:
 *           type: string
 *         reference:
 *           type: string
 *         dateMouvement:
 *           type: string
 *           format: date-time
 *         utilisateur:
 *           type: object
 *           properties:
 *             nom:
 *               type: string
 *             email:
 *               type: string
 *
 *     ApprovisionnementInput:
 *       type: object
 *       required:
 *         - montant
 *       properties:
 *         montant:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 5000.00
 *         description:
 *           type: string
 *           example: "Approvisionnement mensuel"
 *
 *     AllocationBudgetInput:
 *       type: object
 *       required:
 *         - projetId
 *         - montant
 *       properties:
 *         projetId:
 *           type: string
 *           example: "clk5w8d9q0000xyz"
 *         montant:
 *           type: number
 *           format: float
 *           minimum: 0.01
 *           example: 15000.00
 *         description:
 *           type: string
 *           example: "Budget initial pour le projet"
 */

/**
 * @swagger
 * /api/caisse/solde:
 *   get:
 *     summary: Récupérer le solde actuel de la caisse
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Solde de la caisse récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Caisse'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/solde',
    authenticateToken(),
    caisseController.getSolde);

/**
 * @swagger
 * /api/caisse/approvisionner:
 *   post:
 *     summary: Approvisionner la caisse générale
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ApprovisionnementInput'
 *     responses:
 *       200:
 *         description: Caisse approvisionnée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Caisse'
 *       400:
 *         description: Données invalides ou montant incorrect
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé (rôle insuffisant)
 *       500:
 *         description: Erreur serveur
 */
router.post('/approvisionner',
    authenticateToken(),
    caisseController.approvisionner);

/**
 * @swagger
 * /api/caisse/allouer-budget:
 *   post:
 *     summary: Allouer un budget à un projet depuis la caisse
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AllocationBudgetInput'
 *     responses:
 *       200:
 *         description: Budget alloué avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     montantAlloue:
 *                       type: number
 *                     projetId:
 *                       type: string
 *       400:
 *         description: Données invalides, solde insuffisant ou projet non trouvé
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.post('/allouer-budget',
    authenticateToken(),
    caisseController.allouerBudget);

/**
 * @swagger
 * /api/caisse/mouvements:
 *   get:
 *     summary: Récupérer l'historique des mouvements de caisse
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page pour la pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: typeMouvement
 *         schema:
 *           type: string
 *           enum: [APPROVISIONNEMENT, ALLOCATION, DEPENSE]
 *         description: Filtrer par type de mouvement
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début pour filtrer (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin pour filtrer (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Historique des mouvements récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MouvementCaisse'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/mouvements',
    authenticateToken(),
    caisseController.getMouvements);

/**
 * @swagger
 * /api/caisse/rapport-financier:
 *   get:
 *     summary: Générer un rapport financier détaillé
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *           required: true
 *         description: Date de début du rapport (YYYY-MM-DD)
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *           required: true
 *         description: Date de fin du rapport (YYYY-MM-DD)
 *     responses:
 *       200:
 *         description: Rapport financier généré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     periode:
 *                       type: object
 *                       properties:
 *                         debut:
 *                           type: string
 *                         fin:
 *                           type: string
 *                     soldeInitial:
 *                       type: number
 *                     soldeFinal:
 *                       type: number
 *                     totalApprovisionnements:
 *                       type: number
 *                     totalAllocations:
 *                       type: number
 *                     totalDepenses:
 *                       type: number
 *                     mouvements:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/MouvementCaisse'
 *       400:
 *         description: Période invalide
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/rapport-financier',
    authenticateToken(),
    caisseController.getRapportFinancier);

/**
 * @swagger
 * /api/caisse/alertes:
 *   get:
 *     summary: Récupérer les alertes de la caisse (solde faible, etc.)
 *     tags: [Caisse]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Alertes récupérées avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     soldeFaible:
 *                       type: boolean
 *                     seuilAtteint:
 *                       type: boolean
 *                     message:
 *                       type: string
 *                     soldeActuel:
 *                       type: number
 *                     seuilAlerte:
 *                       type: number
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/alertes',
    authenticateToken(),
    caisseController.getAlertes);

module.exports = router;