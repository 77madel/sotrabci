const caisseService = require('../services/CaisseService');

class CaisseController {
    /**
     * @desc    Récupérer le solde actuel de la caisse
     * @route   GET /api/caisse/solde
     * @access  Privé
     */
    async getSolde(req, res) {
        try {
            const caisse = await caisseService.getCaisseSolde();

            res.json({
                success: true,
                data: caisse
            });
        } catch (error) {
            console.error('Erreur récupération solde caisse:', error);
            res.status(500).json({
                success: false,
                error: error.message || 'Erreur lors de la récupération du solde de la caisse'
            });
        }
    }

    /**
     * @desc    Approvisionner la caisse générale
     * @route   POST /api/caisse/approvisionner
     * @access  Privé (Admin, Dirigeant)
     */
    async approvisionner(req, res) {
        try {
            const { montant, description } = req.body;

            // ✅ Validation des données
            if (!montant || typeof montant !== 'number' || montant <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Le montant doit être un nombre positif'
                });
            }

           /* if (montant > 1000000) { // 🛡️ Sécurité : limite à 1 million
                return res.status(400).json({
                    success: false,
                    error: 'Le montant ne peut pas dépasser 1,000,000'
                });
            }*/

            const caisse = await caisseService.approvisionnerCaisse(
                montant,
                req.user.id,
                description || 'Approvisionnement de la caisse'
            );

            res.json({
                success: true,
                message: `Caisse approvisionnée de ${montant} € avec succès`,
                data: caisse
            });
        } catch (error) {
            console.error('Erreur approvisionnement caisse:', error);
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * @desc    Allouer un budget à un projet depuis la caisse
     * @route   POST /api/caisse/allouer-budget
     * @access  Privé (Admin, Dirigeant)
     */
    async allouerBudget(req, res) {
        try {
            const { projetId, montant, description } = req.body;

            // ✅ Validation des données
            if (!projetId || !montant) {
                return res.status(400).json({
                    success: false,
                    error: 'Les champs projetId et montant sont obligatoires'
                });
            }

            if (typeof montant !== 'number' || montant <= 0) {
                return res.status(400).json({
                    success: false,
                    error: 'Le montant doit être un nombre positif'
                });
            }

            const budget = await caisseService.getAllouerBudget(
                projetId,
                montant,
                req.user.id,
                description || `Allocation budget pour projet ${projetId}`
            );

            res.json({
                success: true,
                message: `Budget de ${montant} € alloué au projet avec succès`,
                data: budget
            });
        } catch (error) {
            console.error('Erreur allocation budget:', error);

            if (error.message.includes('Solde de caisse insuffisant')) {
                return res.status(400).json({
                    success: false,
                    error: error.message
                });
            }

            if (error.message.includes('Projet non trouvé')) {
                return res.status(404).json({
                    success: false,
                    error: error.message
                });
            }

            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    /**
     * @desc    Récupérer l'historique des mouvements de caisse
     * @route   GET /api/caisse/mouvements
     * @access  Privé
     */
    async getMouvements(req, res) {
        try {
            const {
                page = 1,
                limit = 10,
                typeMouvement,
                dateDebut,
                dateFin
            } = req.query;

            // ✅ Conversion et validation des paramètres
            const pageInt = parseInt(page);
            const limitInt = parseInt(limit);

            if (pageInt < 1 || limitInt < 1 || limitInt > 100) {
                return res.status(400).json({
                    success: false,
                    error: 'Paramètres de pagination invalides'
                });
            }

            const mouvements = await caisseService.getMouvementsCaisse({
                page: pageInt,
                limit: limitInt,
                typeMouvement,
                dateDebut: dateDebut ? new Date(dateDebut) : undefined,
                dateFin: dateFin ? new Date(dateFin) : undefined
            });

            res.json({
                success: true,
                data: mouvements.mouvements,
                pagination: {
                    page: pageInt,
                    limit: limitInt,
                    total: mouvements.total,
                    pages: Math.ceil(mouvements.total / limitInt)
                }
            });
        } catch (error) {
            console.error('Erreur récupération mouvements:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des mouvements'
            });
        }
    }

    /**
     * @desc    Générer un rapport financier détaillé
     * @route   GET /api/caisse/rapport-financier
     * @access  Privé (Admin, Dirigeant)
     */
    async getRapportFinancier(req, res) {
        try {
            const { dateDebut, dateFin } = req.query;

            // ✅ Validation des dates
            if (!dateDebut || !dateFin) {
                return res.status(400).json({
                    success: false,
                    error: 'Les paramètres dateDebut et dateFin sont obligatoires'
                });
            }

            const debut = new Date(dateDebut);
            const fin = new Date(dateFin);

            if (isNaN(debut.getTime()) || isNaN(fin.getTime())) {
                return res.status(400).json({
                    success: false,
                    error: 'Dates invalides. Format attendu: YYYY-MM-DD'
                });
            }

            if (debut > fin) {
                return res.status(400).json({
                    success: false,
                    error: 'La date de début doit être antérieure à la date de fin'
                });
            }

            const rapport = await caisseService.getRapportFinancier(debut, fin);

            res.json({
                success: true,
                data: rapport
            });
        } catch (error) {
            console.error('Erreur génération rapport financier:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la génération du rapport financier'
            });
        }
    }

    /**
     * @desc    Récupérer les alertes de la caisse
     * @route   GET /api/caisse/alertes
     * @access  Privé (Admin, Dirigeant)
     */
    async getAlertes(req, res) {
        try {
            const alertes = await caisseService.getAlertesCaisse();

            res.json({
                success: true,
                data: alertes
            });
        } catch (error) {
            console.error('Erreur récupération alertes:', error);
            res.status(500).json({
                success: false,
                error: 'Erreur lors de la récupération des alertes'
            });
        }
    }
}

module.exports = new CaisseController();