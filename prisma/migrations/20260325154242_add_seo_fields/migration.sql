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
    "keywords" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Article" ("category", "contentEn", "contentZhCN", "contentZhTW", "coverImage", "createdAt", "date", "excerptEn", "excerptZhCN", "excerptZhTW", "id", "published", "slug", "titleEn", "titleZhCN", "titleZhTW", "updatedAt") SELECT "category", "contentEn", "contentZhCN", "contentZhTW", "coverImage", "createdAt", "date", "excerptEn", "excerptZhCN", "excerptZhTW", "id", "published", "slug", "titleEn", "titleZhCN", "titleZhTW", "updatedAt" FROM "Article";
DROP TABLE "Article";
ALTER TABLE "new_Article" RENAME TO "Article";
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyName" TEXT NOT NULL DEFAULT 'SKYW Group',
    "companyFull" TEXT NOT NULL DEFAULT 'Skyward Holding Group',
    "email" TEXT NOT NULL DEFAULT 'info@skywgroup.com',
    "phone" TEXT NOT NULL DEFAULT '+852 2888 8888',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "wechatId" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Setting" ("companyFull", "companyName", "email", "id", "phone") SELECT "companyFull", "companyName", "email", "id", "phone" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
