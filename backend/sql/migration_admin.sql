-- ================================================================
-- EtGebeya DB Migration: Add admin, status, and isAdmin columns
-- Run this in phpMyAdmin or MySQL CLI after your existing schema
-- ================================================================

USE electromart_db;

-- 1. Add isAdmin field to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS isAdmin BOOLEAN DEFAULT FALSE AFTER isBanned;

-- 2. Add status column to products table for approval workflow
--    Values: 'pending', 'active', 'rejected'
ALTER TABLE products ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active' AFTER isFeatured;

-- 3. Make all existing products 'active' (already approved before this feature)
UPDATE products SET status = 'active' WHERE status IS NULL OR status = '';

-- 4. Set a specific user as admin (replace the email below with yours)
-- UPDATE users SET isAdmin = 1 WHERE email = 'admin@etgebeya.com';

-- 5. Create an admin user if one doesn't exist yet
--    Password below is bcrypt hash of "Admin@1234" — change before production!
INSERT IGNORE INTO users (name, email, password, phone, location, joinDate, isAdmin, isVerified)
VALUES (
    'EtGebeya Admin',
    'admin@etgebeya.com',
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: "password"
    '+251911000000',
    'Addis Ababa, Ethiopia',
    CURDATE(),
    1,
    1
);
