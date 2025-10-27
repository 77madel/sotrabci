const depenseService = require('../services/DepenseService');

class DepenseController {
    async createDepense(req, res) {
        try {
            const depense = await depenseService.createDepense(req.body, req.user.id);
            res.status(201).json({
                success: true,
                data: depense
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getDepensesByProjet(req, res) {
        try {
            const { projetId } = req.params;
            const depenses = await depenseService.getDepensesByProjet(projetId);
            res.json({
                success: true,
                data: depenses
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getStatistiques(req, res) {
        try {
            const stats = await depenseService.getStatistiquesDepenses();
            res.json({
                success: true,
                data: stats
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new DepenseController();