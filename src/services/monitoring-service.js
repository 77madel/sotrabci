const prisma = require('../config/database');
const logger = require('../config/logger');

/**
 * Service pour le monitoring et les alertes
 */
const monitoringService = {
    /**
     * Vérifier les alertes budgétaires
     */
    checkBudgetAlerts: async () => {
        try {
            const projets = await prisma.projet.findMany({
                include: {
                    budgetProjet: true,
                    sites: {
                        include: {
                            depenses: true
                        }
                    }
                }
            });

            const alerts = [];

            projets.forEach(projet => {
                if (!projet.budgetProjet) return;

                const { montantActuel, montantConsomme, seuilAlerte } = projet.budgetProjet;
                const tauxConsommation = (montantConsomme / montantActuel) * 100;

                // Alerte dépassement
                if (tauxConsommation > 100) {
                    alerts.push({
                        type: 'BUDGET_DEPASSE',
                        niveau: 'CRITIQUE',
                        projetId: projet.id,
                        projet: projet.nom,
                        message: `Budget du projet dépassé de ${(tauxConsommation - 100).toFixed(2)}%`,
                        montantExcédent: montantConsomme - montantActuel,
                        timestamp: new Date()
                    });
                }
                // Alerte seuil
                else if (tauxConsommation > (seuilAlerte || 80)) {
                    alerts.push({
                        type: 'ALERTE_BUDGET',
                        niveau: 'HAUTE',
                        projetId: projet.id,
                        projet: projet.nom,
                        message: `Budget consommé à ${tauxConsommation.toFixed(2)}% (seuil: ${seuilAlerte}%)`,
                        tauxConsommation: tauxConsommation.toFixed(2),
                        timestamp: new Date()
                    });
                }
            });

            if (alerts.length > 0) {
                logger.warn('Alertes budgétaires détectées', { count: alerts.length, alerts });
            }

            return alerts;
        } catch (error) {
            logger.error('Erreur vérification alertes budgétaires', error);
            throw error;
        }
    },

    /**
     * Vérifier les alertes de stock
     */
    checkStockAlerts: async () => {
        try {
            const stocks = await prisma.stock.findMany({
                where: {
                    quantite: {
                        lte: prisma.stock.fields.quantiteMin
                    }
                },
                include: {
                    materiel: true,
                    site: true
                }
            });

            const alerts = stocks.map(stock => ({
                type: 'STOCK_BAS',
                niveau: 'MOYENNE',
                stockId: stock.id,
                materiel: stock.materiel.designation,
                site: stock.site.nom,
                quantiteActuelle: stock.quantite,
                quantiteMinimum: stock.quantiteMin,
                message: `Stock bas: ${stock.materiel.designation} au site ${stock.site.nom}`,
                timestamp: new Date()
            }));

            if (alerts.length > 0) {
                logger.warn('Alertes de stock détectées', { count: alerts.length });
            }

            return alerts;
        } catch (error) {
            logger.error('Erreur vérification alertes stock', error);
            throw error;
        }
    },

    /**
     * Vérifier les projets en retard
     */
    checkDelayedProjects: async () => {
        try {
            const now = new Date();
            const projets = await prisma.projet.findMany({
                where: {
                    dateFin: {
                        lt: now
                    },
                    statut: {
                        notIn: ['TERMINE', 'ANNULE']
                    }
                }
            });

            const alerts = projets.map(projet => ({
                type: 'PROJET_EN_RETARD',
                niveau: 'HAUTE',
                projetId: projet.id,
                projet: projet.nom,
                dateLimite: projet.dateFin,
                avancement: projet.pourcentageAvancement,
                message: `Projet en retard depuis ${Math.floor((now - projet.dateFin) / (1000 * 60 * 60 * 24))} jours`,
                timestamp: new Date()
            }));

            if (alerts.length > 0) {
                logger.warn('Projets en retard détectés', { count: alerts.length });
            }

            return alerts;
        } catch (error) {
            logger.error('Erreur vérification projets en retard', error);
            throw error;
        }
    },

    /**
     * Récupérer toutes les alertes
     */
    getAllAlerts: async () => {
        try {
            const [budgetAlerts, stockAlerts, delayAlerts] = await Promise.all([
                this.checkBudgetAlerts(),
                this.checkStockAlerts(),
                this.checkDelayedProjects()
            ]);

            const allAlerts = [...budgetAlerts, ...stockAlerts, ...delayAlerts];
            
            // Trier par niveau
            const niveauxOrder = { CRITIQUE: 0, HAUTE: 1, MOYENNE: 2, BASSE: 3 };
            allAlerts.sort((a, b) => niveauxOrder[a.niveau] - niveauxOrder[b.niveau]);

            return allAlerts;
        } catch (error) {
            logger.error('Erreur récupération alertes', error);
            throw error;
        }
    },

    /**
     * Obtenir les métriques du système
     */
    getMetrics: async () => {
        try {
            const [
                totalProjets,
                projetsEnCours,
                totalUtilisateurs,
                totalEmployes,
                budgetStats,
                stockStats
            ] = await Promise.all([
                prisma.projet.count(),
                prisma.projet.count({ where: { statut: 'EN_COURS' } }),
                prisma.utilisateur.count(),
                prisma.employe.count(),
                prisma.projet.aggregate({
                    _sum: { budgetAlloue: true, budgetConsomme: true }
                }),
                prisma.stock.aggregate({
                    _sum: { quantite: true },
                    _count: true
                })
            ]);

            const metrics = {
                projets: {
                    total: totalProjets,
                    enCours: projetsEnCours,
                    termines: await prisma.projet.count({ where: { statut: 'TERMINE' } }),
                    annules: await prisma.projet.count({ where: { statut: 'ANNULE' } })
                },
                utilisateurs: {
                    total: totalUtilisateurs,
                    actifs: await prisma.utilisateur.count({ where: { actif: true } })
                },
                employes: {
                    total: totalEmployes,
                    affectes: await prisma.affectationEmploye.count()
                },
                finances: {
                    budgetAlloue: budgetStats._sum.budgetAlloue || 0,
                    budgetConsomme: budgetStats._sum.budgetConsomme || 0,
                    budgetRestant: (budgetStats._sum.budgetAlloue || 0) - (budgetStats._sum.budgetConsomme || 0),
                    tauxConsommation: ((budgetStats._sum.budgetConsomme || 0) / (budgetStats._sum.budgetAlloue || 1) * 100).toFixed(2)
                },
                stocks: {
                    typesMateriels: stockStats._count,
                    quantiteTotale: stockStats._sum.quantite || 0
                },
                timestamp: new Date()
            };

            logger.info('Métriques système', metrics);
            return metrics;
        } catch (error) {
            logger.error('Erreur calcul métriques', error);
            throw error;
        }
    },

    /**
     * Tableau de bord temps réel
     */
    getDashboard: async () => {
        try {
            const [metrics, alerts] = await Promise.all([
                this.getMetrics(),
                this.getAllAlerts()
            ]);

            return {
                metrics,
                alerts,
                criticalAlertsCount: alerts.filter(a => a.niveau === 'CRITIQUE').length,
                highAlertsCount: alerts.filter(a => a.niveau === 'HAUTE').length,
                timestamp: new Date()
            };
        } catch (error) {
            logger.error('Erreur chargement dashboard', error);
            throw error;
        }
    },

    /**
     * Health check du système
     */
    healthCheck: async () => {
        try {
            const checks = {
                database: 'ok',
                timestamp: new Date()
            };

            // Vérifier la base de données
            try {
                await prisma.$queryRaw`SELECT 1`;
                checks.database = 'ok';
            } catch {
                checks.database = 'failed';
            }

            const isHealthy = Object.values(checks).every(v => v === 'ok');

            return {
                status: isHealthy ? 'healthy' : 'unhealthy',
                checks,
                timestamp: new Date()
            };
        } catch (error) {
            logger.error('Erreur health check', error);
            return {
                status: 'unhealthy',
                error: error.message,
                timestamp: new Date()
            };
        }
    }
};

module.exports = monitoringService;
