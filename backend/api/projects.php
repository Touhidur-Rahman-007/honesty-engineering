<?php
/**
 * Projects API Endpoint
 * GET /api/projects - Get all projects
 * GET /api/projects?featured=1 - Get only featured projects
 * GET /api/projects/{id} - Get single project with images
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

// Handle GET
if ($method === 'GET') {
    try {
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError('Database connection failed');
    }
    
    // Check if specific project ID is requested
    $projectId = isset($_GET['id']) ? (int)$_GET['id'] : null;
    
    if ($projectId) {
        // Get single project
        $projectQuery = "
            SELECT * FROM projects 
            WHERE id = :id AND is_active = 1
        ";
        
        $project = $database->queryOne($projectQuery, ['id' => $projectId]);
        
        if (!$project) {
            Response::notFound('Project');
        }
        
        // Get project images
        $imagesQuery = "
            SELECT 
                id,
                image_path,
                caption
            FROM project_images 
            WHERE project_id = :project_id AND is_active = 1
            ORDER BY display_order ASC
        ";
        
        $images = $database->query($imagesQuery, ['project_id' => $projectId]);
        
        $project['images'] = $images ?: [];
        
        Response::success($project);
        
    } else {
        // Get all projects or featured projects
        $featured = isset($_GET['featured']) && $_GET['featured'] == '1';
        
        $query = "
            SELECT 
                id,
                title,
                description,
                client_name,
                project_type,
                location,
                completion_date,
                project_value,
                featured_image,
                status,
                is_featured
            FROM projects 
            WHERE is_active = 1
        ";
        
        if ($featured) {
            $query .= " AND is_featured = 1";
        }
        
        $query .= " ORDER BY display_order ASC, completion_date DESC";
        
        $projects = $database->query($query);
        
        Response::success($projects ?: []);
    }
    
} catch (Exception $e) {
    error_log("Projects API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching projects');
}
}

// Handle POST - Create project
if ($method === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $stmt = $db->prepare("
            INSERT INTO projects (title, description, client_name, project_type, location, completion_date, project_value, featured_image, status, is_featured, display_order)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['client_name'] ?? '',
            $input['project_type'] ?? '',
            $input['location'] ?? '',
            $input['completion_date'] ?? null,
            $input['project_value'] ?? null,
            $input['featured_image'] ?? '',
            $input['status'] ?? 'completed',
            isset($input['is_featured']) ? 1 : 0,
            $input['display_order'] ?? 0
        ]);
        
        Response::created(['message' => 'Project created successfully', 'id' => $db->lastInsertId()]);
        
    } catch (Exception $e) {
        error_log("Projects API Error: " . $e->getMessage());
        Response::serverError('An error occurred while creating project');
    }
}

// Handle PUT - Update project
if ($method === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        $id = isset($_GET['id']) ? intval($_GET['id']) : ($input['id'] ?? 0);
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $stmt = $db->prepare("
            UPDATE projects SET 
                title = ?,
                description = ?,
                client_name = ?,
                project_type = ?,
                location = ?,
                completion_date = ?,
                project_value = ?,
                featured_image = ?,
                status = ?,
                is_featured = ?,
                display_order = ?
            WHERE id = ?
        ");
        $stmt->execute([
            $input['title'] ?? '',
            $input['description'] ?? '',
            $input['client_name'] ?? '',
            $input['project_type'] ?? '',
            $input['location'] ?? '',
            $input['completion_date'] ?? null,
            $input['project_value'] ?? null,
            $input['featured_image'] ?? '',
            $input['status'] ?? 'completed',
            isset($input['is_featured']) ? 1 : 0,
            $input['display_order'] ?? 0,
            $id
        ]);
        
        Response::success(['message' => 'Project updated successfully']);
        
    } catch (Exception $e) {
        error_log("Projects API Error: " . $e->getMessage());
        Response::serverError('An error occurred while updating project');
    }
}

// Handle DELETE - Delete project
if ($method === 'DELETE') {
    try {
        $id = isset($_GET['id']) ? intval($_GET['id']) : 0;
        
        if ($id <= 0) {
            Response::badRequest('Invalid ID');
        }
        
        $stmt = $db->prepare("DELETE FROM projects WHERE id = ?");
        $stmt->execute([$id]);
        
        Response::success(['message' => 'Project deleted successfully']);
        
    } catch (Exception $e) {
        error_log("Projects API Error: " . $e->getMessage());
        Response::serverError('An error occurred while deleting project');
    }
}
