/*
  Warnings:

  - A unique constraint covering the columns `[buss_reg_number]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[corp_reg_number]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `companies` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `buss_reg_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_name` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `contact_phone` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `corp_reg_number` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `est_date` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pres_name` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `companies` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `companies` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `companies` ADD COLUMN `buss_reg_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `contact_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `contact_phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `corp_reg_number` VARCHAR(191) NOT NULL,
    ADD COLUMN `est_date` DATETIME(3) NOT NULL,
    ADD COLUMN `phone` VARCHAR(191) NOT NULL,
    ADD COLUMN `pres_name` VARCHAR(191) NOT NULL,
    ADD COLUMN `type` ENUM('CORPORATION', 'INDIVIDUAL', 'OTHER') NOT NULL,
    MODIFY `email` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `companies_buss_reg_number_key` ON `companies`(`buss_reg_number`);

-- CreateIndex
CREATE UNIQUE INDEX `companies_corp_reg_number_key` ON `companies`(`corp_reg_number`);

-- CreateIndex
CREATE UNIQUE INDEX `companies_email_key` ON `companies`(`email`);
