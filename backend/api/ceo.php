<?php
/**
 * CEO Information API Endpoint
 * GET /api/ceo - Get CEO information and message
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
    
    // Get active CEO information
    $query = "
        SELECT 
            id,
            name,
            designation,
            education,
            phone,
            email,
            message,
            image,
            signature_image
        FROM ceo_info 
        WHERE is_active = 1 
        LIMIT 1
    ";
    
    $ceo = $database->queryOne($query);
    
    if (!$ceo) {
        Response::notFound('CEO information');
    }
    
    Response::success($ceo);
    
} catch (Exception $e) {
    error_log("CEO API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching CEO information');
}
