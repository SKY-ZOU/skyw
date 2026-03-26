-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "companyName" TEXT NOT NULL DEFAULT 'SKYW Group',
    "companyFull" TEXT NOT NULL DEFAULT 'Skyward Holding Group',
    "email" TEXT NOT NULL DEFAULT 'info@skywgroup.com',
    "phone" TEXT NOT NULL DEFAULT '+852 2888 8888',
    "ogImage" TEXT NOT NULL DEFAULT '',
    "linkedinUrl" TEXT NOT NULL DEFAULT '',
    "wechatId" TEXT NOT NULL DEFAULT '',
    "twitterUrl" TEXT NOT NULL DEFAULT '',
    "geoAllowBots" TEXT NOT NULL DEFAULT 'GPTBot,ClaudeBot,PerplexityBot,Google-Extended,YouBot',
    "geoOrgDesc" TEXT NOT NULL DEFAULT '',
    "geoOrgFounded" TEXT NOT NULL DEFAULT '',
    "geoOrgIndustry" TEXT NOT NULL DEFAULT '',
    "faqJson" TEXT NOT NULL DEFAULT '[]',
    "llmsCustom" TEXT NOT NULL DEFAULT ''
);
INSERT INTO "new_Setting" ("companyFull", "companyName", "email", "id", "linkedinUrl", "ogImage", "phone", "twitterUrl", "wechatId") SELECT "companyFull", "companyName", "email", "id", "linkedinUrl", "ogImage", "phone", "twitterUrl", "wechatId" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
