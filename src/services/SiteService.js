const prisma = require('../config/database');

class SiteService {
    /**
     * @desc    Créer un nouveau site
     * @param   {Object} siteData - Données du site
     * @return  {Promise<Object>} Site créé
     */
    async createSite(siteData) {
        try {
            const site = await prisma.site.create({
                data: siteData,
                include: {
                    utilisateur: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    },
                    projets: {
                        include: {
                            budgets: true,
                            _count: {
                                select: {
                                    besoins: true,
                                    depenses: true
                                }
                            }
                        }
                    }
                }
            });

            return site;
        } catch (error) {
            console.error('Erreur service création site:', error);
            throw new Error(`Erreur lors de la création du site: ${error.message}`);
        }
    }

    /**
     * @desc    Récupérer tous les sites
     * @return  {Promise<Array>} Liste des sites
     */
    async getSites() {
        try {
            return await prisma.site.findMany({
                include: {
                    utilisateur: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    },
                    projets: {
                        include: {
                            budgets: {
                                select: {
                                    montantAlloue: true,
                                    montantDepense: true
                                }
                            },
                            _count: {
                                select: {
                                    besoins: true,
                                    depenses: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            projets: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });
        } catch (error) {
            console.error('Erreur service récupération sites:', error);
            throw new Error('Erreur lors de la récupération des sites');
        }
    }

    /**
     * @desc    Récupérer un site par son ID
     * @param   {String} id - ID du site
     * @return  {Promise<Object>} Site détaillé
     */
    async getSiteById(id) {
        try {
            const site = await prisma.site.findUnique({
                where: { id },
                include: {
                    utilisateur: {
                        select: {
                            id: true,
                            nom: true,
                            email: true,
                            role: true
                        }
                    },
                    projets: {
                        include: {
                            budgets: {
                                select: {
                                    montantAlloue: true,
                                    montantDepense: true
                                }
                            },
                            besoins: {
                                where: {
                                    statut: 'EN_ATTENTE'
                                }
                            },
                            _count: {
                                select: {
                                    besoins: true,
                                    depenses: true
                                }
                            }
                        }
                    }
                }
            });

            if (!site) {
                throw new Error('Site non trouvé');
            }

            return site;
        } catch (error) {
            console.error('Erreur service récupération site:', error);
            throw error;
        }
    }

    /**
     * @desc    Récupérer les sites d'un responsable
     * @param   {String} responsableId - ID du responsable
     * @return  {Promise<Array>} Liste des sites du responsable
     */
    async getSitesByResponsable(responsableId) {
        try {
            return await prisma.site.findMany({
                where: {
                    responsableSite: responsableId
                },
                include: {
                    utilisateur: {
                        select: {
                            nom: true,
                            email: true
                        }
                    },
                    projets: {
                        include: {
                            budgets: {
                                select: {
                                    montantAlloue: true,
                                    montantDepense: true
                                }
                            }
                        }
                    },
                    _count: {
                        select: {
                            projets: true
                        }
                    }
                },
                orderBy: {
                    nom: 'asc'
                }
            });
        } catch (error) {
            console.error('Erreur service sites responsable:', error);
            throw new Error('Erreur lors de la récupération des sites du responsable');
        }
    }

    /**
     * @desc    Mettre à jour un site
     * @param   {String} id - ID du site
     * @param   {Object} updateData - Données de mise à jour
     * @return  {Promise<Object>} Site mis à jour
     */
    async updateSite(id, updateData) {
        try {
            const site = await prisma.site.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    utilisateur: {
                        select: {
                            nom: true,
                            email: true
                        }
                    }
                }
            });

            return site;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Site non trouvé');
            }
            console.error('Erreur service mise à jour site:', error);
            throw new Error('Erreur lors de la mise à jour du site');
        }
    }

    /**
     * @desc    Supprimer un site
     * @param   {String} id - ID du site
     * @return  {Promise<void>}
     */
    async deleteSite(id) {
        try {
            await prisma.site.delete({
                where: { id }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Site non trouvé');
            }
            console.error('Erreur service suppression site:', error);
            throw new Error('Erreur lors de la suppression du site');
        }
    }
}

module.exports = new SiteService();