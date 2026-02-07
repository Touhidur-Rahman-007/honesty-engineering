<?php
/**
 * Migration Script: Update image paths from /assets/images/ to /uploads/
 * Run this once to fix all image paths in the database
 */

require_once __DIR__ . '/database/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed\n");
}

try {
    echo "Starting image path migration...\n\n";
    
    // Tables to update with their image columns
    $tables = [
        'gallery' => ['image_url'],
        'products' => ['image'],
        'services' => ['image'],
        'projects' => ['featured_image', 'gallery_images'],
        'hero_slides' => ['image_url'],
        'about' => ['ceo_image', 'team_image'],
        'clients' => ['logo_url']
    ];
    
    $totalUpdated = 0;
    
    foreach ($tables as $table => $columns) {
        // Check if table exists
        try {
            $tableCheckQuery = "SHOW TABLES LIKE '{$table}'";
            $tableResult = $db->query($tableCheckQuery);
            if ($tableResult->rowCount() == 0) {
                echo "⚠️  Table {$table} does not exist - skipping\n";
                continue;
            }
        } catch (Exception $e) {
            echo "⚠️  Table {$table} does not exist - skipping\n";
            continue;
        }
        
        foreach ($columns as $column) {
            // Check if column exists
            try {
                $checkQuery = "SHOW COLUMNS FROM `{$table}` LIKE '{$column}'";
                $result = $db->query($checkQuery);
                
                if ($result->rowCount() == 0) {
                    echo "⚠️  Column {$table}.{$column} does not exist - skipping\n";
                    continue;
                }
            } catch (Exception $e) {
                echo "⚠️  Column {$table}.{$column} does not exist - skipping\n";
                continue;
            }
            
            // Update paths
            $updateQuery = "
                UPDATE `{$table}` 
                SET `{$column}` = REPLACE(`{$column}`, '/assets/images/', '/honesty-engineering/uploads/')
                WHERE `{$column}` LIKE '/assets/images/%'
            ";
            
            $stmt = $db->prepare($updateQuery);
            $stmt->execute();
            $updated = $stmt->rowCount();
            
            if ($updated > 0) {
                echo "✅ Updated {$updated} rows in {$table}.{$column}\n";
                $totalUpdated += $updated;
            } else {
                echo "   No updates needed for {$table}.{$column}\n";
            }
        }
    }
    
    echo "\n✅ Migration completed! Total rows updated: {$totalUpdated}\n";
    
    // Show sample of updated records
    echo "\nSample of updated gallery images:\n";
    $sampleQuery = "SELECT id, title, image_url FROM gallery LIMIT 5";
    $samples = $db->query($sampleQuery);
    foreach ($samples as $sample) {
        echo "  - [{$sample['id']}] {$sample['title']}: {$sample['image_url']}\n";
    }
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
