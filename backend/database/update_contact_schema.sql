-- Update contact_inquiries table to support archive and reply tracking
USE `honestyWebDB`;

-- 1. Add 'archived' to status enum
ALTER TABLE `contact_inquiries` 
MODIFY `status` ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new';

-- 2. Create inquiry_replies table to track all replies
CREATE TABLE IF NOT EXISTS `inquiry_replies` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `inquiry_id` INT NOT NULL,
  `reply_message` TEXT NOT NULL,
  `sent_by` VARCHAR(255) DEFAULT 'Admin',
  `sent_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`inquiry_id`) REFERENCES `contact_inquiries`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Add index for faster lookups
CREATE INDEX idx_inquiry_status ON `contact_inquiries`(`status`);
CREATE INDEX idx_inquiry_created ON `contact_inquiries`(`created_at` DESC);
CREATE INDEX idx_reply_inquiry ON `inquiry_replies`(`inquiry_id`);
