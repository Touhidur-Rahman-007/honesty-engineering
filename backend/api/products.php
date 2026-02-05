<?php
/**
 * Products API Endpoint
 * GET /api/products - Get all products grouped by category
 * GET /api/products?category=slug - Get products for specific category
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

// Handle GET - Fetch all products
if ($method === 'GET') {
    try {
        // Get sorting parameters
        $sortBy = isset($_GET['sort']) ? $_GET['sort'] : 'display_order';
        $sortOrder = isset($_GET['order']) && strtoupper($_GET['order']) === 'DESC' ? 'DESC' : 'ASC';
        
        // Validate sort field
        $allowedSortFields = ['display_order', 'name', 'created_at', 'id'];
        if (!in_array($sortBy, $allowedSortFields)) {
            $sortBy = 'display_order';
        }
        
        // First get all categories
        $categoriesQuery = "SELECT * FROM product_categories ORDER BY display_order ASC";
        $categories = $database->query($categoriesQuery);
        
        // Then get all products
        $productsQuery = "
            SELECT 
                p.*,
                pc.name as category_name,
                pc.slug as category_slug
            FROM products p
            LEFT JOIN product_categories pc ON p.category_id = pc.id
            ORDER BY p.{$sortBy} {$sortOrder}
        ";
        $allProducts = $database->query($productsQuery);
        
        // Group products by category
        $result = [];
        foreach ($categories as $category) {
            $categoryProducts = array_filter($allProducts, function($product) use ($category) {
                return $product['category_id'] == $category['id'];
            });
            
            $result[] = [
                'id' => $category['id'],
                'name' => $category['name'],
                'slug' => $category['slug'],
                'display_order' => $category['display_order'],
                'products' => array_values($categoryProducts)
            ];
        }
        
        Response::success($result);
        
    } catch (Exception $e) {
        error_log("Products API Error: " . $e->getMessage());
        Response::serverError('An error occurred while fetching products');
    }
}

// Handle POST - Create product
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            INSERT INTO products (name, description, category_id, image, display_order)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['name'] ?? '',
            $input['description'] ?? '',
            $input['category_id'] ?? null,
            $input['image'] ?? '',
            $input['display_order'] ?? 0
        ]);
        
        Response::created(['message' => 'Product created successfully', 'id' => $db->lastInsertId()]);
        
    } catch (Exception $e) {
        error_log("Products API Error: " . $e->getMessage());
        Response::serverError('An error occurred while creating product');
    }
}

// Handle PUT - Update product
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? intval($_GET['id']) : ($input['id'] ?? 0);
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $stmt = $db->prepare("
            UPDATE products SET 
                name = ?,
                description = ?,
                category_id = ?,
                image = ?,
                display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $input['name'] ?? '',
            $input['description'] ?? '',
            $input['category_id'] ?? null,
            $input['image'] ?? '',
            $input['display_order'] ?? 0,
            $id
        ]);
        
        Response::success(['message' => 'Product updated successfully']);
        
    } catch (Exception $e) {
        error_log("Products API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating product');
    }
}

// Handle DELETE - Delete product
if ($method === 'DELETE') {
    try {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $stmt = $db->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$id]);
        
        Response::success(['message' => 'Product deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Products API Error: " . $e->getMessage());
        Response::serverError('An error occurred while deleting product');
    }
}
