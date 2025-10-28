// const express = require('express');
// const router = express.Router();
// const depenseController = require('../controllers/DepenseController');
// const { authenticateToken, requireRole } = require('../middleware/auth');

// /**
//  * @swagger
//  * /api/depenses:
//  *   post:
//  *     summary: Enregistrer une nouvelle dépense
//  *     tags: [Depenses]
//  *     security:
//  *       - bearerAuth: []
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required:
//  *               - montant
//  *               - typeDepense
//  *               - beneficiaire
//  *               - projetId
//  *               - caisseId
//  *             properties:
//  *               montant:
//  *                 type: number
//  *               typeDepense:
//  *                 type: string
//  *                 enum: [SALAIRE, MATERIEL, SERVICE, FRAIS]
//  *               beneficiaire:
//  *                 type: string
//  *               projetId:
//  *                 type: string
//  *               caisseId:
//  *                 type: string
//  *               besoinId:
//  *                 type: string
//  *               justificatif:
//  *                 type: string
//  *     responses:
//  *       201:
//  *         description: Dépense enregistrée avec succès
//  */
// router.post('/', 
//     //authenticateToken, 
//     depenseController.createDepense);

// /**
//  * @swagger
//  * /api/depenses/projet/{projetId}:
//  *   get:
//  *     summary: Récupérer les dépenses d'un projet
//  *     tags: [Depenses]
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
//  *         description: Liste des dépenses du projet
//  */
// router.get('/projet/:projetId', 
//     //authenticateToken, 
//     depenseController.getDepensesByProjet);

// /**
//  * @swagger
//  * /api/depenses/statistiques:
//  *   get:
//  *     summary: Récupérer les statistiques des dépenses
//  *     tags: [Depenses]
//  *     security:
//  *       - bearerAuth: []
//  *     responses:
//  *       200:
//  *         description: Statistiques des dépenses
//  */
// router.get('/statistiques', 
//     //authenticateToken, 
//     depenseController.getStatistiques);

// module.exports = router;


const express = require('express');
const router = express.Router();
const depenseController = require('../controllers/DepenseController');
const { authenticateToken } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Depenses
 *   description: Gestion des dépenses des projets
 */

/**
 * @swagger
 * /api/depenses:
 *   post:
 *     summary: Enregistrer une nouvelle dépense
 *     tags: [Depenses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - montant
 *               - typeDepense
 *               - beneficiaire
 *               - projetId
 *               - caisseId
 *             properties:
 *               montant:
 *                 type: number
 *                 minimum: 0.01
 *                 example: 1500.50
 *                 description: Montant de la dépense
 *               typeDepense:
 *                 type: string
 *                 enum: [SALAIRE, MATERIEL, SERVICE, FRAIS]
 *                 example: "MATERIEL"
 *                 description: Type de dépense
 *               beneficiaire:
 *                 type: string
 *                 example: "Fournisseur XYZ"
 *                 description: Nom du bénéficiaire
 *               projetId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439011"
 *                 description: ID du projet associé
 *               caisseId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *                 description: ID de la caisse utilisée
 *               besoinId:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439013"
 *                 description: ID du besoin associé (optionnel)
 *               justificatif:
 *                 type: string
 *                 example: "Facture F2024001"
 *                 description: Référence du justificatif
 *               description:
 *                 type: string
 *                 example: "Achat de matériel informatique"
 *                 description: Description détaillée
 *     responses:
 *       201:
 *         description: Dépense enregistrée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Dépense enregistrée avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Depense'
 *       400:
 *         description: Données invalides ou champs manquants
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.post('/', 
    authenticateToken(), 
    depenseController.createDepense);

/**
 * @swagger
 * /api/depenses/projet/{projetId}:
 *   get:
 *     summary: Récupérer les dépenses d'un projet
 *     tags: [Depenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projetId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *         example: "507f1f77bcf86cd799439011"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Numéro de page
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Nombre d'éléments par page
 *       - in: query
 *         name: typeDepense
 *         schema:
 *           type: string
 *           enum: [SALAIRE, MATERIEL, SERVICE, FRAIS]
 *         description: Filtrer par type de dépense
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
 *         description: Liste des dépenses du projet
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
 *                     $ref: '#/components/schemas/Depense'
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
 *       400:
 *         description: ID projet invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/projet/:projetId', 
    authenticateToken(), 
    depenseController.getDepensesByProjet);

/**
 * @swagger
 * /api/depenses/statistiques:
 *   get:
 *     summary: Récupérer les statistiques des dépenses
 *     tags: [Depenses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: periode
 *         schema:
 *           type: string
 *           enum: [JOUR, SEMAINE, MOIS, ANNEE, TOUT]
 *           default: MOIS
 *         description: Période d'analyse
 *       - in: query
 *         name: projetId
 *         schema:
 *           type: string
 *         description: Filtrer par projet spécifique
 *       - in: query
 *         name: siteId
 *         schema:
 *           type: string
 *         description: Filtrer par site spécifique
 *       - in: query
 *         name: dateDebut
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de début personnalisée
 *       - in: query
 *         name: dateFin
 *         schema:
 *           type: string
 *           format: date
 *         description: Date de fin personnalisée
 *     responses:
 *       200:
 *         description: Statistiques des dépenses récupérées avec succès
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
 *                     totalDepenses:
 *                       type: number
 *                       example: 125000.75
 *                       description: Total des dépenses sur la période
 *                     depensesParType:
 *                       type: object
 *                       properties:
 *                         SALAIRE:
 *                           type: number
 *                           example: 50000
 *                         MATERIEL:
 *                           type: number
 *                           example: 45000.75
 *                         SERVICE:
 *                           type: number
 *                           example: 20000
 *                         FRAIS:
 *                           type: number
 *                           example: 10000
 *                     evolutionMensuelle:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           mois:
 *                             type: string
 *                             example: "2024-01"
 *                           total:
 *                             type: number
 *                             example: 25000.50
 *                     topBeneficiaires:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           beneficiaire:
 *                             type: string
 *                             example: "Fournisseur ABC"
 *                           montantTotal:
 *                             type: number
 *                             example: 35000.25
 *                           nombreDepenses:
 *                             type: integer
 *                             example: 12
 *                     budgetUtilise:
 *                       type: number
 *                       example: 65.5
 *                       description: Pourcentage du budget utilisé
 *                     alertes:
 *                       type: object
 *                       properties:
 *                         depensesHorsBudget:
 *                           type: integer
 *                           example: 3
 *                         depensesSansJustificatif:
 *                           type: integer
 *                           example: 2
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur lors du calcul des statistiques
 */
router.get('/statistiques', 
    authenticateToken(), 
    depenseController.getStatistiques);

/**
 * @swagger
 * components:
 *   schemas:
 *     Depense:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique de la dépense
 *         montant:
 *           type: number
 *           description: Montant de la dépense
 *         typeDepense:
 *           type: string
 *           enum: [SALAIRE, MATERIEL, SERVICE, FRAIS]
 *           description: Type de dépense
 *         beneficiaire:
 *           type: string
 *           description: Nom du bénéficiaire
 *         description:
 *           type: string
 *           description: Description détaillée
 *         justificatif:
 *           type: string
 *           description: Référence du justificatif
 *         statut:
 *           type: string
 *           enum: [BROUILLON, VALIDEE, COMPTABILISEE, ANNULEE]
 *           description: Statut de la dépense
 *         projetId:
 *           type: string
 *           description: ID du projet associé
 *         caisseId:
 *           type: string
 *           description: ID de la caisse utilisée
 *         besoinId:
 *           type: string
 *           description: ID du besoin associé
 *         createurId:
 *           type: string
 *           description: ID de l'utilisateur qui a créé la dépense
 *         dateCreation:
 *           type: string
 *           format: date-time
 *           description: Date de création
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