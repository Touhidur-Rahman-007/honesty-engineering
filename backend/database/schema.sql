-- ============================================
-- Honesty Engineering Website Database Schema
-- Simple Portfolio Website Database
-- Created: 2026-02-04
-- ============================================

-- Create database
CREATE DATABASE IF NOT EXISTS `honestyWebDB` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `honestyWebDB`;
-- ============================================
-- 1. SITE CONFIGURATION
-- ============================================
CREATE TABLE `site_config` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `site_name` VARCHAR(255) NOT NULL DEFAULT 'Honesty Engineering',
  `tagline` VARCHAR(255),
  `email` VARCHAR(255),
  `phone` VARCHAR(50),
  `address` TEXT,
  `trade_license` VARCHAR(100),
  `trade_license_file` VARCHAR(255),
  `tin` VARCHAR(100),
  `tin_file` VARCHAR(255),
  `bepza_license` VARCHAR(100),
  `bepza_license_file` VARCHAR(255),
  `founding_year` INT,
  `logo` VARCHAR(255),
  `social_facebook` VARCHAR(255),
  `social_linkedin` VARCHAR(255),
  `social_whatsapp` VARCHAR(255),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 2. HERO SECTION
-- ============================================
CREATE TABLE `hero_section` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `subtitle` TEXT,
  `cta_text` VARCHAR(100),
  `cta_link` VARCHAR(255),
  `background_image` VARCHAR(255),
  `is_active` BOOLEAN DEFAULT 1,
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `hero_stats` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `label` VARCHAR(100) NOT NULL,
  `value` VARCHAR(50) NOT NULL,
  `icon` VARCHAR(50),
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 3. ABOUT SECTION
-- ============================================
CREATE TABLE `about_section` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image` VARCHAR(255),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `about_features` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100),
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 4. CEO MESSAGE
-- ============================================
CREATE TABLE `ceo_info` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255),
  `message` TEXT,
  `photo` VARCHAR(255),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 5. SERVICES
-- ============================================
CREATE TABLE `service_categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `icon` VARCHAR(100),
  `color` VARCHAR(50),
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `icon` VARCHAR(100),
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`category_id`) REFERENCES `service_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 6. PRODUCTS
-- ============================================
CREATE TABLE `product_categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_id` INT NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`category_id`) REFERENCES `product_categories`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 7. PROJECTS / SUCCESS STORIES
-- ============================================
CREATE TABLE `projects` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `client_name` VARCHAR(255),
  `project_type` VARCHAR(100),
  `featured_image` VARCHAR(255),
  `is_featured` BOOLEAN DEFAULT 0,
  `completed_date` DATE,
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `project_images` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `project_id` INT NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `caption` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 8. CLIENTS
-- ============================================
CREATE TABLE `clients` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `logo` VARCHAR(255),
  `website` VARCHAR(255),
  `display_order` INT DEFAULT 0,
  `is_active` BOOLEAN DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 9. GALLERY
-- ============================================
CREATE TABLE `gallery_categories` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `slug` VARCHAR(255) UNIQUE NOT NULL,
  `display_order` INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `gallery` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `category_id` INT,
  `title` VARCHAR(255) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(255) NOT NULL,
  `is_featured` BOOLEAN DEFAULT 0,
  `display_order` INT DEFAULT 0,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`category_id`) REFERENCES `gallery_categories`(`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 10. CONTACT INQUIRIES
-- ============================================
CREATE TABLE `contact_inquiries` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(50),
  `subject` VARCHAR(255),
  `message` TEXT NOT NULL,
  `status` ENUM('new', 'read', 'replied') DEFAULT 'new',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- 11. ADMIN USERS
-- ============================================
CREATE TABLE `admin_users` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(100) UNIQUE NOT NULL,
  `email` VARCHAR(255) UNIQUE NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255),
  `role` ENUM('admin', 'editor') DEFAULT 'editor',
  `is_active` BOOLEAN DEFAULT 1,
  `last_login` TIMESTAMP NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default site config
INSERT INTO `site_config` (`site_name`, `tagline`, `email`, `phone`, `address`, `trade_license`, `tin`, `bepza_license`, `founding_year`) VALUES
('Honesty Engineering', 'Building Excellence Since 2002', 'info@honestyengineeringbd.com', '+880 1234-567890', 
'Sector-8, Road-2, Uttara, Dhaka-1230, Bangladesh', 'TRAD/DSCC/123456', '123456789012', 'BEPZA/12345/2002', 2002);

-- Insert hero stats
INSERT INTO `hero_stats` (`label`, `value`, `icon`, `display_order`) VALUES
('Years Experience', '22+', '📅', 1),
('Projects Completed', '250+', '✅', 2),
('Happy Clients', '150+', '😊', 3),
('Team Members', '50+', '👥', 4);

-- Insert service categories
INSERT INTO `service_categories` (`name`, `slug`, `icon`, `color`, `display_order`) VALUES
('Electrical Works', 'electrical', '⚡', 'yellow', 1),
('Civil Construction', 'civil', '🏗️', 'blue', 2),
('Interior Design', 'interior', '🎨', 'purple', 3),
('Fire & Safety', 'fire-safety', '🔥', 'red', 4),
('Software Solutions', 'software', '💻', 'green', 5);

-- Insert product categories
INSERT INTO `product_categories` (`name`, `slug`, `display_order`) VALUES
('Equipment', 'equipment', 1),
('Electrical', 'electrical', 2),
('Pumps', 'pumps', 3),
('Power', 'power', 4),
('Safety', 'safety', 5);

-- Insert gallery categories
INSERT INTO `gallery_categories` (`name`, `slug`, `display_order`) VALUES
('Construction', 'construction', 1),
('Interior', 'interior', 2),
('Electrical', 'electrical', 3),
('Safety', 'safety', 4),
('Planning', 'planning', 5);

-- Create default admin user (password: admin123)
INSERT INTO `admin_users` (`username`, `email`, `password_hash`, `full_name`, `role`) VALUES
('admin', 'info@honestyengineeringbd.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin User', 'admin');

-- ============================================
-- INDEXES FOR BETTER PERFORMANCE
-- ============================================
CREATE INDEX idx_services_category ON services(category_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_gallery_category ON gallery(category_id);
CREATE INDEX idx_contact_status ON contact_inquiries(status);
CREATE INDEX idx_contact_created ON contact_inquiries(created_at);
