/*

const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');
const { authenticateToken, requireRole } = require('../middleware/auth');

/!**
 * @swagger
 * tags:
 *   name: Projets
 *   description: Gestion des projets
 *!/

/!**
 * @swagger
 * components:
 *   schemas:
 *     Projet:
 *       type: object
 *       required:
 *         - nom
 *         - ministere
 *         - dateDebut
 *       properties:
 *         id:
 *           type: string
 *           description: ID auto-généré du projet
 *         nom:
 *           type: string
 *           description: Nom du projet
 *           example: "Modernisation Infrastructure"
 *         ministere:
 *           type: string
 *           description: Ministère responsable
 *           example: "Intérieur"
 *         responsableId:
 *           type: string
 *           description: ID du responsable du projet
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           description: Date de début du projet
 *         dateFin:
 *           type: string
 *           format: date-time
 *           description: Date de fin prévue du projet
 *         statut:
 *           type: string
 *           enum: [ACTIF, TERMINE, SUSPENDU]
 *           default: ACTIF
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     ProjetInput:
 *       type: object
 *       required:
 *         - nom
 *         - ministere
 *         - dateDebut
 *       properties:
 *         nom:
 *           type: string
 *           example: "Nouveau Projet"
 *         ministere:
 *           type: string
 *           example: "Éducation"
 *         dateDebut:
 *           type: string
 *           format: date-time
 *           example: "2024-01-01T00:00:00.000Z"
 *         dateFin:
 *           type: string
 *           format: date-time
 *           example: "2024-12-31T00:00:00.000Z"
 *!/

/!**
 * @swagger
 * /api/projets:
 *   post:
 *     summary: Créer un nouveau projet
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjetInput'
 *     responses:
 *       201:
 *         description: Projet créé avec succès
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
 *                   example: "Projet créé avec succès"
 *                 data:
 *                   $ref: '#/components/schemas/Projet'
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       500:
 *         description: Erreur serveur
 *!/
router.post('/', authenticateToken, requireRole(['ADMIN', 'DIRIGEANT']), projetController.createProjet);

/!**
 * @swagger
 * /api/projets:
 *   get:
 *     summary: Récupérer tous les projets
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Liste des projets récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Projet'
 *       401:
 *         description: Non authentifié
 *       500:
 *         description: Erreur serveur
 *!/
router.get('/', authenticateToken, projetController.getProjets);

/!**
 * @swagger
 * /api/projets/{id}:
 *   get:
 *     summary: Récupérer un projet par son ID
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Projet'
 *       400:
 *         description: ID invalide
 *       401:
 *         description: Non authentifié
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 *!/
router.get('/:id', authenticateToken, projetController.getProjetById);

/!**
 * @swagger
 * /api/projets/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProjetInput'
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 *!/
router.put('/:id', authenticateToken, projetController.updateProjet);

/!**
 * @swagger
 * /api/projets/responsable/{responsableId}:
 *   get:
 *     summary: Récupérer les projets d'un responsable
 *     tags: [Projets]
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
 *         description: Projets du responsable récupérés avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Accès non autorisé
 *       500:
 *         description: Erreur serveur
 *!/
router.get('/responsable/:responsableId', authenticateToken, projetController.getProjetsByResponsable);

/!**
 * @swagger
 * /api/projets/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID du projet
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *       401:
 *         description: Non authentifié
 *       403:
 *         description: Non autorisé
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 *!/
router.delete('/:id', authenticateToken, requireRole(['ADMIN', 'DIRIGEANT']), projetController.deleteProjet);

module.exports = router;*/

const express = require('express');
const router = express.Router();
const projetController = require('../controllers/ProjetController');
const { authenticateToken } = require('../middleware/auth');

    /**
     * @swagger
     * tags:
     *   - name: Projets
     *     description: Gestion des projets
     */

    /**
     * @swagger
     * components:
     *   schemas:
     *     Projet:
     *       type: object
     *       properties:
     *         id:
     *           type: string
     *           description: Identifiant du projet
     *         nom:
     *           type: string
     *           description: Nom du projet
     *           example: Modernisation Infrastructure
     *         ministere:
     *           type: string
     *           description: Ministère responsable
     *           example: Intérieur
     *         responsableId:
     *           type: string
     *           description: ID du responsable du projet
     *         siteId:
     *           type: string
     *           nullable: true
     *           description: ID du site associé (optionnel)
     *         dateDebut:
     *           type: string
     *           format: date-time
     *           description: Date de début du projet
     *           example: 2025-01-01T00:00:00.000Z
     *         dateFin:
     *           type: string
     *           format: date-time
     *           nullable: true
     *           description: Date de fin du projet (optionnel)
     *         statut:
     *           type: string
     *           enum: [ACTIF, TERMINE, SUSPENDU]
     *           description: Statut du projet
     *         createdAt:
     *           type: string
     *           format: date-time
     *         updatedAt:
     *           type: string
     *           format: date-time
     *     ProjetInput:
     *       type: object
     *       required: [nom, ministere, dateDebut]
     *       properties:
     *         nom:
     *           type: string
     *           example: Nouveau Projet
     *         ministere:
     *           type: string
     *           example: Éducation
     *         dateDebut:
     *           type: string
     *           format: date-time
     *           example: 2025-01-01T00:00:00.000Z
     *         dateFin:
     *           type: string
     *           format: date-time
     *           example: 2025-12-31T00:00:00.000Z
     *         siteId:
     *           type: string
     *           description: ID du site (optionnel)
     */

    /**
     * @swagger
     * /api/projets:
     *   post:
     *     summary: Créer un nouveau projet (Responsable, Admin, Dirigeant)
     *     tags: [Projets]
     *     security:
     *       - bearerAuth: []
     *     requestBody:
     *       required: true
     *       content:
     *         application/json:
     *           schema:
     *             type: object
     *             required: [nom, ministere, dateDebut]
     *             properties:
     *               nom:
     *                 type: string
     *                 example: Projet X
     *               ministere:
     *                 type: string
     *                 example: Intérieur
     *               dateDebut:
     *                 type: string
     *                 format: date-time
     *                 example: 2025-01-01T00:00:00.000Z
     *               dateFin:
     *                 type: string
     *                 format: date-time
     *                 example: 2025-12-31T00:00:00.000Z
     *               siteId:
     *                 type: string
     *                 description: ID du site (optionnel)
     *
     *     responses:
     *       201:
     *         description: Projet créé avec succès
     */
    router.post('/', 
        authenticateToken(), 
        projetController.createProjet);

    /**
     * @swagger
     * /api/projets:
     *   get:
     *     summary: Récupérer les projets selon les permissions
     *     tags: [Projets]
     *     security:
     *       - bearerAuth: []
     *     responses:
     *       200:
     *         description: Liste des projets
     */
    router.get('/', 
        authenticateToken(),
        projetController.getProjets);

    /**
     * @swagger
     * /api/projets/{id}:
     *   get:
     *     summary: Récupérer un projet avec vérification des permissions
     *     tags: [Projets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     */
    router.get('/:id', 
        authenticateToken(), 
        projetController.getProjetById);

    /**
     * @swagger
     * /api/projets/{id}:
     *   put:
     *     summary: Modifier un projet avec vérification des permissions
     *     tags: [Projets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     */
    router.put('/:id', 
        authenticateToken(),
        projetController.updateProjet);

    /**
     * @swagger
     * /api/projets/{id}/permissions:
     *   get:
     *     summary: Vérifier les permissions sur un projet
     *     tags: [Projets]
     *     security:
     *       - bearerAuth: []
     *     parameters:
     *       - in: path
     *         name: id
     *         required: true
     *         schema:
     *           type: string
     */
    router.get('/:id/permissions', 
        authenticateToken(), 
        projetController.checkPermissions);

    /**
    * @swagger
    * /api/projets/responsable/{responsableId}:
    *   get:
        *     summary: Récupérer les projets d'un responsable
    *     tags: [Projets]
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
    *         description: Projets du responsable récupérés avec succès
    *       401:
    *         description: Non authentifié
    *       403:
    *         description: Accès non autorisé
    *       500:
    *         description: Erreur serveur
    */
    router.get('/responsable/:responsableId', 
        authenticateToken(), 
        projetController.getProjetsByResponsable);

    /**
    * @swagger
    * /api/projets/{id}:
    *   delete:
    *     summary: Supprimer un projet
    *     tags: [Projets]
    *     security:
    *       - bearerAuth: []
    *     parameters:
    *       - in: path
    *         name: id
    *         required: true
    *         schema:
    *           type: string
    *         description: ID du projet
    *     responses:
    *       200:
    *         description: Projet supprimé avec succès
    *       401:
    *         description: Non authentifié
    *       403:
    *         description: Non autorisé
    *       404:
    *         description: Projet non trouvé
    *       500:
    *         description: Erreur serveur
    */
    router.delete('/:id', 
        authenticateToken(), 
        projetController.deleteProjet);

module.exports = router;