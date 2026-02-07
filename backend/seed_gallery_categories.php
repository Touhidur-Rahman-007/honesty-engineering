<?php
/**
 * Seed Gallery Categories
 * Run this file once to populate gallery categories
 */

define('DB_CONFIG_ACCESS', true);
require_once __DIR__ . '/database/Database.php';

try {
    $database = new Database();
    $pdo = $database->getConnection();
    
    echo "Starting gallery categories seeding...\n\n";
    
    // Check if categories already exist
    $stmt = $pdo->query("SELECT COUNT(*) as count FROM gallery_categories");
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $existingCount = $result['count'];
    
    if ($existingCount > 0) {
        echo "Gallery categories already exist ($existingCount categories found).\n";
        echo "Skipping seeding to avoid duplicates.\n\n";
        
        // Show existing categories
        $stmt = $pdo->query("SELECT name, slug FROM gallery_categories ORDER BY display_order");
        $categories = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo "Existing categories:\n";
        foreach ($categories as $cat) {
            echo "  - {$cat['name']} ({$cat['slug']})\n";
        }
        
        exit(0);
    }
    
    echo "Inserting gallery categories...\n";
    
    $categories = [
        ['name' => 'Construction', 'slug' => 'construction', 'display_order' => 1],
        ['name' => 'Interior', 'slug' => 'interior', 'display_order' => 2],
        ['name' => 'Electrical', 'slug' => 'electrical', 'display_order' => 3],
        ['name' => 'Safety', 'slug' => 'safety', 'display_order' => 4],
        ['name' => 'Planning', 'slug' => 'planning', 'display_order' => 5],
    ];
    
    $stmt = $pdo->prepare("
        INSERT INTO gallery_categories (name, slug, display_order) 
        VALUES (:name, :slug, :display_order)
    ");
    
    foreach ($categories as $category) {
        $stmt->execute($category);
        echo "  ✓ {$category['name']} added\n";
    }
    
    echo "\n✅ Gallery categories seeded successfully!\n";
    echo "\nYou can now:\n";
    echo "- Add images to gallery with proper categories\n";
    echo "- Filter gallery by categories\n";
    echo "- Organize your gallery images\n";
    
} catch (PDOException $e) {
    echo "\n❌ Seeding failed: " . $e->getMessage() . "\n";
    exit(1);
}
