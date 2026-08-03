-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pack" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "projectId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "packJson" TEXT NOT NULL,
    "catalogVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "schemaVersion" TEXT NOT NULL DEFAULT '1.0.0',
    "compilerModel" TEXT NOT NULL,
    "compilerProvider" TEXT NOT NULL,
    "polishModel" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "latencyMs" INTEGER NOT NULL,
    "tokenCostEstimate" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareSlug" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Pack_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Pack" ("attempts", "catalogVersion", "compilerModel", "compilerProvider", "createdAt", "id", "latencyMs", "packJson", "polishModel", "projectId", "schemaVersion", "tokenCostEstimate", "version") SELECT "attempts", "catalogVersion", "compilerModel", "compilerProvider", "createdAt", "id", "latencyMs", "packJson", "polishModel", "projectId", "schemaVersion", "tokenCostEstimate", "version" FROM "Pack";
DROP TABLE "Pack";
ALTER TABLE "new_Pack" RENAME TO "Pack";
CREATE UNIQUE INDEX "Pack_shareSlug_key" ON "Pack"("shareSlug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
