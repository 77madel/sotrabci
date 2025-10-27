const reportingService = require('../services/ReportingService');

class ReportingController {
    async getTableauDeBord(req, res) {
        try {
            const dashboard = await reportingService.getTableauDeBord();
            res.json({
                success: true,
                data: dashboard
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }

    async getRapportFinancier(req, res) {
        try {
            const { debut, fin } = req.query;
            const rapport = await reportingService.getRapportFinancier(debut, fin);
            res.json({
                success: true,
                data: rapport
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

module.exports = new ReportingController();