-- CreateTable
CREATE TABLE "ContactSubmission" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL DEFAULT '',
    "subject" TEXT NOT NULL DEFAULT '',
    "message" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Article" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "date" TEXT NOT NULL,
    "coverImage" TEXT NOT NULL DEFAULT '',
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
INSERT INTO "new_Article" ("category", "contentEn", "contentZhCN", "contentZhTW", "createdAt", "date", "excerptEn", "excerptZhCN", "excerptZhTW", "id", "published", "slug", "titleEn", "titleZhCN", "titleZhTW", "updatedAt") SELECT "category", "contentEn", "contentZhCN", "contentZhTW", "createdAt", "date", "excerptEn", "excerptZhCN", "excerptZhTW", "id", "published", "slug", "titleEn", "titleZhCN", "titleZhTW", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE TABLE "new_BusinessDivision" (
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
    "shortDescEn" TEXT NOT NULL,
    "bodyZhCN" TEXT NOT NULL DEFAULT '',
    "bodyZhTW" TEXT NOT NULL DEFAULT '',
    "bodyEn" TEXT NOT NULL DEFAULT '',
    "coverImage" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_BusinessDivision" ("divisionId", "icon", "id", "shortDescEn", "shortDescZhCN", "shortDescZhTW", "slug", "sortOrder", "titleEn", "titleZhCN", "titleZhTW") SELECT "divisionId", "icon", "id", "shortDescEn", "shortDescZhCN", "shortDescZhTW", "slug", "sortOrder", "titleEn", "titleZhCN", "titleZhTW" FROM "BusinessDivision";
DROP TABLE "BusinessDivision";
ALTER TABLE "new_BusinessDivision" RENAME TO "BusinessDivision";
CREATE UNIQUE INDEX "BusinessDivision_divisionId_key" ON "BusinessDivision"("divisionId");
CREATE UNIQUE INDEX "BusinessDivision_slug_key" ON "BusinessDivision"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
