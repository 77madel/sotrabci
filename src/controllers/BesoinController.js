/*
const besoinService = require('../services/BesoinService');

class BesoinController {
    async createBesoin(req, res) {
        try {
            const besoin = await besoinService.createBesoin(req.body, req.user.id);
            res.status(201).json({
                success: true,
                data: besoin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBesoinsByProjet(req, res) {
        try {
            const { projetId } = req.params;
            const besoins = await besoinService.getBesoinsByProjet(projetId);
            res.json({
                success: true,
                data: besoins
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async validerBesoin(req, res) {
        try {
            const { besoinId } = req.params;
            console.log("BesionId:", besoinId )
            const { decision } = req.body; // true pour valider, false pour refuser

            const besoin = await besoinService.validerBesoin(besoinId, decision, req.user.id);
            console.log("Besion:", besoin);
            res.json({
                success: true,
                data: besoin
            });
            console.log("Info:", res)
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getBesoinsEnAttente(req, res) {
        try {
            const besoins = await besoinService.getBesoinsEnAttente();
            res.json({
                success: true,
                data: besoins
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new BesoinController();*/


const besoinService = require('../services/BesoinService');

class BesoinController {
    /**
     * @desc    Créer un nouveau besoin
     * @route   POST /api/besoins
     * @access  Privé (Responsable)
     */
    async createBesoin(req, res) {
        try {
            // ✅ VÉRIFICATION que l'utilisateur est connecté
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
            }

            const { description, montantEstime, projetId } = req.body;

            // ✅ VALIDATION des données
            if (!description || !montantEstime || !projetId) {
                return res.status(400).json({
                    success: false,
                    error: 'Les champs description, montantEstime et projetId sont obligatoires'
                });
            }

            if (typeof montantEstime !== 'number' || montantEstime <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Le montant estimé doit être un nombre positif'
                });
            }

            const besoinData = {
                description,
                montantEstime,
                projetId
            };

            const besoin = await besoinService.createBesoin(besoinData, req.user.id);

            res.status(201).json({
                success: true,
                message: 'Besoin créé avec succès',
                data: besoin
            });
        } catch (error) {
            console.error('Erreur création besoin:', error);

            if (error.message.includes('non trouvé') || error.message.includes('pas responsable')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la création du besoin'
            });
        }
    }

    /**
     * @desc    Récupérer les besoins d'un projet
     * @route   GET /api/besoins/projet/:projetId
     * @access  Privé
     */
    async getBesoinsByProjet(req, res) {
        try {
            const { projetId } = req.params;

            if (!projetId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du projet requis'
                });
            }

            const besoins = await besoinService.getBesoinsByProjet(projetId);

            res.json({
                success: true,
                count: besoins.length,
                data: besoins
            });
        } catch (error) {
            console.error('Erreur récupération besoins:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des besoins'
            });
        }
    }

    /**
     * @desc    Valider ou refuser un besoin
     * @route   PATCH /api/besoins/:besoinId/valider
     * @access  Privé (Admin, Dirigeant)
     */
    async validerBesoin(req, res) {
        try {
            // ✅ VÉRIFICATION que l'utilisateur est connecté
            if (!req.user || !req.user.id) {
                return res.status(401).json({
                    success: false,
                    error: 'Utilisateur non authentifié'
                });
            }

            const { besoinId } = req.params;
            const { decision } = req.body; // true pour valider, false pour refuser

            // ✅ VALIDATION des paramètres
            if (!besoinId) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du besoin requis'
                });
            }

            if (typeof decision !== 'boolean') {
                return res.status(400).json({
                    success: false,
                    error: 'Le champ decision doit être un booléen (true/false)'
                });
            }

            // 🎯 Validation du besoin
            const besoin = await besoinService.validerBesoin(besoinId, decision, req.user.id);

            const action = decision ? 'validé' : 'refusé';

            res.json({
                success: true,
                message: `Besoin ${action} avec succès`,
                data: besoin
            });
        } catch (error) {
            console.error('Erreur validation besoin:', error);

            if (error.message.includes('non trouvé')) {
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

            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la validation du besoin'
            });
        }
    }

    /**
     * @desc    Récupérer les besoins en attente de validation
     * @route   GET /api/besoins/en-attente
     * @access  Privé (Admin, Dirigeant)
     */
    async getBesoinsEnAttente(req, res) {
        try {
            const besoins = await besoinService.getBesoinsEnAttente();

            res.json({
                success: true,
                count: besoins.length,
                data: besoins
            });
        } catch (error) {
            console.error('Erreur récupération besoins en attente:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des besoins en attente'
            });
        }
    }

    /**
     * @desc    Récupérer un besoin par son ID
     * @route   GET /api/besoins/:id
     * @access  Privé
     */
    async getBesoinById(req, res) {
        try {
            const { id } = req.params;

            if (!id) {
                return res.status(400).json({
                    success: false,
                    error: 'ID du besoin requis'
                });
            }

            const besoin = await besoinService.getBesoinById(id);

            res.json({
                success: true,
                data: besoin
            });
        } catch (error) {
            if (error.message === 'Besoin non trouvé') {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            console.error('Erreur récupération besoin:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération du besoin'
            });
        }
    }
}

module.exports = new BesoinController();