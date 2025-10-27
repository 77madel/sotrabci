-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DIRIGEANT', 'RESPONSABLE');

-- CreateEnum
CREATE TYPE "StatutProjet" AS ENUM ('ACTIF', 'TERMINE', 'SUSPENDU');

-- CreateEnum
CREATE TYPE "StatutBudget" AS ENUM ('ACTIF', 'EPUISE', 'CLOTURE');

-- CreateEnum
CREATE TYPE "StatutBesoin" AS ENUM ('EN_ATTENTE', 'VALIDE', 'REFUSE');

-- CreateEnum
CREATE TYPE "StatutDepense" AS ENUM ('VALIDEE', 'EN_ATTENTE', 'REFUSEE');

-- CreateEnum
CREATE TYPE "TypeDepense" AS ENUM ('SALAIRE', 'MATERIEL', 'SERVICE', 'FRAIS');

-- CreateEnum
CREATE TYPE "TypeMouvement" AS ENUM ('ALLOCATION', 'DEPENSE', 'APPROVISIONNEMENT');

-- CreateEnum
CREATE TYPE "StatutSalarie" AS ENUM ('ACTIF', 'INACTIF', 'CONGE');

-- CreateTable
CREATE TABLE "utilisateurs" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'RESPONSABLE',
    "motDePasse" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caisse_generale" (
    "id" TEXT NOT NULL,
    "soldeInitial" DOUBLE PRECISION NOT NULL,
    "soldeActuel" DOUBLE PRECISION NOT NULL,
    "devise" TEXT NOT NULL DEFAULT 'EUR',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "caisse_generale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sites" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "adresse" TEXT NOT NULL,
    "responsableSite" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projets" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "ministere" TEXT NOT NULL,
    "responsableId" TEXT NOT NULL,
    "siteId" TEXT,
    "dateDebut" TIMESTAMP(3) NOT NULL,
    "dateFin" TIMESTAMP(3),
    "statut" "StatutProjet" NOT NULL DEFAULT 'ACTIF',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "projets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "budgets" (
    "id" TEXT NOT NULL,
    "montantAlloue" DOUBLE PRECISION NOT NULL,
    "montantDepense" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "montantRestant" DOUBLE PRECISION DEFAULT 0,
    "dateAllocation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" "StatutBudget" NOT NULL DEFAULT 'ACTIF',
    "projetId" TEXT NOT NULL,
    "caisseId" TEXT NOT NULL,

    CONSTRAINT "budgets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "besoins" (
    "id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "montantEstime" DOUBLE PRECISION NOT NULL,
    "statut" "StatutBesoin" NOT NULL DEFAULT 'EN_ATTENTE',
    "dateSoumission" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dateValidation" TIMESTAMP(3),
    "projetId" TEXT NOT NULL,
    "siteId" TEXT,

    CONSTRAINT "besoins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "depenses" (
    "id" TEXT NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "typeDepense" "TypeDepense" NOT NULL,
    "beneficiaire" TEXT NOT NULL,
    "dateDepense" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "justificatif" TEXT,
    "statut" "StatutDepense" NOT NULL DEFAULT 'VALIDEE',
    "besoinId" TEXT,
    "projetId" TEXT NOT NULL,
    "caisseId" TEXT NOT NULL,

    CONSTRAINT "depenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mouvements_caisse" (
    "id" TEXT NOT NULL,
    "typeMouvement" "TypeMouvement" NOT NULL,
    "montant" DOUBLE PRECISION NOT NULL,
    "reference" TEXT,
    "description" TEXT,
    "dateMouvement" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "caisseId" TEXT NOT NULL,
    "utilisateurId" TEXT NOT NULL,

    CONSTRAINT "mouvements_caisse_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "salaries" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "poste" TEXT NOT NULL,
    "salaireBase" DOUBLE PRECISION NOT NULL,
    "statut" "StatutSalarie" NOT NULL DEFAULT 'ACTIF',
    "dateEmbauche" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "affectations_salaries" (
    "id" TEXT NOT NULL,
    "salarieId" TEXT NOT NULL,
    "projetId" TEXT NOT NULL,
    "dateAffectation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "affectations_salaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BudgetToDepense" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BudgetToDepense_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "_BudgetToDepense_B_index" ON "_BudgetToDepense"("B");

-- AddForeignKey
ALTER TABLE "sites" ADD CONSTRAINT "sites_responsableSite_fkey" FOREIGN KEY ("responsableSite") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_responsableId_fkey" FOREIGN KEY ("responsableId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "projets" ADD CONSTRAINT "projets_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "budgets" ADD CONSTRAINT "budgets_caisseId_fkey" FOREIGN KEY ("caisseId") REFERENCES "caisse_generale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "besoins" ADD CONSTRAINT "besoins_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "besoins" ADD CONSTRAINT "besoins_siteId_fkey" FOREIGN KEY ("siteId") REFERENCES "sites"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_besoinId_fkey" FOREIGN KEY ("besoinId") REFERENCES "besoins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "depenses" ADD CONSTRAINT "depenses_caisseId_fkey" FOREIGN KEY ("caisseId") REFERENCES "caisse_generale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_caisseId_fkey" FOREIGN KEY ("caisseId") REFERENCES "caisse_generale"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "mouvements_caisse" ADD CONSTRAINT "mouvements_caisse_utilisateurId_fkey" FOREIGN KEY ("utilisateurId") REFERENCES "utilisateurs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affectations_salaries" ADD CONSTRAINT "affectations_salaries_salarieId_fkey" FOREIGN KEY ("salarieId") REFERENCES "salaries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "affectations_salaries" ADD CONSTRAINT "affectations_salaries_projetId_fkey" FOREIGN KEY ("projetId") REFERENCES "projets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToDepense" ADD CONSTRAINT "_BudgetToDepense_A_fkey" FOREIGN KEY ("A") REFERENCES "budgets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BudgetToDepense" ADD CONSTRAINT "_BudgetToDepense_B_fkey" FOREIGN KEY ("B") REFERENCES "depenses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
