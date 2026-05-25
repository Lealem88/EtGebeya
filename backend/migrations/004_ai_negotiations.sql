-- migrations/004_ai_negotiations.sql
-- Run this in phpMyAdmin or via MySQL CLI

CREATE TABLE IF NOT EXISTS `negotiations` (
  `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  `product_id`    INT UNSIGNED NOT NULL,
  `buyer_id`      INT UNSIGNED NOT NULL,
  `offer_price`   DECIMAL(12,2) NOT NULL,
  `counter_price` DECIMAL(12,2) NULL,
  `verdict`       ENUM('accepted','pre_approved','counter','rejected','error') NOT NULL DEFAULT 'counter',
  `created_at`    DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY `uniq_product_buyer` (`product_id`,`buyer_id`),
  INDEX `idx_product` (`product_id`),
  INDEX `idx_buyer` (`buyer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Also ensure the search_analytics table has the right columns
ALTER TABLE `search_analytics` 
  MODIFY COLUMN `searched_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Add trustScore to users if it doesn't exist yet
ALTER TABLE `users` 
  ADD COLUMN IF NOT EXISTS `trustScore` INT NOT NULL DEFAULT 50;

-- Ensure ai_product_analysis has market data columns
ALTER TABLE `ai_product_analysis`
  ADD COLUMN IF NOT EXISTS `market_low`   DECIMAL(12,2) NULL AFTER `flags`,
  ADD COLUMN IF NOT EXISTS `market_high`  DECIMAL(12,2) NULL AFTER `market_low`,
  ADD COLUMN IF NOT EXISTS `market_avg`   DECIMAL(12,2) NULL AFTER `market_high`;
