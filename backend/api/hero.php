<?php
/**
 * Hero Section API Endpoint
 * GET /api/hero - Get hero section data with stats
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
    
    // Get active hero section
    $heroQuery = "
        SELECT * FROM hero_section 
        WHERE is_active = 1 
        ORDER BY display_order ASC 
        LIMIT 1
    ";
    
    $hero = $database->queryOne($heroQuery);
    
    // Get hero stats
    $statsQuery = "
        SELECT 
            label,
            value,
            suffix,
            icon
        FROM hero_stats 
        WHERE is_active = 1 
        ORDER BY display_order ASC
    ";
    
    $stats = $database->query($statsQuery);
    
    $data = [
        'hero' => $hero ?: null,
        'stats' => $stats ?: []
    ];
    
    Response::success($data);
    
} catch (Exception $e) {
    error_log("Hero API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching hero section');
}
