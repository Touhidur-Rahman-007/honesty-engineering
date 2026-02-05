<?php
/**
 * Gallery API Endpoint
 * GET /api/gallery - Get all gallery images
 * GET /api/gallery?id=1 - Get single image
 * GET /api/gallery?category=slug - Get images for specific category
 * POST /api/gallery - Create new gallery image
 * PUT /api/gallery - Update gallery image
 * DELETE /api/gallery?id=1 - Delete gallery image
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Allow GET, POST, PUT, DELETE
if (!in_array($method, ['GET', 'POST', 'PUT', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'DELETE']);
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError('Database connection failed');
}

try {
    // GET - Fetch gallery images
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        
        if ($id) {
            // Get single image
            $query = "
                SELECT 
                    g.*,
                    gc.name as category_name,
                    gc.slug as category_slug
                FROM gallery g
                LEFT JOIN gallery_categories gc ON g.category_id = gc.id
                WHERE g.id = :id
            ";
            $result = $database->query($query, ['id' => $id]);
            
            if (empty($result)) {
                Response::notFound('Image not found');
            }
            
            Response::success($result[0]);
        } else {
            // Get filter parameters
            $categorySlug = isset($_GET['category']) ? trim($_GET['category']) : null;
            $featured = isset($_GET['featured']) && $_GET['featured'] == '1';
            
            // Build query
            $query = "
                SELECT 
                    g.id,
                    g.title,
                    g.description,
                    g.image_url as image_path,
                    g.image_url as thumbnail_path,
                    g.is_featured,
                    g.display_order,
                    g.category_id,
                    gc.name as category_name,
                    gc.slug as category_slug
                FROM gallery g
                LEFT JOIN gallery_categories gc ON g.category_id = gc.id
            ";
            
            $params = [];
            $conditions = [];
            
            // Filter by category
            if ($categorySlug && $categorySlug !== 'all') {
                $conditions[] = "gc.slug = :category_slug";
                $params['category_slug'] = $categorySlug;
            }
            
            // Filter by featured
            if ($featured) {
                $conditions[] = "g.is_featured = 1";
            }
            
            if (!empty($conditions)) {
                $query .= " WHERE " . implode(' AND ', $conditions);
            }
            
            $query .= " ORDER BY g.display_order ASC, g.created_at DESC";
            
            $images = $database->query($query, $params);
            
            // Get all categories for filtering
            $categoriesQuery = "
                SELECT 
                    id,
                    name,
                    slug,
                    description,
                    is_active
                FROM gallery_categories 
                ORDER BY display_order ASC
            ";
            
            $categories = $database->query($categoriesQuery);
            
            $data = [
                'images' => $images ?: [],
                'categories' => $categories ?: []
            ];
            
            Response::success($data);
        }
    }
    
    // POST - Create new gallery image
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['title']) || empty(trim($data['title']))) {
            Response::badRequest('Image title is required');
        }
        
        if (!isset($data['image_path']) || empty(trim($data['image_path']))) {
            Response::badRequest('Image path is required');
        }
        
        $query = "
            INSERT INTO gallery (
                title, description, image_path, thumbnail_path,
                category_id, is_featured, display_order, 
                is_active, created_at
            ) VALUES (
                :title, :description, :image_path, :thumbnail_path,
                :category_id, :is_featured, :display_order,
                :is_active, NOW()
            )
        ";
        
        $params = [
            'title' => trim($data['title']),
            'description' => isset($data['description']) ? trim($data['description']) : null,
            'image_path' => trim($data['image_path']),
            'thumbnail_path' => isset($data['thumbnail_path']) ? trim($data['thumbnail_path']) : null,
            'category_id' => isset($data['category_id']) ? intval($data['category_id']) : null,
            'is_featured' => isset($data['is_featured']) ? intval($data['is_featured']) : 0,
            'display_order' => isset($data['display_order']) ? intval($data['display_order']) : 0,
            'is_active' => isset($data['is_active']) ? intval($data['is_active']) : 1
        ];
        
        $result = $database->execute($query, $params);
        
        if ($result) {
            Response::created(['id' => $db->lastInsertId(), 'message' => 'Image added successfully']);
        } else {
            Response::serverError('Failed to add image');
        }
    }
    
    // PUT - Update gallery image
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !intval($data['id'])) {
            Response::badRequest('Image ID is required');
        }
        
        if (!isset($data['title']) || empty(trim($data['title']))) {
            Response::badRequest('Image title is required');
        }
        
        $query = "
            UPDATE gallery SET
                title = :title,
                description = :description,
                image_path = :image_path,
                thumbnail_path = :thumbnail_path,
                category_id = :category_id,
                is_featured = :is_featured,
                display_order = :display_order,
                is_active = :is_active,
                updated_at = NOW()
            WHERE id = :id
        ";
        
        $params = [
            'id' => intval($data['id']),
            'title' => trim($data['title']),
            'description' => isset($data['description']) ? trim($data['description']) : null,
            'image_path' => isset($data['image_path']) ? trim($data['image_path']) : null,
            'thumbnail_path' => isset($data['thumbnail_path']) ? trim($data['thumbnail_path']) : null,
            'category_id' => isset($data['category_id']) ? intval($data['category_id']) : null,
            'is_featured' => isset($data['is_featured']) ? intval($data['is_featured']) : 0,
            'display_order' => isset($data['display_order']) ? intval($data['display_order']) : 0,
            'is_active' => isset($data['is_active']) ? intval($data['is_active']) : 1
        ];
        
        $result = $database->execute($query, $params);
        
        if ($result) {
            Response::success(['message' => 'Image updated successfully']);
        } else {
            Response::serverError('Failed to update image');
        }
    }
    
    // DELETE - Delete gallery image
    elseif ($method === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        
        if (!$id) {
            Response::badRequest('Image ID is required');
        }
        
        $query = "DELETE FROM gallery WHERE id = :id";
        $result = $database->execute($query, ['id' => $id]);
        
        if ($result) {
            Response::success(['message' => 'Image deleted successfully']);
        } else {
            Response::serverError('Failed to delete image');
        }
    }
    
} catch (Exception $e) {
    error_log("Gallery API Error: " . $e->getMessage());
    Response::serverError('An error occurred: ' . $e->getMessage());
}
