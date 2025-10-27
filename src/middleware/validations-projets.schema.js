const { z } = require('zod');

// Schémas de validation pour les projets
const projetsSchemas = {
    createProjet: z.object({
        code: z.string()
            .min(3, 'Code trop court')
            .max(50, 'Code trop long')
            .regex(/^[A-Z0-9_]+$/, 'Code invalide'),
        nom: z.string()
            .min(5, 'Nom trop court')
            .max(255, 'Nom trop long'),
        description: z.string()
            .min(10, 'Description minimale 10 caractères')
            .max(2000, 'Description trop longue'),
        budgetAlloue: z.number()
            .positive('Budget doit être positif')
            .multipleOf(100, 'Budget doit être un multiple de 100'),
        dateDebut: z.string().datetime('Format date-heure invalide').optional(),
        dateFin: z.string().datetime('Format date-heure invalide'),
        ministereId: z.number().int().positive('ID ministère invalide'),
        statut: z.enum(['EN_PREPARATION', 'EN_COURS', 'SUSPENDU', 'TERMINE', 'ANNULE']).optional(),
    }).strict(),

    updateProjet: z.object({
        nom: z.string().min(5).max(255).optional(),
        description: z.string().min(10).max(2000).optional(),
        budgetAlloue: z.number().positive().multipleOf(100).optional(),
        dateFin: z.string().datetime().optional(),
        statut: z.enum(['EN_PREPARATION', 'EN_COURS', 'SUSPENDU', 'TERMINE', 'ANNULE']).optional(),
    }).strict(),

    updateAvancement: z.object({
        pourcentageAvancement: z.number()
            .min(0, 'Minimum 0%')
            .max(100, 'Maximum 100%')
            .int('Doit être un nombre entier'),
        dateDebutReelle: z.string().datetime().optional(),
        dateFinReelle: z.string().datetime().optional(),
    }).strict(),

    filterProjets: z.object({
        page: z.coerce.number().int().positive().optional(),
        limit: z.coerce.number().int().min(1).max(100).optional(),
        statut: z.enum(['EN_PREPARATION', 'EN_COURS', 'SUSPENDU', 'TERMINE', 'ANNULE']).optional(),
        ministereId: z.coerce.number().int().positive().optional(),
        search: z.string().max(100).optional(),
    }).strict(),
};

// Schémas de validation pour les utilisateurs
const utilisateursSchemas = {
    createUtilisateur: z.object({
        login: z.string()
            .min(3, 'Login minimum 3 caractères')
            .max(30, 'Login maximum 30 caractères')
            .regex(/^[a-zA-Z0-9_-]+$/, 'Login invalide'),
        motDePasse: z.string()
            .min(8, 'Mot de passe minimum 8 caractères')
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[a-zA-Z\d@$!%*?&]{8,}$/, 
                'Doit contenir: majuscule, minuscule, chiffre, caractère spécial'),
        email: z.string().email('Email invalide'),
        nom: z.string().min(2).max(100),
        prenom: z.string().min(2).max(100),
        telephone: z.string()
            .regex(/^\+?[1-9]\d{1,14}$/, 'Téléphone invalide')
            .optional(),
        role: z.enum(['DIRIGEANT', 'RESPONSABLE_MINISTERE', 'ASSISTANT_ADMIN', 'COMPTABLE']),
    }).strict(),

    updateUtilisateur: z.object({
        email: z.string().email().optional(),
        nom: z.string().min(2).max(100).optional(),
        prenom: z.string().min(2).max(100).optional(),
        telephone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
        role: z.enum(['DIRIGEANT', 'RESPONSABLE_MINISTERE', 'ASSISTANT_ADMIN', 'COMPTABLE']).optional(),
        actif: z.boolean().optional(),
    }).strict(),

    login: z.object({
        login: z.string().min(3),
        motDePasse: z.string().min(8),
    }).strict(),
};

// Schémas pour les dépenses
const depensesSchemas = {
    createDepense: z.object({
        description: z.string().min(5).max(500),
        montant: z.number().positive('Montant doit être positif'),
        typeDepense: z.enum(['MATERIEL', 'MAIN_OEUVRE', 'TRANSPORT', 'AUTRE']),
        projetId: z.number().int().positive(),
        siteId: z.number().int().positive().optional(),
        dateDepense: z.string().datetime().optional(),
        justificatif: z.string().url('URL invalide').optional(),
    }).strict(),

    updateDepense: z.object({
        description: z.string().min(5).max(500).optional(),
        montant: z.number().positive().optional(),
        typeDepense: z.enum(['MATERIEL', 'MAIN_OEUVRE', 'TRANSPORT', 'AUTRE']).optional(),
    }).strict(),
};

// Schémas pour les stocks
const stocksSchemas = {
    createMateriel: z.object({
        code: z.string().min(3).max(50),
        designation: z.string().min(5).max(255),
        description: z.string().min(10).max(1000).optional(),
        unite: z.enum(['PIECE', 'KG', 'LITRE', 'METRE', 'ML', 'SAC', 'CARTON', 'PALETTE']),
        prixMoyen: z.number().positive(),
        categorie: z.enum(['CIMENT', 'FER', 'BOIS', 'PEINTURE', 'ELECTRICITE', 
                           'PLOMBERIE', 'QUINCAILLERIE', 'OUTILLAGE', 'EQUIPEMENT', 'AUTRE']),
        actif: z.boolean().optional(),
    }).strict(),

    createStock: z.object({
        siteId: z.number().int().positive(),
        materielId: z.number().int().positive(),
        quantite: z.number().int().positive(),
        quantiteMin: z.number().int().nonnegative(),
        dateReception: z.string().datetime().optional(),
    }).strict(),

    addMovement: z.object({
        type: z.enum(['ENTREE', 'SORTIE', 'AJUSTEMENT', 'PERTE']),
        quantite: z.number().int().positive(),
        raison: z.string().min(5).max(500),
        reference: z.string().max(100).optional(),
    }).strict(),
};

// Schémas pour les demandes
const demandesSchemas = {
    createDemande: z.object({
        siteId: z.number().int().positive(),
        description: z.string().min(5).max(1000),
        dateRequise: z.string().datetime(),
        priorite: z.enum(['BASSE', 'NORMALE', 'HAUTE', 'URGENTE']).optional(),
    }).strict(),

    addLigneDemande: z.object({
        materielId: z.number().int().positive(),
        quantite: z.number().int().positive(),
        specification: z.string().max(500).optional(),
    }).strict(),

    validerDemande: z.object({
        action: z.enum(['VALIDER', 'REJETER']),
        commentaire: z.string().min(5).max(1000).optional(),
    }).strict(),
};

module.exports = {
    projetsSchemas,
    utilisateursSchemas,
    depensesSchemas,
    stocksSchemas,
    demandesSchemas,
};
