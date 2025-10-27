const prisma = require('../config/database');

class SalarieService {
    async createSalarie(salarieData) {
        const salarie = await prisma.salarie.create({
            data: salarieData
        });

        return salarie;
    }

    async getSalaries() {
        return await prisma.salarie.findMany({
            include: {
                affectations: {
                    include: {
                        projet: true
                    }
                }
            },
            orderBy: { nom: 'asc' }
        });
    }

    async affecterSalarie(salarieId, projetId) {
        const affectation = await prisma.affectationSalarie.create({
            data: {
                salarieId,
                projetId
            },
            include: {
                salarie: true,
                projet: true
            }
        });

        return affectation;
    }

    async genererBulletinPaie(salarieId, mois, annee) {
        const salarie = await prisma.salarie.findUnique({
            where: { id: salarieId }
        });

        if (!salarie) {
            throw new Error('Salarié non trouvé');
        }

        // Calculer le salaire net (simplifié)
        const salaireBrut = salarie.salaireBase;
        const cotisations = salaireBrut * 0.23; // 23% de cotisations
        const salaireNet = salaireBrut - cotisations;

        const bulletin = {
            salarie: {
                nom: salarie.nom,
                prenom: salarie.prenom,
                poste: salarie.poste
            },
            periode: {
                mois,
                annee
            },
            salaire: {
                brut: salaireBrut,
                cotisations: cotisations,
                net: salaireNet
            },
            dateGeneration: new Date()
        };

        return bulletin;
    }

    async getSalariesByProjet(projetId) {
        const affectations = await prisma.affectationSalarie.findMany({
            where: { projetId },
            include: {
                salarie: true
            }
        });

        return affectations.map(aff => aff.salarie);
    }
}

module.exports = new SalarieService();