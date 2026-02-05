<?php
/**
 * About Section API Endpoint
 * GET /api/about - Get about section data with features
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ['GET', 'PUT'])) {
    Response::methodNotAllowed(['GET', 'PUT']);
}

// Handle GET - Fetch about section
if ($method === 'GET') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        // Get about section - return empty if not exists
        $aboutQuery = "SELECT * FROM about_section ORDER BY id DESC LIMIT 1";
        $about = $database->queryOne($aboutQuery);
        
        // Get about features
        $featuresQuery = "SELECT * FROM about_features ORDER BY display_order ASC";
        $features = $database->query($featuresQuery);
        
        $data = [
            'about' => $about ?: [],
            'features' => $features ?: []
        ];
        
        Response::success($data);
        
    } catch (Exception $e) {
        error_log("About API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching about section');
    }
}

// Handle PUT - Update about section
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        // Check if about record exists
        $existing = $database->queryOne("SELECT id FROM about_section LIMIT 1");
        
        if ($existing) {
            // Update existing record
            $stmt = $db->prepare("
                UPDATE about_section SET 
                    title = ?,
                    description = ?,
                    image = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            ");
            $stmt->execute([
                $input['title'] ?? '',
                $input['description'] ?? '',
                $input['image'] ?? '',
                $existing['id']
            ]);
        } else {
            // Insert new record
            $stmt = $db->prepare("
                INSERT INTO about_section (title, description, image)
                VALUES (?, ?, ?)
            ");
            $stmt->execute([
                $input['title'] ?? '',
                $input['description'] ?? '',
                $input['image'] ?? ''
            ]);
        }
        
        Response::success(['message' => 'About section updated successfully']);
        
    } catch (Exception $e) {
        error_log("About API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating about section');
    }
}
