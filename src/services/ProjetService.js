/*
const prisma = require('../config/database');

class ProjetService {
    /!**
     * @desc    Créer un nouveau projet
     * @param   {Object} projetData - Données du projet
     * @param   {String} responsableId - ID du responsable
     * @return  {Promise<Object>} Projet créé
     *!/
    async createProjet(projetData, responsableId) {
        try {
            const projet = await prisma.projet.create({
                data: {
                    ...projetData,
                    responsableId
                },
                include: {
                    responsable: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    },
                    budgets: true,
                    besoins: {
                        where: {
                            statut: 'EN_ATTENTE'
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                }
            });

            return projet;
        } catch (error) {
            console.error('Erreur service création projet:', error);
            throw new Error(`Erreur lors de la création du projet: ${error.message}`);
        }
    }

    /!**
     * @desc    Récupérer tous les projets avec leurs relations
     * @return  {Promise<Array>} Liste des projets
     *!/
    async getProjets() {
        try {
            const projets = await prisma.projet.findMany({
                include: {
                    responsable: {
                        select: {
                            id: true,
                            nom: true,
                            email: true
                        }
                    },
                    budgets: {
                        select: {
                            id: true,
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true,
                            dateAllocation: true
                        }
                    },
                    besoins: {
                        take: 5, // Limiter les derniers besoins
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        take: 5, // Limiter les dernières dépenses
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // ✅ CALCULER montantRestant pour chaque budget
            return projets.map(projet => ({
                ...projet,
                budgets: projet.budgets.map(budget => ({
                    ...budget,
                    montantRestant: budget.montantAlloue - budget.montantDepense
                }))
            }));
        } catch (error) {
            console.error('Erreur service récupération projets:', error);
            throw new Error('Erreur lors de la récupération des projets');
        }
    }

    /!**
     * @desc    Récupérer un projet par son ID avec toutes ses relations
     * @param   {String} id - ID du projet
     * @return  {Promise<Object>} Projet détaillé
     *!/
    async getProjetById(id) {
        try {
            const projet = await prisma.projet.findUnique({
                where: { id },
                include: {
                    responsable: {
                        select: {
                            id: true,
                            nom: true,
                            email: true,
                            role: true
                        }
                    },
                    budgets: {
                        include: {
                            depenses: {
                                include: {
                                    besoin: {
                                        select: {
                                            id: true,
                                            description: true
                                        }
                                    }
                                },
                                orderBy: {
                                    dateDepense: 'desc'
                                }
                            }
                        }
                    },
                    besoins: {
                        include: {
                            depenses: true
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        include: {
                            besoin: {
                                select: {
                                    id: true,
                                    description: true
                                }
                            }
                        },
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    affectations: {
                        include: {
                            salarie: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    poste: true
                                }
                            }
                        }
                    }
                }
            });

            if (!projet) {
                throw new Error('Projet non trouvé');
            }

            // ✅ CALCULER montantRestant pour chaque budget
            projet.budgets = projet.budgets.map(budget => ({
                ...budget,
                montantRestant: budget.montantAlloue - budget.montantDepense
            }));

            return projet;
        } catch (error) {
            console.error('Erreur service récupération projet:', error);
            throw error; // Propager l'erreur originale
        }
    }

    /!**
     * @desc    Mettre à jour un projet
     * @param   {String} id - ID du projet
     * @param   {Object} updateData - Données de mise à jour
     * @return  {Promise<Object>} Projet mis à jour
     *!/
    async updateProjet(id, updateData) {
        try {
            const projet = await prisma.projet.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
                include: {
                    responsable: {
                        select: {
                            nom: true,
                            email: true
                        }
                    },
                    budgets: {
                        select: {
                            id: true,
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true
                        }
                    }
                }
            });

            // ✅ CALCULER montantRestant pour chaque budget
            projet.budgets = projet.budgets.map(budget => ({
                ...budget,
                montantRestant: budget.montantAlloue - budget.montantDepense
            }));

            return projet;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Projet non trouvé');
            }
            console.error('Erreur service mise à jour projet:', error);
            throw new Error('Erreur lors de la mise à jour du projet');
        }
    }

    /!**
     * @desc    Récupérer les projets d'un responsable
     * @param   {String} responsableId - ID du responsable
     * @return  {Promise<Array>} Liste des projets du responsable
     *!/
    async getProjetsByResponsable(responsableId) {
        try {
            const projets = await prisma.projet.findMany({
                where: {
                    responsableId
                },
                include: {
                    budgets: {
                        select: {
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true
                        }
                    },
                    besoins: {
                        where: {
                            statut: 'EN_ATTENTE'
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        take: 10,
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            // ✅ CALCULER montantRestant pour chaque budget
            return projets.map(projet => ({
                ...projet,
                budgets: projet.budgets.map(budget => ({
                    ...budget,
                    montantRestant: budget.montantAlloue - budget.montantDepense
                }))
            }));
        } catch (error) {
            console.error('Erreur service projets responsable:', error);
            throw new Error('Erreur lors de la récupération des projets du responsable');
        }
    }

    /!**
     * @desc    Supprimer un projet
     * @param   {String} id - ID du projet
     * @return  {Promise<void>}
     *!/
    async deleteProjet(id) {
        try {
            // 🗑️ Prisma gère la suppression en cascade grâce aux relations
            await prisma.projet.delete({
                where: { id }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Projet non trouvé');
            }
            console.error('Erreur service suppression projet:', error);
            throw new Error('Erreur lors de la suppression du projet');
        }
    }

    /!**
     * @desc    Récupérer les statistiques des projets
     * @return  {Promise<Object>} Statistiques des projets
     *!/
    async getStatistiquesProjets() {
        try {
            const totalProjets = await prisma.projet.count();
            const projetsActifs = await prisma.projet.count({
                where: { statut: 'ACTIF' }
            });
            const projetsParMinistere = await prisma.projet.groupBy({
                by: ['ministere'],
                _count: {
                    id: true
                }
            });

            return {
                totalProjets,
                projetsActifs,
                projetsParMinistere,
                tauxActivation: totalProjets > 0 ? (projetsActifs / totalProjets) * 100 : 0
            };
        } catch (error) {
            console.error('Erreur service statistiques projets:', error);
            throw new Error('Erreur lors du calcul des statistiques');
        }
    }

    /!**
     * @desc    Calculer le montant restant d'un budget
     * @param   {Object} budget - Objet budget
     * @return  {Number} Montant restant
     *!/
    calculerMontantRestant(budget) {
        return budget.montantAlloue - budget.montantDepense;
    }

    /!**
     * @desc    Vérifier si un budget est épuisé
     * @param   {Object} budget - Objet budget
     * @return  {Boolean} True si le budget est épuisé
     *!/
    isBudgetEpuise(budget) {
        return this.calculerMontantRestant(budget) <= 0;
    }
}

module.exports = new ProjetService();*/

const prisma = require('../config/database');

class ProjetService {
    /**
     * @desc    Créer un nouveau projet avec lien vers le site
     * @param   {Object} projetData - Données du projet
     * @param   {String} responsableId - ID du responsable
     * @return  {Promise<Object>} Projet créé
     */
    async createProjet(projetData, responsableId) {
        try {
            // 🎯 VÉRIFIER QUE LE RESPONSABLE EST BIEN RESPONSABLE DU SITE
            if (projetData.siteId) {
                const site = await prisma.site.findUnique({
                    where: { id: projetData.siteId }
                });

                if (!site) {
                    throw new Error('Site non trouvé');
                }

                if (site.responsableSite !== responsableId) {
                    throw new Error('Vous n\'êtes pas responsable de ce site');
                }
            }

            const projet = await prisma.projet.create({
                data: {
                    ...projetData,
                    responsableId // ✅ LE CRÉATEUR DEVIENT RESPONSABLE
                },
                include: {
                    responsable: {
                        select: {
                            id: true,
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
                    },
                    budgets: true,
                    besoins: {
                        where: {
                            statut: 'EN_ATTENTE'
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                }
            });

            return projet;
        } catch (error) {
            console.error('Erreur service création projet:', error);
            throw new Error(`Erreur lors de la création du projet: ${error.message}`);
        }
    }

    /**
     * @desc    Récupérer TOUS les projets (uniquement pour Admin et Dirigeant)
     * @return  {Promise<Array>} Liste des projets
     */
    async getAllProjets() {
        try {
            const projets = await prisma.projet.findMany({
                include: {
                    responsable: {
                        select: {
                            id: true,
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
                    },
                    budgets: {
                        select: {
                            id: true,
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true,
                            dateAllocation: true
                        }
                    },
                    besoins: {
                        take: 5,
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        take: 5,
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return projets.map(projet => ({
                ...projet,
                budgets: projet.budgets.map(budget => ({
                    ...budget,
                    montantRestant: budget.montantAlloue - budget.montantDepense
                }))
            }));
        } catch (error) {
            console.error('Erreur service récupération tous projets:', error);
            throw new Error('Erreur lors de la récupération des projets');
        }
    }

    /**
     * @desc    Récupérer les projets d'un responsable spécifique
     * @param   {String} responsableId - ID du responsable
     * @return  {Promise<Array>} Liste des projets du responsable
     */
    async getProjetsByResponsable(responsableId) {
        try {
            const projets = await prisma.projet.findMany({
                where: {
                    responsableId: responsableId // ✅ SEULEMENT LES PROJETS DU RESPONSABLE
                },
                include: {
                    responsable: {
                        select: {
                            id: true,
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
                    },
                    budgets: {
                        select: {
                            id: true,
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true,
                            dateAllocation: true
                        }
                    },
                    besoins: {
                        where: {
                            statut: 'EN_ATTENTE'
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        take: 10,
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    _count: {
                        select: {
                            besoins: true,
                            depenses: true,
                            affectations: true
                        }
                    }
                },
                orderBy: {
                    createdAt: 'desc'
                }
            });

            return projets.map(projet => ({
                ...projet,
                budgets: projet.budgets.map(budget => ({
                    ...budget,
                    montantRestant: budget.montantAlloue - budget.montantDepense
                }))
            }));
        } catch (error) {
            console.error('Erreur service projets responsable:', error);
            throw new Error('Erreur lors de la récupération des projets du responsable');
        }
    }

    /**
     * @desc    Récupérer un projet par son ID avec vérification des permissions
     * @param   {String} id - ID du projet
     * @param   {String} utilisateurId - ID de l'utilisateur connecté
     * @param   {String} role - Rôle de l'utilisateur connecté
     * @return  {Promise<Object>} Projet détaillé
     */
    async getProjetByIdWithPermissions(id, utilisateurId, role) {
        try {
            const projet = await prisma.projet.findUnique({
                where: { id },
                include: {
                    responsable: {
                        select: {
                            id: true,
                            nom: true,
                            email: true,
                            role: true
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
                    budgets: {
                        include: {
                            depenses: {
                                include: {
                                    besoin: {
                                        select: {
                                            id: true,
                                            description: true
                                        }
                                    }
                                },
                                orderBy: {
                                    dateDepense: 'desc'
                                }
                            }
                        }
                    },
                    besoins: {
                        include: {
                            depenses: true
                        },
                        orderBy: {
                            dateSoumission: 'desc'
                        }
                    },
                    depenses: {
                        include: {
                            besoin: {
                                select: {
                                    id: true,
                                    description: true
                                }
                            }
                        },
                        orderBy: {
                            dateDepense: 'desc'
                        }
                    },
                    affectations: {
                        include: {
                            salarie: {
                                select: {
                                    id: true,
                                    nom: true,
                                    prenom: true,
                                    poste: true
                                }
                            }
                        }
                    }
                }
            });

            if (!projet) {
                throw new Error('Projet non trouvé');
            }

            // 🔐 VÉRIFICATION DES PERMISSIONS
            // Seul le responsable du projet, un admin ou le dirigeant peut voir le projet
            if (projet.responsableId !== utilisateurId &&
                role !== 'ADMIN' &&
                role !== 'DIRIGEANT') {
                throw new Error('Vous n\'êtes pas autorisé à voir ce projet');
            }

            // Calculer montantRestant pour chaque budget
            projet.budgets = projet.budgets.map(budget => ({
                ...budget,
                montantRestant: budget.montantAlloue - budget.montantDepense
            }));

            return projet;
        } catch (error) {
            console.error('Erreur service récupération projet avec permissions:', error);
            throw error;
        }
    }

    /**
     * @desc    Mettre à jour un projet avec vérification des permissions
     * @param   {String} id - ID du projet
     * @param   {Object} updateData - Données de mise à jour
     * @param   {String} utilisateurId - ID de l'utilisateur connecté
     * @param   {String} role - Rôle de l'utilisateur connecté
     * @return  {Promise<Object>} Projet mis à jour
     */
    async updateProjetWithPermissions(id, updateData, utilisateurId, role) {
        try {
            // 🔐 VÉRIFIER LES PERMISSIONS AVANT LA MISE À JOUR
            const projetExistant = await prisma.projet.findUnique({
                where: { id },
                select: { responsableId: true }
            });

            if (!projetExistant) {
                throw new Error('Projet non trouvé');
            }

            // Seul le responsable du projet, un admin ou le dirigeant peut modifier
            if (projetExistant.responsableId !== utilisateurId &&
                role !== 'ADMIN' &&
                role !== 'DIRIGEANT') {
                throw new Error('Vous n\'êtes pas autorisé à modifier ce projet');
            }

            const projet = await prisma.projet.update({
                where: { id },
                data: {
                    ...updateData,
                    updatedAt: new Date()
                },
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
                    },
                    budgets: {
                        select: {
                            id: true,
                            montantAlloue: true,
                            montantDepense: true,
                            statut: true
                        }
                    }
                }
            });

            // Calculer montantRestant pour chaque budget
            projet.budgets = projet.budgets.map(budget => ({
                ...budget,
                montantRestant: budget.montantAlloue - budget.montantDepense
            }));

            return projet;
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Projet non trouvé');
            }
            console.error('Erreur service mise à jour projet avec permissions:', error);
            throw new Error('Erreur lors de la mise à jour du projet');
        }
    }

    /**
     * @desc    Vérifier si un utilisateur peut modifier un projet
     * @param   {String} projetId - ID du projet
     * @param   {String} utilisateurId - ID de l'utilisateur
     * @param   {String} role - Rôle de l'utilisateur
     * @return  {Promise<Boolean>} True si l'utilisateur peut modifier
     */
    async canUserModifyProjet(projetId, utilisateurId, role) {
        try {
            // Les admins et dirigeants peuvent tout modifier
            if (role === 'ADMIN' || role === 'DIRIGEANT') {
                return true;
            }

            // Les responsables ne peuvent modifier que leurs propres projets
            const projet = await prisma.projet.findUnique({
                where: { id: projetId },
                select: { responsableId: true }
            });

            return projet && projet.responsableId === utilisateurId;
        } catch (error) {
            console.error('Erreur vérification permissions modification:', error);
            return false;
        }
    }

    /**
     * @desc    Vérifier si un utilisateur peut voir un projet
     * @param   {String} projetId - ID du projet
     * @param   {String} utilisateurId - ID de l'utilisateur
     * @param   {String} role - Rôle de l'utilisateur
     * @return  {Promise<Boolean>} True si l'utilisateur peut voir
     */
    async canUserViewProjet(projetId, utilisateurId, role) {
        try {
            // Les admins et dirigeants peuvent tout voir
            if (role === 'ADMIN' || role === 'DIRIGEANT') {
                return true;
            }

            // Les responsables ne peuvent voir que leurs propres projets
            const projet = await prisma.projet.findUnique({
                where: { id: projetId },
                select: { responsableId: true }
            });

            return projet && projet.responsableId === utilisateurId;
        } catch (error) {
            console.error('Erreur vérification permissions visualisation:', error);
            return false;
        }
    }

    /**
    * @desc    Calculer le montant restant d'un budget
    * @param   {Object} budget - Objet budget
    * @return  {Number} Montant restant
    */
    calculerMontantRestant(budget) {
        return budget.montantAlloue - budget.montantDepense;
    }

    /**
    * @desc    Vérifier si un budget est épuisé
    * @param   {Object} budget - Objet budget
    * @return  {Boolean} True si le budget est épuisé
    */
    isBudgetEpuise(budget) {
        return this.calculerMontantRestant(budget) <= 0;
    }

    /**
    * @desc    Supprimer un projet
    * @param   {String} id - ID du projet
    * @return  {Promise<void>}
    */
    async deleteProjet(id) {
        try {
            // 🗑️ Prisma gère la suppression en cascade grâce aux relations
            await prisma.projet.delete({
                where: { id }
            });
        } catch (error) {
            if (error.code === 'P2025') {
                throw new Error('Projet non trouvé');
            }
            console.error('Erreur service suppression projet:', error);
            throw new Error('Erreur lors de la suppression du projet');
        }
    }

    /**
    * @desc    Récupérer les statistiques des projets
    * @return  {Promise<Object>} Statistiques des projets
    */
    async getStatistiquesProjets() {
        try {
            const totalProjets = await prisma.projet.count();
            const projetsActifs = await prisma.projet.count({
                where: {statut: 'ACTIF'}
            });
            const projetsParMinistere = await prisma.projet.groupBy({
                by: ['ministere'],
                _count: {
                    id: true
                }
            });

            return {
                totalProjets,
                projetsActifs,
                projetsParMinistere,
                tauxActivation: totalProjets > 0 ? (projetsActifs / totalProjets) * 100 : 0
            };
        } catch (error) {
            console.error('Erreur service statistiques projets:', error);
            throw new Error('Erreur lors du calcul des statistiques');
        }
    }

}

module.exports = new ProjetService();