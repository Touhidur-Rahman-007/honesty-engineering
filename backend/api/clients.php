<?php
/**
 * Clients API Endpoint
 * GET /api/clients - Get all active clients
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
    
    // Get all active clients
    $query = "
        SELECT 
            id,
            name,
            logo,
            website,
            description
        FROM clients
        WHERE is_active = 1
        ORDER BY display_order ASC, name ASC
    ";
    
    $clients = $database->query($query);
    
    Response::success($clients);
    
} catch (Exception $e) {
    error_log("Clients API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching clients');
}
