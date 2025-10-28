/*
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

// 🔧 Initialisation explicite du client Prisma
const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding...');

    try {
        // Vérifier si la caisse existe déjà
        let caisse = await prisma.caisseGenerale.findFirst();

        if (!caisse) {
            // Créer la caisse générale
            caisse = await prisma.caisseGenerale.create({
                data: {
                    soldeInitial: 100000,
                    soldeActuel: 100000,
                    devise: 'CFA'
                }
            });
            console.log('✅ Caisse générale créée');
        } else {
            console.log('ℹ️ Caisse générale existe déjà');
        }

        // Vérifier et créer les utilisateurs
        const usersData = [
            {
                nom: 'Administrateur System',
                email: 'admin@gestion.com',
                role: 'ADMIN',
                motDePasse: 'admin123'
            },
            {
                nom: 'Pierre Dirigeant',
                email: 'dirigeant@gestion.com',
                role: 'DIRIGEANT',
                motDePasse: 'dirigeant123'
            },
            {
                nom: 'Marie Responsable',
                email: 'responsable@gestion.com',
                role: 'RESPONSABLE',
                motDePasse: 'responsable123'
            }
        ];

        for (const userData of usersData) {
            const existingUser = await prisma.utilisateur.findUnique({
                where: { email: userData.email }
            });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.motDePasse, 12);
                await prisma.utilisateur.create({
                    data: {
                        nom: userData.nom,
                        email: userData.email,
                        motDePasse: hashedPassword,
                        role: userData.role
                    }
                });
                console.log(`✅ Utilisateur ${userData.email} créé`);
            } else {
                console.log(`ℹ️ Utilisateur ${userData.email} existe déjà`);
            }
        }

        // Créer des projets
        const responsable = await prisma.utilisateur.findUnique({
            where: { email: 'responsable@gestion.com' }
        });

        const dirigeant = await prisma.utilisateur.findUnique({
            where: { email: 'dirigeant@gestion.com' }
        });

        if (responsable && dirigeant) {
            const projetsData = [
                {
                    nom: 'Modernisation Infrastructure',
                    ministere: 'Intérieur',
                    responsableId: responsable.id,
                    dateDebut: new Date('2024-01-01')
                },
                {
                    nom: 'Équipements Scolaires',
                    ministere: 'Éducation',
                    responsableId: responsable.id,
                    dateDebut: new Date('2024-02-01')
                },
                {
                    nom: 'Projet Aboville',
                    ministere: 'Personnel',
                    responsableId: dirigeant.id,
                    dateDebut: new Date('2024-03-01')
                }
            ];

            for (const projetData of projetsData) {
                const existingProjet = await prisma.projet.findFirst({
                    where: { nom: projetData.nom }
                });

                if (!existingProjet) {
                    const projet = await prisma.projet.create({
                        data: projetData
                    });

                    // Allouer un budget au projet
                    await prisma.budget.create({
                        data: {
                            montantAlloue: projetData.nom.includes('Infrastructure') ? 30000 :
                                projetData.nom.includes('Scolaires') ? 25000 : 20000,
                            projetId: projet.id,
                            caisseId: caisse.id
                        }
                    });

                    console.log(`✅ Projet "${projetData.nom}" créé avec budget`);
                } else {
                    console.log(`ℹ️ Projet "${projetData.nom}" existe déjà`);
                }
            }
        }

        // Créer des salariés
        const salariesData = [
            {
                nom: 'Dupont',
                prenom: 'Jean',
                poste: 'Chef de projet',
                salaireBase: 3500,
                dateEmbauche: new Date('2023-01-15')
            },
            {
                nom: 'Martin',
                prenom: 'Sophie',
                poste: 'Développeur',
                salaireBase: 2800,
                dateEmbauche: new Date('2023-03-20')
            }
        ];

        for (const salarieData of salariesData) {
            const existingSalarie = await prisma.salarie.findFirst({
                where: {
                    nom: salarieData.nom,
                    prenom: salarieData.prenom
                }
            });

            if (!existingSalarie) {
                await prisma.salarie.create({
                    data: salarieData
                });
                console.log(`✅ Salarié ${salarieData.prenom} ${salarieData.nom} créé`);
            } else {
                console.log(`ℹ️ Salarié ${salarieData.prenom} ${salarieData.nom} existe déjà`);
            }
        }

        console.log('🎉 Seeding terminé avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        throw error;
    }

// Ajouter des sites
    const site1 = await prisma.site.create({
        data: {
            nom: 'Site Aboville',
            adresse: '123 Rue Principale, Aboville',
            responsableSite: responsable.id
        }
    });

    const site2 = await prisma.site.create({
        data: {
            nom: 'Site Ministère Intérieur',
            adresse: '456 Avenue du Gouvernement, Paris',
            responsableSite: responsable.id
        }
    });

    console.log('✅ Sites créés');

// Mettre à jour les projets avec les sites
    await prisma.projet.update({
        where: { id: projet1.id },
        data: { siteId: site1.id }
    });

    await prisma.projet.update({
        where: { id: projet2.id },
        data: { siteId: site2.id }
    });

    await prisma.projet.update({
        where: { id: projet3.id },
        data: { siteId: site1.id }
    });

    console.log('✅ Projets associés aux sites');
}

// Exécution avec gestion propre des erreurs
main()
    .catch((e) => {
        console.error('💥 Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Déconnexion de la base de données');
    });*/

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Début du seeding...');

    try {
        // Vérifier si la caisse existe déjà
        let caisse = await prisma.caisseGenerale.findFirst();

        if (!caisse) {
            // Créer la caisse générale
            caisse = await prisma.caisseGenerale.create({
                data: {
                    soldeInitial: 100000,
                    soldeActuel: 100000,
                    devise: 'EUR'
                }
            });
            console.log('✅ Caisse générale créée');
        } else {
            console.log('ℹ️ Caisse générale existe déjà');
        }

        // Vérifier et créer les utilisateurs
        const usersData = [
            {
                nom: 'Administrateur System',
                email: 'admin@gestion.com',
                role: 'ADMIN',
                motDePasse: 'admin123'
            },
            {
                nom: 'Pierre Dirigeant',
                email: 'dirigeant@gestion.com',
                role: 'DIRIGEANT',
                motDePasse: 'dirigeant123'
            },
            {
                nom: 'Marie Responsable',
                email: 'responsable@gestion.com',
                role: 'RESPONSABLE',
                motDePasse: 'responsable123'
            }
        ];

        const createdUsers = {};

        for (const userData of usersData) {
            const existingUser = await prisma.utilisateur.findUnique({
                where: { email: userData.email }
            });

            if (!existingUser) {
                const hashedPassword = await bcrypt.hash(userData.motDePasse, 12);
                const user = await prisma.utilisateur.create({
                    data: {
                        nom: userData.nom,
                        email: userData.email,
                        motDePasse: hashedPassword,
                        role: userData.role
                    }
                });
                createdUsers[userData.role.toLowerCase()] = user;
                console.log(`✅ Utilisateur ${userData.email} créé`);
            } else {
                createdUsers[userData.role.toLowerCase()] = existingUser;
                console.log(`ℹ️ Utilisateur ${userData.email} existe déjà`);
            }
        }

        // ✅ CORRECTION : Récupérer les utilisateurs créés
        const admin = createdUsers.admin;
        const dirigeant = createdUsers.dirigeant;
        const responsable = createdUsers.responsable;

        if (!admin || !dirigeant || !responsable) {
            throw new Error('Certains utilisateurs n\'ont pas pu être créés');
        }

        console.log('✅ Tous les utilisateurs sont prêts');

        // Créer des sites
        const sitesData = [
            {
                nom: 'Site Aboville',
                adresse: '123 Rue Principale, Aboville',
                responsableSite: responsable.id
            },
            {
                nom: 'Site Ministère Intérieur',
                adresse: '456 Avenue du Gouvernement, Paris',
                responsableSite: responsable.id
            },
            {
                nom: 'Site Éducation Nationale',
                adresse: '789 Boulevard des Écoles, Lyon',
                responsableSite: responsable.id
            }
        ];

        const createdSites = {};

        for (const siteData of sitesData) {
            const existingSite = await prisma.site.findFirst({
                where: { nom: siteData.nom }
            });

            if (!existingSite) {
                const site = await prisma.site.create({
                    data: siteData
                });
                createdSites[site.nom] = site;
                console.log(`✅ Site "${siteData.nom}" créé`);
            } else {
                createdSites[siteData.nom] = existingSite;
                console.log(`ℹ️ Site "${siteData.nom}" existe déjà`);
            }
        }

        console.log('✅ Sites créés');

        // Créer des projets
        const projetsData = [
            {
                nom: 'Modernisation Infrastructure',
                ministere: 'Intérieur',
                responsableId: responsable.id,
                siteId: createdSites['Site Ministère Intérieur'].id,
                dateDebut: new Date('2024-01-01')
            },
            {
                nom: 'Équipements Scolaires',
                ministere: 'Éducation',
                responsableId: responsable.id,
                siteId: createdSites['Site Éducation Nationale'].id,
                dateDebut: new Date('2024-02-01')
            },
            {
                nom: 'Projet Aboville',
                ministere: 'Personnel',
                responsableId: dirigeant.id,
                siteId: createdSites['Site Aboville'].id,
                dateDebut: new Date('2024-03-01')
            }
        ];

        const createdProjets = {};

        for (const projetData of projetsData) {
            const existingProjet = await prisma.projet.findFirst({
                where: { nom: projetData.nom }
            });

            if (!existingProjet) {
                const projet = await prisma.projet.create({
                    data: projetData
                });

                // Allouer un budget au projet
                let montantAlloue;
                if (projetData.nom.includes('Infrastructure')) {
                    montantAlloue = 30000;
                } else if (projetData.nom.includes('Scolaires')) {
                    montantAlloue = 25000;
                } else {
                    montantAlloue = 20000;
                }

                await prisma.budget.create({
                    data: {
                        montantAlloue: montantAlloue,
                        projetId: projet.id,
                        caisseId: caisse.id
                    }
                });

                createdProjets[projet.nom] = projet;
                console.log(`✅ Projet "${projetData.nom}" créé avec budget de ${montantAlloue} €`);
            } else {
                // ✅ Mettre à jour le siteId si le projet existe déjà
                const updatedProjet = await prisma.projet.update({
                    where: { id: existingProjet.id },
                    data: { siteId: projetData.siteId }
                });
                createdProjets[projetData.nom] = updatedProjet;
                console.log(`✅ Projet "${projetData.nom}" mis à jour avec le site`);
            }
        }

        console.log('✅ Projets créés avec budgets');

        // Créer des salariés
        const salariesData = [
            {
                nom: 'Dupont',
                prenom: 'Jean',
                poste: 'Chef de projet',
                salaireBase: 3500,
                dateEmbauche: new Date('2023-01-15')
            },
            {
                nom: 'Martin',
                prenom: 'Sophie',
                poste: 'Développeur',
                salaireBase: 2800,
                dateEmbauche: new Date('2023-03-20')
            },
            {
                nom: 'Bernard',
                prenom: 'Luc',
                poste: 'Analyste',
                salaireBase: 3200,
                dateEmbauche: new Date('2023-05-10')
            }
        ];

        const createdSalaries = {};

        for (const salarieData of salariesData) {
            const existingSalarie = await prisma.salarie.findFirst({
                where: {
                    nom: salarieData.nom,
                    prenom: salarieData.prenom
                }
            });

            if (!existingSalarie) {
                const salarie = await prisma.salarie.create({
                    data: salarieData
                });
                createdSalaries[`${salarieData.prenom} ${salarieData.nom}`] = salarie;
                console.log(`✅ Salarié ${salarieData.prenom} ${salarieData.nom} créé`);
            } else {
                createdSalaries[`${salarieData.prenom} ${salarieData.nom}`] = existingSalarie;
                console.log(`ℹ️ Salarié ${salarieData.prenom} ${salarieData.nom} existe déjà`);
            }
        }

        console.log('✅ Salariés créés');

        // Affecter des salariés aux projets
        const affectationsData = [
            {
                salarieId: createdSalaries['Jean Dupont'].id,
                projetId: createdProjets['Modernisation Infrastructure'].id
            },
            {
                salarieId: createdSalaries['Sophie Martin'].id,
                projetId: createdProjets['Équipements Scolaires'].id
            },
            {
                salarieId: createdSalaries['Luc Bernard'].id,
                projetId: createdProjets['Projet Aboville'].id
            }
        ];

        for (const affectationData of affectationsData) {
            const existingAffectation = await prisma.affectationSalarie.findFirst({
                where: {
                    salarieId: affectationData.salarieId,
                    projetId: affectationData.projetId
                }
            });

            if (!existingAffectation) {
                await prisma.affectationSalarie.create({
                    data: affectationData
                });
                console.log(`✅ Salarié affecté au projet`);
            } else {
                console.log(`ℹ️ Affectation existe déjà`);
            }
        }

        console.log('✅ Salariés affectés aux projets');

        // Créer quelques besoins de test
        const besoinsData = [
            {
                description: 'Achat de matériel informatique',
                montantEstime: 5000,
                projetId: createdProjets['Modernisation Infrastructure'].id
            },
            {
                description: 'Formation équipe',
                montantEstime: 3000,
                projetId: createdProjets['Équipements Scolaires'].id
            },
            {
                description: 'Frais de déplacement',
                montantEstime: 1500,
                projetId: createdProjets['Projet Aboville'].id
            }
        ];

        for (const besoinData of besoinsData) {
            const existingBesoin = await prisma.besoin.findFirst({
                where: {
                    description: besoinData.description,
                    projetId: besoinData.projetId
                }
            });

            if (!existingBesoin) {
                // Récupérer le siteId du projet automatiquement
                const projet = await prisma.projet.findUnique({
                    where: { id: besoinData.projetId },
                    select: { siteId: true }
                });

                await prisma.besoin.create({
                    data: {
                        ...besoinData,
                        siteId: projet.siteId // ✅ Site récupéré automatiquement
                    }
                });
                console.log(`✅ Besoin "${besoinData.description}" créé`);
            } else {
                console.log(`ℹ️ Besoin "${besoinData.description}" existe déjà`);
            }
        }

        console.log('✅ Besoins créés');

        console.log('🎉 Seeding terminé avec succès !');

    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        throw error;
    }
}

// Exécution avec gestion propre des erreurs
main()
    .catch((e) => {
        console.error('💥 Erreur fatale:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        console.log('🔌 Déconnexion de la base de données');
    });