/*
  Warnings:

  - The primary key for the `admins` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `status` on the `companies` table. All the data in the column will be lost.
  - The primary key for the `members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `contact` to the `members` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `members` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `admins` DROP PRIMARY KEY;

-- AlterTable
ALTER TABLE `companies` DROP COLUMN `status`;

-- AlterTable
ALTER TABLE `members` DROP PRIMARY KEY,
    ADD COLUMN `contact` VARCHAR(191) NOT NULL,
    ADD COLUMN `level` ENUM('PLATINUM', 'GOLD', 'SIVER', 'TWO', 'THREE') NOT NULL;

-- CreateTable
CREATE TABLE `otp_providers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_id` INTEGER NOT NULL,
    `updated_at` DATETIME(3) NULL,
    `phone_number` VARCHAR(191) NULL,
    `otp_code` VARCHAR(191) NULL,

    UNIQUE INDEX `otp_providers_account_id_key`(`account_id`),
    UNIQUE INDEX `otp_providers_phone_number_key`(`phone_number`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('PDF', 'ZIP', 'RAR', 'JPEG', 'PNG', 'CSV', 'EXCEL', 'WORD') NOT NULL,
    `key` VARCHAR(191) NULL,
    `file_name` VARCHAR(191) NULL,
    `size` BIGINT NOT NULL,
    `is_deactivated` BOOLEAN NOT NULL DEFAULT false,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `otp_providers` ADD CONSTRAINT `otp_providers_account_id_fkey` FOREIGN KEY (`account_id`) REFERENCES `accounts`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
