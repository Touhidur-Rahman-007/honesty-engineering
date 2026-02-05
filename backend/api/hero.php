<?php
/**
 * Hero Section API Endpoint
 * GET /api/hero - Get hero section data with stats
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE']);
}

// Handle GET - Fetch hero items
if ($method === 'GET') {
    try {
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        // Get all hero items
        $heroQuery = "SELECT * FROM hero_section ORDER BY display_order ASC";
        $items = $database->query($heroQuery);
        
        Response::success($items ?: []);
        
    } catch (Exception $e) {
        error_log("Hero API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching hero section');
    }
}

// Handle POST - Create hero item
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        $stmt = $db->prepare("
            INSERT INTO hero_section (title, subtitle, cta_text, cta_link, background_image, display_order, is_active)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['subtitle'] ?? '',
            $input['cta_text'] ?? '',
            $input['cta_link'] ?? '',
            $input['background_image'] ?? '',
            $input['display_order'] ?? 0,
            isset($input['is_active']) ? 1 : 1
        ]);
        
        Response::created(['message' => 'Hero item created successfully', 'id' => $db->lastInsertId()]);
        
    } catch (Exception $e) {
        error_log("Hero API Error: " . $e->getMessage());
        Response::serverError('An error occurred while creating hero item');
    }
}

// Handle PUT - Update hero item
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? intval($_GET['id']) : ($input['id'] ?? 0);
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        $stmt = $db->prepare("
            UPDATE hero_section SET 
                title = ?,
                subtitle = ?,
                cta_text = ?,
                cta_link = ?,
                background_image = ?,
                display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['subtitle'] ?? '',
            $input['cta_text'] ?? '',
            $input['cta_link'] ?? '',
            $input['background_image'] ?? '',
            $input['display_order'] ?? 0,
            $id
        ]);
        
        Response::success(['message' => 'Hero item updated successfully']);
        
    } catch (Exception $e) {
        error_log("Hero API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating hero item');
    }
}

// Handle DELETE - Delete hero item
if ($method === 'DELETE') {
    try {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $database = new Database();
        $db = $database->getConnection();
        
        if (!$db) {
            Response::serverError('Database connection failed');
        }
        
        $stmt = $db->prepare("DELETE FROM hero_section WHERE id = ?");
        $stmt->execute([$id]);
        
        Response::success(['message' => 'Hero item deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Hero API Error: " . $e->getMessage());
        Response::serverError('An error occurred while deleting hero item');
    }
}
