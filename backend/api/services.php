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

$method = $_SERVER['REQUEST_METHOD'];

if (!in_array($method, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError('Database connection failed');
}

// Handle GET - Fetch all services
if ($method === 'GET') {
    try {
        // Get query parameters
        $categorySlug = isset($_GET['category']) ? trim($_GET['category']) : null;
        $sortBy = isset($_GET['sort']) ? $_GET['sort'] : 'display_order';
        $sortOrder = isset($_GET['order']) && strtoupper($_GET['order']) === 'DESC' ? 'DESC' : 'ASC';
        $groupByCategory = !isset($_GET['flat']) || $_GET['flat'] !== 'true';
        
        // Validate sort field
        $allowedSortFields = ['display_order', 'title', 'id', 'category_name'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'display_order';
        }
        
        // Build category filter
        $categoryFilter = '';
        $categoryParams = [];
        if ($categorySlug) {
            $categoryFilter = ' WHERE sc.slug = ?';
            $categoryParams[] = $categorySlug;
        }
        
        // If specific category requested, return flat list
        if ($categorySlug) {
            $servicesQuery = "
                SELECT 
                    s.*,
                    sc.name as category_name,
                    sc.slug as category_slug,
                    sc.icon as category_icon,
                    sc.color as category_color
                FROM services s
                LEFT JOIN service_categories sc ON s.category_id = sc.id
                {$categoryFilter}
                ORDER BY s.{$sortBy} {$sortOrder}
            ";
            $stmt = $db->prepare($servicesQuery);
            $stmt->execute($categoryParams);
            $services = $stmt->fetchAll(PDO::FETCH_ASSOC);
            
            Response::success([
                'category' => $categorySlug,
                'services' => $services
            ]);
            exit;
        }
        
        // Get all categories sorted
        $categoriesQuery = "SELECT * FROM service_categories ORDER BY display_order ASC";
        $categories = $database->query($categoriesQuery);
        
        // Get all services
        $orderByClause = $sortBy === 'category_name' 
            ? "ORDER BY sc.display_order {$sortOrder}, s.display_order ASC"
            : "ORDER BY s.{$sortBy} {$sortOrder}";
            
        $servicesQuery = "
            SELECT 
                s.*,
                sc.name as category_name,
                sc.slug as category_slug,
                sc.icon as category_icon,
                sc.color as category_color,
                sc.display_order as category_order
            FROM services s
            LEFT JOIN service_categories sc ON s.category_id = sc.id
            {$orderByClause}
        ";
        $allServices = $database->query($servicesQuery);
        
        // Return flat list if requested
        if (!$groupByCategory) {
            Response::success($allServices);
            exit;
        }
        
        // Group services by category
        $result = [];
        foreach ($categories as $category) {
            $categoryServices = array_filter($allServices, function($service) use ($category) {
                return $service['category_id'] == $category['id'];
            });
            
            // Only include categories that have services
            if (count($categoryServices) > 0) {
                $result[] = [
                    'id' => $category['id'],
                    'name' => $category['name'],
                    'slug' => $category['slug'],
                    'icon' => $category['icon'],
                    'color' => $category['color'],
                    'display_order' => $category['display_order'],
                    'services' => array_values($categoryServices)
                ];
            }
        }
        
        Response::success($result);
        
    } catch (Exception $e) {
        error_log("Services API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching services');
    }
}

// Handle POST - Create service
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Default icon is '❖'
        $defaultIcon = '❖';
        
        $stmt = $db->prepare("
            INSERT INTO services (title, description, icon, category_id, display_order)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['icon'] ?? $defaultIcon,
            $input['category_id'] ?? null,
            $input['display_order'] ?? 0
        ]);
        
        Response::created(['message' => 'Service created successfully', 'id' => $db->lastInsertId()]);
        
    } catch (Exception $e) {
        error_log("Services API Error: " . $e->getMessage());
        Response::serverError('An error occurred while creating service');
    }
}

// Handle PUT - Update service
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? intval($_GET['id']) : ($input['id'] ?? 0);
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        // Default icon is '❖'
        $defaultIcon = '❖';
        
        $stmt = $db->prepare("
            UPDATE services SET 
                title = ?,
                description = ?,
                icon = ?,
                category_id = ?,
                display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['icon'] ?? $defaultIcon,
            $input['category_id'] ?? null,
            $input['display_order'] ?? 0,
            $id
        ]);
        
        Response::success(['message' => 'Service updated successfully']);
        
    } catch (Exception $e) {
        error_log("Services API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating service');
    }
}

// Handle PATCH - Update display order
if ($method === 'PATCH') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Bulk update order
        if (isset($input['orders']) && is_array($input['orders'])) {
            foreach ($input['orders'] as $order) {
                $stmt = $db->prepare("UPDATE services SET display_order = ? WHERE id = ?");
                $stmt->execute([$order['display_order'], $order['id']]);
            }
            Response::success(['message' => 'Service orders updated successfully']);
        } else {
            Response::badRequest('Invalid order data');
        }
        
    } catch (Exception $e) {
        error_log("Services API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating order');
    }
}

// Handle DELETE - Delete service
if ($method === 'DELETE') {
    try {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $stmt = $db->prepare("DELETE FROM services WHERE id = ?");
        $stmt->execute([$id]);
        
        Response::success(['message' => 'Service deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Services API Error: " . $e->getMessage());
        Response::serverError('An error occurred while deleting service');
    }
}
