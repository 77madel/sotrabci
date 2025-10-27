const prisma = require('../config/database');

class CaisseService {
    /**
     * @desc    Récupérer le solde de la caisse générale
     * @return  {Promise<Object>} Données de la caisse
     */
    async getCaisseSolde() {
        try {
            const caisse = await prisma.caisseGenerale.findFirst();
            if (!caisse) {
                throw new Error('Caisse générale non trouvée');
            }
            return caisse;
        } catch (error) {
            console.error('Erreur service récupération solde:', error);
            throw new Error('Erreur lors de la récupération du solde de la caisse');
        }
    }

    /**
     * @desc    Approvisionner la caisse générale
     */
    async approvisionnerCaisse(montant, utilisateurId, description = 'Approvisionnement de la caisse') {
        try {
            const caisse = await prisma.caisseGenerale.findFirst();
            if (!caisse) {
                throw new Error('Caisse générale non trouvée');
            }

            const updatedCaisse = await prisma.caisseGenerale.update({
                where: { id: caisse.id },
                data: {
                    soldeActuel: { increment: montant }
                }
            });

            await prisma.mouvementCaisse.create({
                data: {
                    typeMouvement: 'APPROVISIONNEMENT',
                    montant,
                    description,
                    caisseId: caisse.id,
                    utilisateurId
                }
            });

            return updatedCaisse;
        } catch (error) {
            console.error('Erreur service approvisionnement:', error);
            throw new Error('Erreur lors de l\'approvisionnement de la caisse');
        }
    }

    /**
     * @desc    Allouer un budget à un projet
     */
    async getAllouerBudget(projetId, montant, utilisateurId, description = 'Allocation budget') {
        try {
            const caisse = await prisma.caisseGenerale.findFirst();
            if (!caisse) {
                throw new Error('Caisse générale non trouvée');
            }

            if (caisse.soldeActuel < montant) {
                throw new Error('Solde de caisse insuffisant');
            }

            // Vérifier si le projet existe
            const projet = await prisma.projet.findUnique({
                where: { id: projetId }
            });
            if (!projet) {
                throw new Error('Projet non trouvé');
            }

            const budget = await prisma.budget.create({
                data: {
                    montantAlloue: montant,
                    projetId,
                    caisseId: caisse.id
                }
            });

            await prisma.caisseGenerale.update({
                where: { id: caisse.id },
                data: {
                    soldeActuel: { decrement: montant }
                }
            });

            await prisma.mouvementCaisse.create({
                data: {
                    typeMouvement: 'ALLOCATION',
                    montant,
                    description,
                    caisseId: caisse.id,
                    utilisateurId
                }
            });

            return budget;
        } catch (error) {
            console.error('Erreur service allocation budget:', error);
            throw error; // Propager l'erreur originale
        }
    }

    /**
     * @desc    Récupérer les mouvements de caisse avec pagination et filtres
     */
    async getMouvementsCaisse(filters = {}) {
        const { page = 1, limit = 10, typeMouvement, dateDebut, dateFin } = filters;
        const skip = (page - 1) * limit;

        const where = {};

        if (typeMouvement) {
            where.typeMouvement = typeMouvement;
        }

        if (dateDebut || dateFin) {
            where.dateMouvement = {};
            if (dateDebut) where.dateMouvement.gte = dateDebut;
            if (dateFin) {
                // Ajouter un jour pour inclure la date de fin
                const fin = new Date(dateFin);
                fin.setDate(fin.getDate() + 1);
                where.dateMouvement.lte = fin;
            }
        }

        const [mouvements, total] = await Promise.all([
            prisma.mouvementCaisse.findMany({
                where,
                include: {
                    utilisateur: {
                        select: {
                            nom: true,
                            email: true
                        }
                    },
                    caisse: {
                        select: {
                            soldeActuel: true
                        }
                    }
                },
                orderBy: {
                    dateMouvement: 'desc'
                },
                skip,
                take: limit
            }),
            prisma.mouvementCaisse.count({ where })
        ]);

        return {
            mouvements,
            total,
            page,
            limit,
            pages: Math.ceil(total / limit)
        };
    }

    /**
     * @desc    Générer un rapport financier pour une période
     */
    async getRapportFinancier(dateDebut, dateFin) {
        const caisse = await prisma.caisseGenerale.findFirst();

        // Calculer les totaux par type de mouvement
        const mouvements = await prisma.mouvementCaisse.groupBy({
            by: ['typeMouvement'],
            where: {
                dateMouvement: {
                    gte: dateDebut,
                    lte: dateFin
                }
            },
            _sum: {
                montant: true
            },
            _count: {
                id: true
            }
        });

        // Récupérer tous les mouvements détaillés
        const mouvementsDetails = await prisma.mouvementCaisse.findMany({
            where: {
                dateMouvement: {
                    gte: dateDebut,
                    lte: dateFin
                }
            },
            include: {
                utilisateur: {
                    select: {
                        nom: true,
                        email: true
                    }
                }
            },
            orderBy: {
                dateMouvement: 'desc'
            }
        });

        const totals = {};
        mouvements.forEach(mvt => {
            totals[mvt.typeMouvement] = {
                total: mvt._sum.montant,
                count: mvt._count.id
            };
        });

        return {
            periode: {
                debut: dateDebut,
                fin: dateFin
            },
            soldeInitial: caisse.soldeInitial,
            soldeFinal: caisse.soldeActuel,
            totalApprovisionnements: totals.APPROVISIONNEMENT?.total || 0,
            totalAllocations: totals.ALLOCATION?.total || 0,
            totalDepenses: totals.DEPENSE?.total || 0,
            mouvements: mouvementsDetails
        };
    }

    /**
     * @desc    Récupérer les alertes de la caisse
     */
    async getAlertesCaisse() {
        const caisse = await prisma.caisseGenerale.findFirst();
        const SEUIL_ALERTE = 10000; // 🚨 Alerte si solde < 10,000 €
        const SEUIL_CRITIQUE = 5000; // 🔴 Critique si solde < 5,000 €

        const alertes = {
            soldeFaible: caisse.soldeActuel < SEUIL_ALERTE,
            soldeCritique: caisse.soldeActuel < SEUIL_CRITIQUE,
            soldeActuel: caisse.soldeActuel,
            seuilAlerte: SEUIL_ALERTE,
            seuilCritique: SEUIL_CRITIQUE
        };

        // Générer le message d'alerte
        if (alertes.soldeCritique) {
            alertes.message = `🚨 CRITIQUE : Solde très faible (${caisse.soldeActuel} CFA)`;
        } else if (alertes.soldeFaible) {
            alertes.message = `⚠️ ALERTE : Solde faible (${caisse.soldeActuel} CFA)`;
        } else {
            alertes.message = "✅ Solde normal";
        }

        return alertes;
    }
}

module.exports = new CaisseService();