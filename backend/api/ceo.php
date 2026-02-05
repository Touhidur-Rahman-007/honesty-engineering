<?php
/**
 * CEO Information API Endpoint
 * GET /api/ceo - Get CEO information and message
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ['GET', 'PUT'])) {
    Response::methodNotAllowed(['GET', 'PUT']);
}

// Handle GET - Fetch CEO information
if ($method === 'GET') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        // Get CEO information - if none exists, return empty object
        $query = "SELECT * FROM ceo_info ORDER BY id DESC LIMIT 1";
        $ceo = $database->queryOne($query);
        
        Response::success($ceo ?: []);
        
    } catch (Exception $e) {
        error_log("CEO API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching CEO information');
    }
}

// Handle PUT - Update CEO information
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        // Check if CEO record exists
        $existing = $database->queryOne("SELECT id FROM ceo_info LIMIT 1");
        
        if ($existing) {
            // Update existing record
            $stmt = $db->prepare("
                UPDATE ceo_info SET 
                    name = ?,
                    designation = ?,
                    education = ?,
                    phone = ?,
                    email = ?,
                    message = ?,
                    image = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([
                $input['name'] ?? '',
                $input['designation'] ?? '',
                $input['education'] ?? '',
                $input['phone'] ?? '',
                $input['email'] ?? '',
                $input['message'] ?? '',
                $input['image'] ?? '',
                $existing['id']
            ]);
        } else {
            // Insert new record
            $stmt = $db->prepare("
                INSERT INTO ceo_info (name, designation, education, phone, email, message, image)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $input['name'] ?? '',
                $input['designation'] ?? '',
                $input['education'] ?? '',
                $input['phone'] ?? '',
                $input['email'] ?? '',
                $input['message'] ?? '',
                $input['image'] ?? ''
            ]);
        }
        
        Response::success(['message' => 'CEO information updated successfully']);
        
    } catch (Exception $e) {
        error_log("CEO API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating CEO information');
    }
}
