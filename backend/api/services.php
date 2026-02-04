<?php
/**
 * Services API Endpoint
 * GET /api/services - Get all services grouped by category
 * GET /api/services?category=slug - Get services for specific category
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
    
    if ($categorySlug) {
        // Get services for specific category
        $query = "
            SELECT 
                sc.id as category_id,
                sc.name as category_name,
                sc.slug as category_slug,
                sc.icon as category_icon,
                sc.color_from,
                sc.color_to,
                sc.description as category_description,
                s.id as service_id,
                s.title as service_title,
                s.description as service_description,
                s.image as service_image,
                s.icon as service_icon
            FROM service_categories sc
            LEFT JOIN services s ON sc.id = s.category_id AND s.is_active = 1
            WHERE sc.slug = :slug AND sc.is_active = 1
            ORDER BY s.display_order ASC
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
            'icon' => $results[0]['category_icon'],
            'color' => [
                'from' => $results[0]['color_from'],
                'to' => $results[0]['color_to'],
            ],
            'description' => $results[0]['category_description'],
            'services' => []
        ];
        
        foreach ($results as $row) {
            if ($row['service_id']) {
                $category['services'][] = [
                    'id' => $row['service_id'],
                    'title' => $row['service_title'],
                    'description' => $row['service_description'],
                    'image' => $row['service_image'],
                    'icon' => $row['service_icon'],
                ];
            }
        }
        
        Response::success($category);
        
    } else {
        // Get all services grouped by category
        $query = "
            SELECT 
                sc.id as category_id,
                sc.name as category_name,
                sc.slug as category_slug,
                sc.icon as category_icon,
                sc.color_from,
                sc.color_to,
                sc.description as category_description,
                s.id as service_id,
                s.title as service_title,
                s.description as service_description,
                s.image as service_image,
                s.icon as service_icon
            FROM service_categories sc
            LEFT JOIN services s ON sc.id = s.category_id AND s.is_active = 1
            WHERE sc.is_active = 1
            ORDER BY sc.display_order ASC, s.display_order ASC
        ";
        
        $results = $database->query($query);
        
        // Group services by category
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
                    'icon' => $row['category_icon'],
                    'color' => [
                        'from' => $row['color_from'],
                        'to' => $row['color_to'],
                    ],
                    'description' => $row['category_description'],
                    'services' => []
                ];
            }
            
            if ($row['service_id']) {
                $categories[$categoryMap[$catId]]['services'][] = [
                    'id' => $row['service_id'],
                    'title' => $row['service_title'],
                    'description' => $row['service_description'],
                    'image' => $row['service_image'],
                    'icon' => $row['service_icon'],
                ];
            }
        }
        
        Response::success($categories);
    }
    
} catch (Exception $e) {
    error_log("Services API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching services');
}
