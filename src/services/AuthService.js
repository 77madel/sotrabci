/*const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const jwtConfig = require('../config/jwt');

class AuthService {
    async register(userData) {
        const { nom, email, motDePasse, role } = userData;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 12);

        const user = await prisma.utilisateur.create({
            data: {
                nom,
                email,
                motDePasse: hashedPassword,
                role
            },
            select: { id: true, nom: true, email: true, role: true }
        });

        return user;
    }
    

    // async login(email, motDePasse) {
    //     const user = await prisma.utilisateur.findUnique({
    //         where: { email }
    //     });

    //     if (!user) {
    //         throw new Error('Utilisateur non trouvé');
    //     }

    //     const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);

    //     if (!isValidPassword) {
    //         throw new Error('Mot de passe incorrect');
    //     }

    //     const token = jwt.sign(
    //         { userId: user.id, email: user.email, role: user.role },
    //         process.env.JWT_SECRET,
    //         { expiresIn: process.env.JWT_EXPIRES_IN }
    //     );

    //     return {
    //         token,
    //         user: {
    //             id: user.id,
    //             nom: user.nom,
    //             email: user.email,
    //             role: user.role
    //         }
    //     };
    // }
    async login(email, motDePasse) {
    const user = await prisma.utilisateur.findUnique({
        where: { email }
    });

<<<<<<< Updated upstream
        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role, nom: user.nom },
            jwtConfig.secret,
            { expiresIn: jwtConfig.expiresIn }
        );

        return {
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        };
=======
    if (!user) {
        throw new Error('Utilisateur non trouvé');
>>>>>>> Stashed changes
    }

    const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);

    if (!isValidPassword) {
        throw new Error('Mot de passe incorrect');
    }

    // ✅ Ajout de la valeur par défaut ici
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn }
    );

    return {
        token,
        user: {
            id: user.id,
            nom: user.nom,
            email: user.email,
            role: user.role
        }
    };
}
}

module.exports = new AuthService();*/



const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/database');
const jwtConfig = require('../config/jwt');

class AuthService {
    async register(userData) {
        const { nom, email, motDePasse, role } = userData;

        const existingUser = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (existingUser) {
            throw new Error('Un utilisateur avec cet email existe déjà');
        }

        const hashedPassword = await bcrypt.hash(motDePasse, 12);

        const user = await prisma.utilisateur.create({
            data: {
                nom,
                email,
                motDePasse: hashedPassword,
                role
            },
            select: { id: true, nom: true, email: true, role: true }
        });

        return user;
    }

    async login(email, motDePasse) {
        const user = await prisma.utilisateur.findUnique({
            where: { email }
        });

        if (!user) {
            throw new Error('Utilisateur non trouvé');
        }

        const isValidPassword = await bcrypt.compare(motDePasse, user.motDePasse);

        if (!isValidPassword) {
            throw new Error('Mot de passe incorrect');
        }

        // ✅ Solution fusionnée - Meilleure compatibilité
        const secret = jwtConfig?.secret || process.env.JWT_SECRET;
        const expiresIn = jwtConfig?.expiresIn || process.env.JWT_EXPIRES_IN || '1h';

        const token = jwt.sign(
            { 
                id: user.id,
                userId: user.id, // Double clé pour compatibilité
                email: user.email, 
                role: user.role, 
                nom: user.nom 
            },
            secret,
            { expiresIn }
        );

        return {
            token,
            user: {
                id: user.id,
                nom: user.nom,
                email: user.email,
                role: user.role
            }
        };
    }
}

module.exports = new AuthService();