require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { swaggerUi, specs } = require('./config/swagger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/caisse', require('./routes/caisse'));
app.use('/api/projets', require('./routes/projets'));
app.use('/api/besoins', require('./routes/besoins'));
app.use('/api/depenses', require('./routes/depenses'));
app.use('/api/salaries', require('./routes/salaries'));
app.use('/api/reporting', require('./routes/reporting'));
app.use('/api/sites', require('./routes/sites'));

// Documentation Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Route de santé
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV
    });
});

// Gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        error: 'Route non trouvée'
    });
});

// Middleware de gestion d'erreurs
app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({
        success: false,
        error: 'Erreur interne du serveur'
    });
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📚 Documentation API: http://localhost:${PORT}/api-docs`);
    console.log(`❤️  Route santé: http://localhost:${PORT}/health`);
});

module.exports = app;