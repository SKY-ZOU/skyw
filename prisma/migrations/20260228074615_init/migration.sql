-- CreateTable
CREATE TABLE "Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyName" TEXT NOT NULL DEFAULT 'SKYW Group',
    "companyFull" TEXT NOT NULL DEFAULT 'Skyward Holding Group',
    "email" TEXT NOT NULL DEFAULT 'info@skywgroup.com',
    "phone" TEXT NOT NULL DEFAULT '+852 2888 8888'
);

-- CreateTable
CREATE TABLE "Metric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "valueZhCN" TEXT NOT NULL,
    "valueZhTW" TEXT NOT NULL,
    "valueEn" TEXT NOT NULL,
    "labelZhCN" TEXT NOT NULL,
    "labelZhTW" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Office" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "nameZhCN" TEXT NOT NULL,
    "nameZhTW" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "typeZhCN" TEXT NOT NULL,
    "typeZhTW" TEXT NOT NULL,
    "typeEn" TEXT NOT NULL,
    "addressZhCN" TEXT NOT NULL DEFAULT '',
    "addressZhTW" TEXT NOT NULL DEFAULT '',
    "addressEn" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "BusinessDivision" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "divisionId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "titleZhCN" TEXT NOT NULL,
    "titleZhTW" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "shortDescZhCN" TEXT NOT NULL,
    "shortDescZhTW" TEXT NOT NULL,
    "shortDescEn" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "date" TEXT NOT NULL,
    "titleZhCN" TEXT NOT NULL,
    "titleZhTW" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "excerptZhCN" TEXT NOT NULL,
    "excerptZhTW" TEXT NOT NULL,
    "excerptEn" TEXT NOT NULL,
    "contentZhCN" TEXT NOT NULL,
    "contentZhTW" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Office_slug_key" ON "Office"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDivision_divisionId_key" ON "BusinessDivision"("divisionId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessDivision_slug_key" ON "BusinessDivision"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
