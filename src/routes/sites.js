// const express = require('express');
// const router = express.Router();
// const siteController = require('../controllers/SiteController');
// const { authenticateToken, requireRole } = require('../middleware/auth');

// /**
//  * @swagger
//  * tags:
//  *   name: Sites
//  *   description: Gestion des sites
//  */

// /**
//  * @swagger
//  * /api/sites:
//  *   post:
//  *     summary: Créer un nouveau site
//  *     tags: [Sites]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.post('/',
//     //authenticateToken,
//     //requireRole(['ADMIN', 'DIRIGEANT']),
//     siteController.createSite);

// /**
//  * @swagger
//  * /api/sites:
//  *   get:
//  *     summary: Récupérer tous les sites
//  *     tags: [Sites]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/',
//     //authenticateToken,
//     siteController.getSites);

// /**
//  * @swagger
//  * /api/sites/{id}:
//  *   get:
//  *     summary: Récupérer un site par son ID
//  *     tags: [Sites]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/:id',
//     //authenticateToken,
//     siteController.getSiteById);

// /**
//  * @swagger
//  * /api/sites/responsable/{responsableId}:
//  *   get:
//  *     summary: Récupérer les sites d'un responsable
//  *     tags: [Sites]
//  *     security:
//  *       - bearerAuth: []
//  */
// router.get('/responsable/:responsableId',
//     //authenticateToken,
//     siteController.getSitesByResponsable);

// module.exports = router;



const express = require('express');
const router = express.Router();
const siteController = require('../controllers/SiteController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Sites
 *   description: Gestion des sites de construction
 */

/**
 * @swagger
 * /api/sites:
 *   post:
 *     summary: Créer un nouveau site
 *     tags: [Sites]
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
 *               - adresse
 *               - responsableSite
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Chantier Centre-ville"
 *               adresse:
 *                 type: string
 *                 example: "123 Rue Principale, Paris"
 *               responsableSite:
 *                 type: string
 *                 description: ID du responsable du site
 *                 example: "507f1f77bcf86cd799439011"
 *     responses:
 *       201:
 *         description: Site créé avec succès
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
 *                   $ref: '#/components/schemas/Site'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 */
router.post('/',
    //authenticateToken,
    //requireRole(['ADMIN', 'DIRIGEANT']),
    siteController.createSite);

/**
 * @swagger
 * /api/sites:
 *   get:
 *     summary: Récupérer tous les sites
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste de tous les sites
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
 *                     $ref: '#/components/schemas/Site'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 */
router.get('/',
    //authenticateToken,
    siteController.getSites);

/**
 * @swagger
 * /api/sites/{id}:
 *   get:
 *     summary: Récupérer un site par son ID
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du site
 *     responses:
 *       200:
 *         description: Détails du site
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Site'
 *       400:
 *         description: ID manquant
 *       404:
 *         description: Site non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id',
    //authenticateToken,
    siteController.getSiteById);

/**
 * @swagger
 * /api/sites/responsable/{responsableId}:
 *   get:
 *     summary: Récupérer les sites d'un responsable
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: responsableId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du responsable
 *     responses:
 *       200:
 *         description: Liste des sites du responsable
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
 *                     $ref: '#/components/schemas/Site'
 *       400:
 *         description: ID responsable manquant
 *       403:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 */
router.get('/responsable/:responsableId',
    //authenticateToken,
    siteController.getSitesByResponsable);

/**
 * @swagger
 * /api/sites/{id}:
 *   put:
 *     summary: Mettre à jour un site
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du site à modifier
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nom:
 *                 type: string
 *                 example: "Nouveau nom du chantier"
 *               adresse:
 *                 type: string
 *                 example: "456 Nouvelle Adresse, Lyon"
 *               responsableSite:
 *                 type: string
 *                 example: "507f1f77bcf86cd799439012"
 *     responses:
 *       200:
 *         description: Site mis à jour avec succès
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
 *                   $ref: '#/components/schemas/Site'
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Site non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id',
    //authenticateToken,
    //requireRole(['ADMIN', 'DIRIGEANT']),
    siteController.updateSite);

/**
 * @swagger
 * /api/sites/{id}:
 *   delete:
 *     summary: Supprimer un site
 *     tags: [Sites]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du site à supprimer
 *     responses:
 *       200:
 *         description: Site supprimé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *       404:
 *         description: Site non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id',
    //authenticateToken,
    //requireRole(['ADMIN', 'DIRIGEANT']),
    siteController.deleteSite);

/**
 * @swagger
 * components:
 *   schemas:
 *     Site:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: ID unique du site
 *         nom:
 *           type: string
 *           description: Nom du site/chantier
 *         adresse:
 *           type: string
 *           description: Adresse complète du site
 *         responsableSite:
 *           type: string
 *           description: ID du responsable du site
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