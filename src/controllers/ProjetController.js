/*
const projetService = require('../services/ProjetService');

class ProjetController {
    /!**
     * @desc    Créer un nouveau projet
     * @route   POST /api/projets
     * @access  Privé (Admin, Dirigeant)
     *!/
    async createProjet(req, res) {
        try {
            // ✅ Validation basique du corps de la requête
            const { nom, ministere, dateDebut, dateFin } = req.body;

            if (!nom || !ministere || !dateDebut) {
                return res.status(400).json({
                    success: false,
                    error: 'Les champs nom, ministere et dateDebut sont obligatoires'
                });
            }

            // 🎯 Création du projet avec l'ID du responsable connecté
            const projetData = {
                nom,
                ministere,
                dateDebut: new Date(dateDebut),
                dateFin: dateFin ? new Date(dateFin) : null,
                responsableId: req.user.id // Le créateur devient responsable
            };

            const projet = await projetService.createProjet(projetData, req.user.id);

            res.status(201).json({
                success: true,
                message: 'Projet créé avec succès',
                data: projet
            });
        } catch (error) {
            console.error('Erreur création projet:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la création du projet'
            });
        }
    }

    /!**
     * @desc    Récupérer tous les projets
     * @route   GET /api/projets
     * @access  Privé
     *!/
    async getProjets(req, res) {
        try {
            const projets = await projetService.getProjets();

            res.json({
                success: true,
                count: projets.length,
                data: projets
            });
        } catch (error) {
            console.error('Erreur récupération projets:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des projets'
            });
        }
    }

    /!**
     * @desc    Récupérer un projet par son ID
     * @route   GET /api/projets/:id
     * @access  Privé
     *!/
    async getProjetById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            const projet = await projetService.getProjetById(id);

            res.json({
                success: true,
                data: projet
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur récupération projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du projet'
            });
        }
    }

    /!**
     * @desc    Mettre à jour un projet
     * @route   PUT /api/projets/:id
     * @access  Privé (Admin, Dirigeant, Responsable du projet)
     *!/
    async updateProjet(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            // 🔒 Vérification des permissions
            // Seul le responsable du projet, un admin ou le dirigeant peut modifier
            const projet = await projetService.getProjetById(id);

            if (projet.responsableId !== req.user.id &&
                req.user.role !== 'ADMIN' &&
                req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Vous n\'êtes pas autorisé à modifier ce projet'
                });
            }

            // 🎯 Mise à jour du projet
            const projetModifie = await projetService.updateProjet(id, updateData);

            res.json({
                success: true,
                message: 'Projet mis à jour avec succès',
                data: projetModifie
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur mise à jour projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour du projet'
            });
        }
    }

    /!**
     * @desc    Récupérer les projets d'un responsable
     * @route   GET /api/projets/responsable/:responsableId
     * @access  Privé
     *!/
    async getProjetsByResponsable(req, res) {
        try {
            const { responsableId } = req.params;

            if (!responsableId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du responsable requis'
                });
            }

            // 🔒 Vérification des permissions
            // Un utilisateur ne peut voir que ses propres projets sauf si admin/dirigeant
            if (req.user.id !== responsableId &&
                req.user.role !== 'ADMIN' &&
                req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Accès non autorisé à ces projets'
                });
            }

            const projets = await projetService.getProjetsByResponsable(responsableId);

            res.json({
                success: true,
                count: projets.length,
                data: projets
            });
        } catch (error) {
            console.error('Erreur récupération projets responsable:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des projets'
            });
        }
    }

    /!**
     * @desc    Supprimer un projet
     * @route   DELETE /api/projets/:id
     * @access  Privé (Admin, Dirigeant)
     *!/
    async deleteProjet(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            // 🔒 Vérification des permissions - Seul admin/dirigeant peut supprimer
            if (req.user.role !== 'ADMIN' && req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Vous n\'êtes pas autorisé à supprimer ce projet'
                });
            }

            // 🎯 Vérifier si le projet existe
            const projet = await projetService.getProjetById(id);

            // 🎯 Suppression du projet (Prisma gère la suppression en cascade)
            await projetService.deleteProjet(id);

            res.json({
                success: true,
                message: 'Projet supprimé avec succès',
                data: { id: projet.id, nom: projet.nom }
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur suppression projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la suppression du projet'
            });
        }
    }

    /!**
     * @desc    Récupérer les statistiques des projets
     * @route   GET /api/projets/statistiques
     * @access  Privé
     *!/
    async getStatistiques(req, res) {
        try {
            const statistiques = await projetService.getStatistiquesProjets();

            res.json({
                success: true,
                data: statistiques
            });
        } catch (error) {
            console.error('Erreur récupération statistiques:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des statistiques'
            });
        }
    }
}

module.exports = new ProjetController();*/

const projetService = require('../services/ProjetService');

class ProjetController {
    /**
     * @desc    Créer un nouveau projet
     * @route   POST /api/projets
     * @access  Privé (Admin, Dirigeant, Responsable)
     */
    async createProjet(req, res) {
        try {
            const { nom, ministere, dateDebut, dateFin, siteId } = req.body;

            if (!nom || !ministere || !dateDebut) {
                return res.status(400).json({
                    success: false,
                    error: 'Les champs nom, ministere et dateDebut sont obligatoires'
                });
            }

            // 🎯 Création du projet avec l'ID du responsable connecté
            const projetData = {
                nom,
                ministere,
                dateDebut: new Date(dateDebut),
                dateFin: dateFin ? new Date(dateFin) : null,
                siteId: siteId || null,
                responsableId: req.user.id // ✅ LE CRÉATEUR DEVIENT RESPONSABLE
            };

            const projet = await projetService.createProjet(projetData, req.user.id);

            res.status(201).json({
                success: true,
                message: 'Projet créé avec succès',
                data: projet
            });
        } catch (error) {
            console.error('Erreur création projet:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la création du projet'
            });
        }
    }

    /**
     * @desc    Récupérer les projets selon les permissions
     * @route   GET /api/projets
     * @access  Privé
     */
    async getProjets(req, res) {
        try {
            let projets;

            // 🔐 LOGIQUE DE PERMISSIONS
            if (req.user.role === 'ADMIN' || req.user.role === 'DIRIGEANT') {
                // Admin et Dirigeant voient TOUS les projets
                projets = await projetService.getAllProjets();
            } else {
                // Les responsables ne voient que LEURS PROPRES projets
                projets = await projetService.getProjetsByResponsable(req.user.id);
            }

            res.json({
                success: true,
                count: projets.length,
                data: projets,
                message: req.user.role === 'RESPONSABLE'
                    ? 'Vos projets'
                    : 'Tous les projets'
            });
        } catch (error) {
            console.error('Erreur récupération projets:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des projets'
            });
        }
    }

    /**
     * @desc    Récupérer un projet par son ID avec vérification des permissions
     * @route   GET /api/projets/:id
     * @access  Privé
     */
    async getProjetById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            // 🔐 VÉRIFICATION DES PERMISSIONS DANS LE SERVICE
            const projet = await projetService.getProjetByIdWithPermissions(
                id,
                req.user.id,
                req.user.role
            );

            res.json({
                success: true,
                data: projet
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes('pas autorisé')) {
                return res.status(403).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur récupération projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du projet'
            });
        }
    }

    /**
     * @desc    Mettre à jour un projet avec vérification des permissions
     * @route   PUT /api/projets/:id
     * @access  Privé
     */
    async updateProjet(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            // 🎯 Mise à jour avec vérification des permissions dans le service
            const projetModifie = await projetService.updateProjetWithPermissions(
                id,
                updateData,
                req.user.id,
                req.user.role
            );

            res.json({
                success: true,
                message: 'Projet mis à jour avec succès',
                data: projetModifie
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes('pas autorisé')) {
                return res.status(403).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur mise à jour projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour du projet'
            });
        }
    }

    /**
     * @desc    Récupérer les projets d'un responsable (avec vérification)
     * @route   GET /api/projets/responsable/:responsableId
     * @access  Privé
     */
    async getProjetsByResponsable(req, res) {
        try {
            const { responsableId } = req.params;

            if (!responsableId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du responsable requis'
                });
            }

            // 🔒 VÉRIFICATION DES PERMISSIONS
            // Un utilisateur ne peut voir que ses propres projets sauf si admin/dirigeant
            if (req.user.id !== responsableId &&
                req.user.role !== 'ADMIN' &&
                req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Accès non autorisé à ces projets'
                });
            }

            const projets = await projetService.getProjetsByResponsable(responsableId);

            res.json({
                success: true,
                count: projets.length,
                data: projets
            });
        } catch (error) {
            console.error('Erreur récupération projets responsable:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des projets'
            });
        }
    }

    /**
     * @desc    Supprimer un projet avec vérification des permissions
     * @route   DELETE /api/projets/:id
     * @access  Privé (Admin, Dirigeant)
     */
    async deleteProjet(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            // 🔒 Vérification des permissions - Seul admin/dirigeant peut supprimer
            if (req.user.role !== 'ADMIN' && req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Vous n\'êtes pas autorisé à supprimer ce projet'
                });
            }

            // Vérifier si le projet existe et les permissions
            const projet = await projetService.getProjetByIdWithPermissions(
                id,
                req.user.id,
                req.user.role
            );

            await projetService.deleteProjet(id);

            res.json({
                success: true,
                message: 'Projet supprimé avec succès',
                data: { id: projet.id, nom: projet.nom }
            });
        } catch (error) {
            if (error.message === 'Projet non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes('pas autorisé')) {
                return res.status(403).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur suppression projet:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la suppression du projet'
            });
        }
    }

    /**
     * @desc    Vérifier les permissions sur un projet
     * @route   GET /api/projets/:id/permissions
     * @access  Privé
     */
    async checkPermissions(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            const canView = await projetService.canUserViewProjet(
                id,
                req.user.id,
                req.user.role
            );

            const canModify = await projetService.canUserModifyProjet(
                id,
                req.user.id,
                req.user.role
            );

            res.json({
                success: true,
                data: {
                    canView,
                    canModify,
                    userRole: req.user.role,
                    userId: req.user.id
                }
            });
        } catch (error) {
            console.error('Erreur vérification permissions:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la vérification des permissions'
            });
        }
    }
}

module.exports = new ProjetController();