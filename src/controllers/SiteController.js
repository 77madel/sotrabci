const siteService = require('../services/SiteService');

class SiteController {
    /**
     * @desc    Créer un nouveau site
     * @route   POST /api/sites
     * @access  Privé (Admin, Dirigeant)
     */
    async createSite(req, res) {
        try {
            const { nom, adresse, responsableSite } = req.body;

            if (!nom || !adresse || !responsableSite) {
                return res.status(400).json({
                    success: false,
                    error: 'Les champs nom, adresse et responsableSite sont obligatoires'
                });
            }

            const siteData = {
                nom,
                adresse,
                responsableSite
            };

            const site = await siteService.createSite(siteData);

            res.status(201).json({
                success: true,
                message: 'Site créé avec succès',
                data: site
            });
        } catch (error) {
            console.error('Erreur création site:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la création du site'
            });
        }
    }

    /**
     * @desc    Récupérer tous les sites
     * @route   GET /api/sites
     * @access  Privé
     */
    async getSites(req, res) {
        try {
            const sites = await siteService.getSites();

            res.json({
                success: true,
                count: sites.length,
                data: sites
            });
        } catch (error) {
            console.error('Erreur récupération sites:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des sites'
            });
        }
    }

    /**
     * @desc    Récupérer un site par son ID
     * @route   GET /api/sites/:id
     * @access  Privé
     */
    async getSiteById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du site requis'
                });
            }

            const site = await siteService.getSiteById(id);

            res.json({
                success: true,
                data: site
            });
        } catch (error) {
            if (error.message === 'Site non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur récupération site:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du site'
            });
        }
    }

    /**
     * @desc    Récupérer les sites d'un responsable
     * @route   GET /api/sites/responsable/:responsableId
     * @access  Privé
     */
    async getSitesByResponsable(req, res) {
        try {
            const { responsableId } = req.params;

            if (!responsableId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du responsable requis'
                });
            }

            // Vérification des permissions
            if (req.user.id !== responsableId &&
                req.user.role !== 'ADMIN' &&
                req.user.role !== 'DIRIGEANT') {
                return res.status(403).json({
                    success: false,
                    error: 'Accès non autorisé à ces sites'
                });
            }

            const sites = await siteService.getSitesByResponsable(responsableId);

            res.json({
                success: true,
                count: sites.length,
                data: sites
            });
        } catch (error) {
            console.error('Erreur récupération sites responsable:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des sites'
            });
        }
    }

    /**
     * @desc    Mettre à jour un site
     * @route   PUT /api/sites/:id
     * @access  Privé (Admin, Dirigeant)
     */
    async updateSite(req, res) {
        try {
            const { id } = req.params;
            const updateData = req.body;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du site requis'
                });
            }

            const siteModifie = await siteService.updateSite(id, updateData);

            res.json({
                success: true,
                message: 'Site mis à jour avec succès',
                data: siteModifie
            });
        } catch (error) {
            if (error.message === 'Site non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur mise à jour site:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la mise à jour du site'
            });
        }
    }

    /**
     * @desc    Supprimer un site
     * @route   DELETE /api/sites/:id
     * @access  Privé (Admin, Dirigeant)
     */
    async deleteSite(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du site requis'
                });
            }

            await siteService.deleteSite(id);

            res.json({
                success: true,
                message: 'Site supprimé avec succès'
            });
        } catch (error) {
            if (error.message === 'Site non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur suppression site:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la suppression du site'
            });
        }
    }
}

module.exports = new SiteController();