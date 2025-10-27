const authService = require('../services/AuthService');

class AuthController {
    async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                error: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, motDePasse } = req.body;
            const result = await authService.login(email, motDePasse);

            res.json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                error: error.message
            });
        }
    }

    async getProfile(req, res) {
        try {
            res.json({
                success: true,
                data: req.user
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message
            });
        }
    }
}

// ✅ CORRECTION - Bien exporter une instance de la classe
module.exports = new AuthController();