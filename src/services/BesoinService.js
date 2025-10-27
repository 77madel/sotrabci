/*
const prisma = require('../config/database');

class BesoinService {
    async createBesoin(besoinData, utilisateurId) {
        const besoin = await prisma.besoin.create({
            data: {
                ...besoinData,
                statut: 'EN_ATTENTE'
            },
            include: {
                projet: {
                    include: {
                        responsable: { select: { nom: true, email: true } }
                    }
                }
            }
        });

        return besoin;
    }

    async getBesoinsByProjet(projetId) {
        return await prisma.besoin.findMany({
            where: { projetId },
            include: {
                depenses: true,
                projet: true
            },
            orderBy: { dateSoumission: 'desc' }
        });
    }

    async validerBesoin(besoinId, decision, utilisateurId) {
        const besoin = await prisma.besoin.findUnique({
            where: { id: besoinId }
        });

        if (!besoin) {
            throw new Error('Besoin non trouvé');
        }

        const updatedBesoin = await prisma.besoin.update({
            where: { id: besoinId },
            data: {
                statut: decision ? 'VALIDE' : 'REFUSE',
                dateValidation: new Date()
            },
            include: {
                projet: true
            }
        });

        return updatedBesoin;
    }

    async getBesoinsEnAttente() {
        return await prisma.besoin.findMany({
            where: { statut: 'EN_ATTENTE' },
            include: {
                projet: {
                    include: {
                        responsable: { select: { nom: true, email: true } }
                    }
                }
            },
            orderBy: { dateSoumission: 'desc' }
        });
    }
}

module.exports = new BesoinService();*/

/*
const prisma = require('../config/database');

class BesoinService {
    /!**
     * @desc    Créer un nouveau besoin avec récupération automatique du site
     * @param   {Object} besoinData - Données du besoin
     * @param   {String} utilisateurId - ID de l'utilisateur connecté
     * @return  {Promise<Object>} Besoin créé
     *!/
    async createBesoin(besoinData, utilisateurId) {
        try {
            // 🎯 RÉCUPÉRATION AUTOMATIQUE DU SITE
            const projet = await prisma.projet.findUnique({
                where: { id: besoinData.projetId },
                include: {
                    site: {
                        include: {
                            utilisateur: true
                        }
                    }
                }
            });

            if (!projet) {
                throw new Error('Projet non trouvé');
            }

            // Vérifier que l'utilisateur est bien responsable du site
            if (projet.site && projet.site.responsableSite !== utilisateurId) {
                throw new Error('Vous n\'êtes pas responsable du site de ce projet');
            }

            const besoin = await prisma.besoin.create({
                data: {
                    ...besoinData,
                    siteId: projet.siteId, // ✅ SITE AUTOMATIQUE
                    statut: 'EN_ATTENTE'
                },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            },
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });

            return besoin;
        } catch (error) {
            console.error('Erreur service création besoin:', error);
            throw new Error(`Erreur lors de la création du besoin: ${error.message}`);
        }
    }

    /!**
     * @desc    Récupérer les besoins d'un projet avec informations du site
     * @param   {String} projetId - ID du projet
     * @return  {Promise<Array>} Liste des besoins
     *!/
    async getBesoinsByProjet(projetId) {
        try {
            return await prisma.besoin.findMany({
                where: { projetId },
                include: {
                    projet: {
                        include: {
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    },
                    depenses: true
                },
                orderBy: {
                    dateSoumission: 'desc'
                }
            });
        } catch (error) {
            console.error('Erreur service récupération besoins:', error);
            throw new Error('Erreur lors de la récupération des besoins');
        }
    }

    /!**
     * @desc    Récupérer les besoins d'un site spécifique
     * @param   {String} siteId - ID du site
     * @return  {Promise<Array>} Liste des besoins du site
     *!/
    async getBesoinsBySite(siteId) {
        try {
            return await prisma.besoin.findMany({
                where: { siteId },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    },
                    depenses: true
                },
                orderBy: {
                    dateSoumission: 'desc'
                }
            });
        } catch (error) {
            console.error('Erreur service récupération besoins site:', error);
            throw new Error('Erreur lors de la récupération des besoins du site');
        }
    }

    async getBesoinsEnAttente() {
        return await prisma.besoin.findMany({
            where: { statut: 'EN_ATTENTE' },
            include: {
                projet: {
                    include: {
                        responsable: { select: { nom: true, email: true } }
                    }
                }
            },
            orderBy: { dateSoumission: 'desc' }
        });
    }


    async validerBesoin(besoinId, decision, utilisateurId) {
        const besoin = await prisma.besoin.findUnique({
            where: { id: besoinId }
        });

        if (!besoin) {
            throw new Error('Besoin non trouvé');
        }

        const updatedBesoin = await prisma.besoin.update({
            where: { id: besoinId },
            data: {
                statut: decision ? 'VALIDE' : 'REFUSE',
                dateValidation: new Date()
            },
            include: {
                projet: true
            }
        });

        return updatedBesoin;
    }
}

module.exports = new BesoinService();*/

const prisma = require('../config/database');

class BesoinService {
    /**
     * @desc    Créer un nouveau besoin avec récupération automatique du site
     */
    async createBesoin(besoinData, utilisateurId) {
        try {
            // 🎯 RÉCUPÉRATION AUTOMATIQUE DU SITE
            const projet = await prisma.projet.findUnique({
                where: { id: besoinData.projetId },
                include: {
                    site: {
                        include: {
                            utilisateur: true
                        }
                    }
                }
            });

            if (!projet) {
                throw new Error('Projet non trouvé');
            }

            // Vérifier que l'utilisateur est bien responsable du site
            if (projet.site && projet.site.responsableSite !== utilisateurId) {
                throw new Error('Vous n\'êtes pas responsable du site de ce projet');
            }

            const besoin = await prisma.besoin.create({
                data: {
                    ...besoinData,
                    siteId: projet.siteId, // ✅ SITE AUTOMATIQUE
                    statut: 'EN_ATTENTE'
                },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            },
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });

            return besoin;
        } catch (error) {
            console.error('Erreur service création besoin:', error);
            throw new Error(`Erreur lors de la création du besoin: ${error.message}`);
        }
    }

    /**
     * @desc    Valider ou refuser un besoin
     */
    async validerBesoin(besoinId, decision, utilisateurId) {
        try {
            // ✅ VÉRIFIER QUE LE BESOIN EXISTE
            const besoin = await prisma.besoin.findUnique({
                where: { id: besoinId },
                include: {
                    projet: {
                        include: {
                            site: true
                        }
                    }
                }
            });

            if (!besoin) {
                throw new Error('Besoin non trouvé');
            }

            // ✅ VÉRIFIER LES PERMISSIONS (Admin ou Dirigeant seulement)
            const utilisateur = await prisma.utilisateur.findUnique({
                where: { id: utilisateurId },
                select: { role: true }
            });

            if (!utilisateur || (utilisateur.role !== 'ADMIN' && utilisateur.role !== 'DIRIGEANT')) {
                throw new Error('Vous n\'êtes pas autorisé à valider des besoins');
            }

            const updatedBesoin = await prisma.besoin.update({
                where: { id: besoinId },
                data: {
                    statut: decision ? 'VALIDE' : 'REFUSE',
                    dateValidation: new Date()
                },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            },
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    }
                }
            });

            return updatedBesoin;
        } catch (error) {
            console.error('Erreur service validation besoin:', error);
            throw new Error(`Erreur lors de la validation du besoin: ${error.message}`);
        }
    }

    /**
     * @desc    Récupérer les besoins d'un projet
     */
    async getBesoinsByProjet(projetId) {
        try {
            return await prisma.besoin.findMany({
                where: { projetId },
                include: {
                    projet: {
                        include: {
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    },
                    depenses: true
                },
                orderBy: {
                    dateSoumission: 'desc'
                }
            });
        } catch (error) {
            console.error('Erreur service récupération besoins:', error);
            throw new Error('Erreur lors de la récupération des besoins');
        }
    }

    /**
     * @desc    Récupérer les besoins en attente de validation
     */
    async getBesoinsEnAttente() {
        try {
            return await prisma.besoin.findMany({
                where: { statut: 'EN_ATTENTE' },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            },
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    }
                },
                orderBy: {
                    dateSoumission: 'desc'
                }
            });
        } catch (error) {
            console.error('Erreur service récupération besoins en attente:', error);
            throw new Error('Erreur lors de la récupération des besoins en attente');
        }
    }

    /**
     * @desc    Récupérer un besoin par son ID
     */
    async getBesoinById(besoinId) {
        try {
            const besoin = await prisma.besoin.findUnique({
                where: { id: besoinId },
                include: {
                    projet: {
                        include: {
                            responsable: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            },
                            site: {
                                include: {
                                    utilisateur: {
                                        select: {
                                            nom: true,
                                            email: true
                                        }
                                    }
                                }
                            }
                        }
                    },
                    site: {
                        include: {
                            utilisateur: {
                                select: {
                                    nom: true,
                                    email: true
                                }
                            }
                        }
                    },
                    depenses: true
                }
            });

            if (!besoin) {
                throw new Error('Besoin non trouvé');
            }

            return besoin;
        } catch (error) {
            console.error('Erreur service récupération besoin:', error);
            throw error;
        }
    }
}

module.exports = new BesoinService();