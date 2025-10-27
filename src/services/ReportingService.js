const prisma = require('../config/database');

class ReportingService {
    async getTableauDeBord() {
        // Statistiques générales
        const totalProjets = await prisma.projet.count();
        const totalBesoins = await prisma.besoin.count();
        const totalDepenses = await prisma.depense.aggregate({
            _sum: { montant: true }
        });
        const totalSalaries = await prisma.salarie.count();

        // Budgets et dépenses par projet
        const projetsAvecBudget = await prisma.projet.findMany({
            include: {
                budgets: true,
                depenses: true,
                responsable: { select: { nom: true } }
            }
        });

        const projetsStats = projetsAvecBudget.map(projet => {
            const budget = projet.budgets[0];
            const totalDepensesProjet = projet.depenses.reduce((sum, dep) => sum + dep.montant, 0);

            return {
                id: projet.id,
                nom: projet.nom,
                responsable: projet.responsable.nom,
                budgetAlloue: budget?.montantAlloue || 0,
                totalDepenses: totalDepensesProjet,
                budgetRestant: (budget?.montantAlloue || 0) - totalDepensesProjet,
                tauxUtilisation: budget ? (totalDepensesProjet / budget.montantAlloue) * 100 : 0
            };
        });

        // Besoins en attente
        const besoinsEnAttente = await prisma.besoin.count({
            where: { statut: 'EN_ATTENTE' }
        });

        // Dépenses par type
        const depensesParType = await prisma.depense.groupBy({
            by: ['typeDepense'],
            _sum: { montant: true },
            _count: { id: true }
        });

        return {
            statistiques: {
                totalProjets,
                totalBesoins,
                totalDepenses: totalDepenses._sum.montant || 0,
                totalSalaries,
                besoinsEnAttente
            },
            projets: projetsStats,
            depensesParType
        };
    }

    async getRapportFinancier(debut, fin) {
        const whereClause = {
            dateDepense: {
                gte: new Date(debut),
                lte: new Date(fin)
            }
        };

        const depenses = await prisma.depense.findMany({
            where: whereClause,
            include: {
                projet: true,
                besoin: true
            },
            orderBy: { dateDepense: 'desc' }
        });

        const totalDepenses = depenses.reduce((sum, dep) => sum + dep.montant, 0);

        const depensesParProjet = await prisma.depense.groupBy({
            by: ['projetId'],
            where: whereClause,
            _sum: { montant: true },
            _count: { id: true }
        });

        // Récupérer les noms des projets
        const projetsAvecNoms = await Promise.all(
            depensesParProjet.map(async (dep) => {
                const projet = await prisma.projet.findUnique({
                    where: { id: dep.projetId },
                    select: { nom: true }
                });
                return {
                    projet: projet.nom,
                    total: dep._sum.montant,
                    count: dep._count.id
                };
            })
        );

        return {
            periode: { debut, fin },
            totalDepenses,
            depenses,
            resumeParProjet: projetsAvecNoms
        };
    }
}

module.exports = new ReportingService();