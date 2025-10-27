const prisma = require('../config/database');

class DepenseService {
    async createDepense(depenseData, utilisateurId) {
        // Vérifier le budget du projet
        const budget = await prisma.budget.findFirst({
            where: { projetId: depenseData.projetId }
        });

        if (!budget) {
            throw new Error('Aucun budget alloué pour ce projet');
        }

        if (budget.montantRestant < depenseData.montant) {
            throw new Error('Budget insuffisant pour cette dépense');
        }

        // Vérifier le solde de la caisse
        const caisse = await prisma.caisseGenerale.findFirst();
        if (caisse.soldeActuel < depenseData.montant) {
            throw new Error('Solde de caisse insuffisant');
        }

        const depense = await prisma.$transaction(async (tx) => {
            // Créer la dépense
            const newDepense = await tx.depense.create({
                data: depenseData
            });

            // Mettre à jour le budget
            await tx.budget.update({
                where: { id: budget.id },
                data: {
                    montantDepense: { increment: depenseData.montant }
                }
            });

            // Mettre à jour la caisse
            await tx.caisseGenerale.update({
                where: { id: caisse.id },
                data: {
                    soldeActuel: { decrement: depenseData.montant }
                }
            });

            // Enregistrer le mouvement de caisse
            await tx.mouvementCaisse.create({
                data: {
                    typeMouvement: 'DEPENSE',
                    montant: depenseData.montant,
                    description: `Dépense pour ${depenseData.beneficiaire}`,
                    reference: `DEP-${newDepense.id}`,
                    caisseId: caisse.id,
                    utilisateurId
                }
            });

            return newDepense;
        });

        return depense;
    }

    async getDepensesByProjet(projetId) {
        return await prisma.depense.findMany({
            where: { projetId },
            include: {
                besoin: true,
                projet: true
            },
            orderBy: { dateDepense: 'desc' }
        });
    }

    async getDepensesByBesoin(besoinId) {
        return await prisma.depense.findMany({
            where: { besoinId },
            include: {
                projet: true
            }
        });
    }

    async getStatistiquesDepenses() {
        const stats = await prisma.depense.groupBy({
            by: ['typeDepense'],
            _sum: {
                montant: true
            },
            _count: {
                id: true
            }
        });

        const totalDepenses = await prisma.depense.aggregate({
            _sum: {
                montant: true
            }
        });

        return {
            parType: stats,
            total: totalDepenses._sum.montant || 0
        };
    }
}

module.exports = new DepenseService();