<?php
/**
 * Gallery API Endpoint
 * GET /api/gallery - Get all gallery images
 * GET /api/gallery?category=slug - Get images for specific category
 * GET /api/gallery?featured=1 - Get only featured images
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    Response::methodNotAllowed(['GET']);
}

try {
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError('Database connection failed');
    }
    
    // Get filter parameters
    $categorySlug = isset($_GET['category']) ? trim($_GET['category']) : null;
    $featured = isset($_GET['featured']) && $_GET['featured'] == '1';
    
    // Build query
    $query = "
        SELECT 
            g.id,
            g.title,
            g.description,
            g.image_path,
            g.thumbnail_path,
            g.is_featured,
            gc.name as category_name,
            gc.slug as category_slug
        FROM gallery g
        INNER JOIN gallery_categories gc ON g.category_id = gc.id
        WHERE g.is_active = 1 AND gc.is_active = 1
    ";
    
    $params = [];
    
    // Filter by category
    if ($categorySlug && $categorySlug !== 'all') {
        $query .= " AND gc.slug = :category_slug";
        $params['category_slug'] = $categorySlug;
    }
    
    // Filter by featured
    if ($featured) {
        $query .= " AND g.is_featured = 1";
    }
    
    $query .= " ORDER BY g.display_order ASC, g.created_at DESC";
    
    $images = $database->query($query, $params);
    
    // Get all categories for filtering
    $categoriesQuery = "
        SELECT 
            id,
            name,
            slug
        FROM gallery_categories 
        WHERE is_active = 1
        ORDER BY display_order ASC
    ";
    
    $categories = $database->query($categoriesQuery);
    
    $data = [
        'images' => $images ?: [],
        'categories' => $categories ?: []
    ];
    
    Response::success($data);
    
} catch (Exception $e) {
    error_log("Gallery API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching gallery');
}
