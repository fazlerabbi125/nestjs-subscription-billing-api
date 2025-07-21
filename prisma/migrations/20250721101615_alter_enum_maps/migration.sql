/*
  Warnings:

  - The values [monthly,yearly] on the enum `BillingCycle` will be removed. If these variants are still used in the database, this will fail.
  - The values [pending,completed,failed,refunded] on the enum `PaymentStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [user,admin] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "BillingCycle_new" AS ENUM ('MONTHLY', 'YEARLY');
ALTER TABLE "Plan" ALTER COLUMN "billingCycle" TYPE "BillingCycle_new" USING ("billingCycle"::text::"BillingCycle_new");
ALTER TYPE "BillingCycle" RENAME TO "BillingCycle_old";
ALTER TYPE "BillingCycle_new" RENAME TO "BillingCycle";
DROP TYPE "BillingCycle_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentStatus_new" AS ENUM ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED');
ALTER TABLE "Payment" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Payment" ALTER COLUMN "status" TYPE "PaymentStatus_new" USING ("status"::text::"PaymentStatus_new");
ALTER TYPE "PaymentStatus" RENAME TO "PaymentStatus_old";
ALTER TYPE "PaymentStatus_new" RENAME TO "PaymentStatus";
DROP TYPE "PaymentStatus_old";
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Role_new" AS ENUM ('USER', 'ADMIN');
ALTER TABLE "User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "User" ALTER COLUMN "role" TYPE "Role_new" USING ("role"::text::"Role_new");
ALTER TYPE "Role" RENAME TO "Role_old";
ALTER TYPE "Role_new" RENAME TO "Role";
DROP TYPE "Role_old";
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "status" SET DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'USER';
