<?php
/**
 * Service Categories API Endpoint
 * GET /api/service-categories - Get all service categories
 * POST /api/service-categories - Create new category (admin)
 * PUT /api/service-categories - Update category (admin)
 * DELETE /api/service-categories - Delete category (admin)
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE']);
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError('Database connection failed');
}

// Handle GET - Fetch all categories
if ($method === 'GET') {
    try {
        $query = "
            SELECT 
                sc.*,
                COUNT(s.id) as service_count
            FROM service_categories sc
            LEFT JOIN services s ON sc.id = s.category_id
            GROUP BY sc.id
            ORDER BY sc.display_order ASC
        ";
        
        $categories = $database->query($query);
        Response::success($categories);
        
    } catch (Exception $e) {
        error_log("Service Categories API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching categories');
    }
}

// Handle POST - Create category
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Generate slug from name if not provided
        $slug = $input['slug'] ?? strtolower(str_replace(' ', '-', $input['name']));
        
        $stmt = $db->prepare("
            INSERT INTO service_categories (name, slug, icon, color, display_order)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['name'] ?? '',
            $slug,
            $input['icon'] ?? '',
            $input['color'] ?? '#3B82F6',
            $input['display_order'] ?? 0
        ]);
        
        Response::created([
            'message' => 'Category created successfully',
            'id' => $db->lastInsertId()
        ]);
        
    } catch (Exception $e) {
        error_log("Create Category Error: " . $e->getMessage());
        Response::serverError('Failed to create category');
    }
}

// Handle PUT - Update category
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            Response::badRequest('Category ID is required');
        }
        
        $updates = [];
        $params = [];
        
        if (isset($input['name'])) {
            $updates[] = 'name = ?';
            $params[] = $input['name'];
        }
        if (isset($input['slug'])) {
            $updates[] = 'slug = ?';
            $params[] = $input['slug'];
        }
        if (isset($input['icon'])) {
            $updates[] = 'icon = ?';
            $params[] = $input['icon'];
        }
        if (isset($input['color'])) {
            $updates[] = 'color = ?';
            $params[] = $input['color'];
        }
        if (isset($input['display_order'])) {
            $updates[] = 'display_order = ?';
            $params[] = $input['display_order'];
        }
        
        if (empty($updates)) {
            Response::badRequest('No fields to update');
        }
        
        $params[] = $input['id'];
        
        $stmt = $db->prepare("
            UPDATE service_categories
            SET " . implode(', ', $updates) . "
            WHERE id = ?
        ");
        $stmt->execute($params);
        
        Response::success(['message' => 'Category updated successfully']);
        
    } catch (Exception $e) {
        error_log("Update Category Error: " . $e->getMessage());
        Response::serverError('Failed to update category');
    }
}

// Handle DELETE - Delete category
if ($method === 'DELETE') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($input['id'])) {
            Response::badRequest('Category ID is required');
        }
        
        // Check if category has services
        $stmt = $db->prepare("SELECT COUNT(*) as count FROM services WHERE category_id = ?");
        $stmt->execute([$input['id']]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        if ($result['count'] > 0) {
            Response::badRequest('Cannot delete category with existing services');
        }
        
        $stmt = $db->prepare("DELETE FROM service_categories WHERE id = ?");
        $stmt->execute([$input['id']]);
        
        Response::success(['message' => 'Category deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Delete Category Error: " . $e->getMessage());
        Response::serverError('Failed to delete category');
    }
}
