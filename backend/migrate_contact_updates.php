<?php
/**
 * Database Migration Script
 * Run this file once to update the contact_inquiries table and create inquiry_replies table
 */

define('DB_CONFIG_ACCESS', true);
require_once __DIR__ . '/database/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "Starting database migration...\n\n";
    
    // 1. Update contact_inquiries enum to add 'archived'
    echo "1. Updating contact_inquiries status enum...\n";
    $pdo->exec("ALTER TABLE contact_inquiries MODIFY status ENUM('new', 'read', 'replied', 'archived') DEFAULT 'new'");
    echo "   ✓ Status enum updated\n\n";
    
    // 2. Create inquiry_replies table
    echo "2. Creating inquiry_replies table...\n";
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS inquiry_replies (
            id INT PRIMARY KEY AUTO_INCREMENT,
            inquiry_id INT NOT NULL,
            reply_message TEXT NOT NULL,
            sent_by VARCHAR(255) DEFAULT 'Admin',
            sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (inquiry_id) REFERENCES contact_inquiries(id) ON DELETE CASCADE
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    echo "   ✓ inquiry_replies table created\n\n";
    
    // 3. Create indexes
    echo "3. Creating indexes for better performance...\n";
    
    // Check if index exists before creating
    $stmt = $pdo->query("SHOW INDEX FROM contact_inquiries WHERE Key_name = 'idx_inquiry_status'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("CREATE INDEX idx_inquiry_status ON contact_inquiries(status)");
        echo "   ✓ idx_inquiry_status created\n";
    } else {
        echo "   - idx_inquiry_status already exists\n";
    }
    
    $stmt = $pdo->query("SHOW INDEX FROM contact_inquiries WHERE Key_name = 'idx_inquiry_created'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("CREATE INDEX idx_inquiry_created ON contact_inquiries(created_at)");
        echo "   ✓ idx_inquiry_created created\n";
    } else {
        echo "   - idx_inquiry_created already exists\n";
    }
    
    $stmt = $pdo->query("SHOW INDEX FROM inquiry_replies WHERE Key_name = 'idx_reply_inquiry'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("CREATE INDEX idx_reply_inquiry ON inquiry_replies(inquiry_id)");
        echo "   ✓ idx_reply_inquiry created\n";
    } else {
        echo "   - idx_reply_inquiry already exists\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "\nYou can now:\n";
    echo "- Archive inquiries with 'archived' status\n";
    echo "- View reply history for each inquiry\n";
    echo "- Track who replied and when\n";
    
} catch (PDOException $e) {
    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
