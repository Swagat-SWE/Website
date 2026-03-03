-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'STAFF');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER';
