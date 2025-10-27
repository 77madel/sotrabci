const salarieService = require('../services/SalarieService');

class SalarieController {
    async createSalarie(req, res) {
        try {
            const salarie = await salarieService.createSalarie(req.body);
            res.status(201).json({
                success: true,
                data: salarie
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getSalaries(req, res) {
        try {
            const salaries = await salarieService.getSalaries();
            res.json({
                success: true,
                data: salaries
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async affecterSalarie(req, res) {
        try {
            const { salarieId, projetId } = req.body;
            const affectation = await salarieService.affecterSalarie(salarieId, projetId);
            res.status(201).json({
                success: true,
                data: affectation
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async genererBulletinPaie(req, res) {
        try {
            const { salarieId } = req.params;
            const { mois, annee } = req.body;

            const bulletin = await salarieService.genererBulletinPaie(salarieId, mois, annee);
            res.json({
                success: true,
                data: bulletin
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async getSalariesByProjet(req, res) {
        try {
            const { projetId } = req.params;
            const salaries = await salarieService.getSalariesByProjet(projetId);
            res.json({
                success: true,
                data: salaries
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new SalarieController();