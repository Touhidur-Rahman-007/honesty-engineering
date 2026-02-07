<?php
/**
 * Database Migration Script
 * Add attachment support to inquiry_replies table
 */

define('DB_CONFIG_ACCESS', true);
require_once __DIR__ . '/database/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "Starting database migration for reply attachments...\n\n";
    
    // 1. Add attachment_path column to inquiry_replies table
    echo "1. Adding attachment_path column to inquiry_replies table...\n";
    
    // Check if column already exists
    $stmt = $pdo->query("SHOW COLUMNS FROM inquiry_replies LIKE 'attachment_path'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("ALTER TABLE inquiry_replies ADD COLUMN attachment_path VARCHAR(255) NULL AFTER reply_message");
        echo "   ✓ attachment_path column added\n";
    } else {
        echo "   - attachment_path column already exists\n";
    }
    
    // 2. Add attachment_filename column to store original filename
    echo "\n2. Adding attachment_filename column to inquiry_replies table...\n";
    
    $stmt = $pdo->query("SHOW COLUMNS FROM inquiry_replies LIKE 'attachment_filename'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("ALTER TABLE inquiry_replies ADD COLUMN attachment_filename VARCHAR(255) NULL AFTER attachment_path");
        echo "   ✓ attachment_filename column added\n";
    } else {
        echo "   - attachment_filename column already exists\n";
    }
    
    // 3. Add attachment_size column
    echo "\n3. Adding attachment_size column to inquiry_replies table...\n";
    
    $stmt = $pdo->query("SHOW COLUMNS FROM inquiry_replies LIKE 'attachment_size'");
    if ($stmt->rowCount() === 0) {
        $pdo->exec("ALTER TABLE inquiry_replies ADD COLUMN attachment_size INT NULL AFTER attachment_filename");
        echo "   ✓ attachment_size column added\n";
    } else {
        echo "   - attachment_size column already exists\n";
    }
    
    echo "\n✅ Migration completed successfully!\n";
    echo "\nYou can now:\n";
    echo "- Send replies with attachments (up to 10MB)\n";
    echo "- View attachment details in reply history\n";
    echo "- Download attachments from admin panel\n";
    
} catch (PDOException $e) {
    echo "\n❌ Migration failed: " . $e->getMessage() . "\n";
    exit(1);
}
