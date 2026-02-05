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

if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE']);
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
        $allowedSortFields = ['display_order', 'title', 'created_at', 'id', 'category_name'];
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
