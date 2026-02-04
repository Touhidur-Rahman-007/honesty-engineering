<?php
/**
 * About Section API Endpoint
 * GET /api/about - Get about section data with features
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
    
    // Get about section
    $aboutQuery = "
        SELECT * FROM about_section 
        WHERE is_active = 1 
        LIMIT 1
    ";
    
    $about = $database->queryOne($aboutQuery);
    
    // Get about features
    $featuresQuery = "
        SELECT 
            title,
            icon
        FROM about_features 
        WHERE is_active = 1 
        ORDER BY display_order ASC
    ";
    
    $features = $database->query($featuresQuery);
    
    $data = [
        'about' => $about ?: null,
        'features' => $features ?: []
    ];
    
    Response::success($data);
    
} catch (Exception $e) {
    error_log("About API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching about section');
}
