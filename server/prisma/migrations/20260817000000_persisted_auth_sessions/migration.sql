CREATE TYPE "AuthProvider" AS ENUM ('LOCAL', 'GOOGLE');

ALTER TABLE "User" ADD COLUMN "authProvider" "AuthProvider";
UPDATE "User" SET "authProvider" = CASE
  WHEN "passwordHash" IS NOT NULL AND "firebaseUid" IS NULL THEN 'LOCAL'::"AuthProvider"
  WHEN "passwordHash" IS NULL AND "firebaseUid" IS NOT NULL THEN 'GOOGLE'::"AuthProvider"
  ELSE NULL
END;
ALTER TABLE "User" ALTER COLUMN "authProvider" SET NOT NULL;

ALTER TABLE "PasswordTokenReset" RENAME COLUMN "token" TO "tokenHash";
ALTER TABLE "PasswordTokenReset" ADD COLUMN "usedAt" TIMESTAMP(3);

CREATE TABLE "Session" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "tokenHash" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "revokedAt" TIMESTAMP(3),
  CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "Session_tokenHash_key" ON "Session"("tokenHash");
CREATE INDEX "Session_userId_expiresAt_idx" ON "Session"("userId", "expiresAt");
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "User" ADD CONSTRAINT "User_auth_provider_identity_check" CHECK (("authProvider" = 'LOCAL' AND "passwordHash" IS NOT NULL AND "firebaseUid" IS NULL) OR ("authProvider" = 'GOOGLE' AND "passwordHash" IS NULL AND "firebaseUid" IS NOT NULL));
