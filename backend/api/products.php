<?php
/**
 * Products API Endpoint
 * GET /api/products - Get all products grouped by category
 * GET /api/products?category=slug - Get products for specific category
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
    
    // Check if category filter is provided
    $categorySlug = isset($_GET['category']) ? trim($_GET['category']) : null;
    
    if ($categorySlug && $categorySlug !== 'all') {
        // Get products for specific category
        $query = "
            SELECT 
                pc.id as category_id,
                pc.name as category_name,
                pc.slug as category_slug,
                pc.description as category_description,
                p.id as product_id,
                p.name as product_name,
                p.description as product_description,
                p.image as product_image,
                p.specifications,
                p.price
            FROM product_categories pc
            LEFT JOIN products p ON pc.id = p.category_id AND p.is_active = 1
            WHERE pc.slug = :slug AND pc.is_active = 1
            ORDER BY p.display_order ASC
        ";
        
        $results = $database->query($query, ['slug' => $categorySlug]);
        
        if (empty($results)) {
            Response::notFound('Category');
        }
        
        // Format response
        $category = [
            'id' => $results[0]['category_id'],
            'name' => $results[0]['category_name'],
            'slug' => $results[0]['category_slug'],
            'description' => $results[0]['category_description'],
            'products' => []
        ];
        
        foreach ($results as $row) {
            if ($row['product_id']) {
                $category['products'][] = [
                    'id' => $row['product_id'],
                    'name' => $row['product_name'],
                    'description' => $row['product_description'],
                    'image' => $row['product_image'],
                    'specifications' => $row['specifications'],
                    'price' => $row['price'],
                ];
            }
        }
        
        Response::success($category);
        
    } else {
        // Get all products grouped by category
        $query = "
            SELECT 
                pc.id as category_id,
                pc.name as category_name,
                pc.slug as category_slug,
                pc.description as category_description,
                p.id as product_id,
                p.name as product_name,
                p.description as product_description,
                p.image as product_image,
                p.specifications,
                p.price
            FROM product_categories pc
            LEFT JOIN products p ON pc.id = p.category_id AND p.is_active = 1
            WHERE pc.is_active = 1
            ORDER BY pc.display_order ASC, p.display_order ASC
        ";
        
        $results = $database->query($query);
        
        // Group products by category
        $categories = [];
        $categoryMap = [];
        
        foreach ($results as $row) {
            $catId = $row['category_id'];
            
            if (!isset($categoryMap[$catId])) {
                $categoryMap[$catId] = count($categories);
                $categories[] = [
                    'id' => $catId,
                    'name' => $row['category_name'],
                    'slug' => $row['category_slug'],
                    'description' => $row['category_description'],
                    'products' => []
                ];
            }
            
            if ($row['product_id']) {
                $categories[$categoryMap[$catId]]['products'][] = [
                    'id' => $row['product_id'],
                    'name' => $row['product_name'],
                    'description' => $row['product_description'],
                    'image' => $row['product_image'],
                    'specifications' => $row['specifications'],
                    'price' => $row['price'],
                ];
            }
        }
        
        Response::success($categories);
    }
    
} catch (Exception $e) {
    error_log("Products API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching products');
}
