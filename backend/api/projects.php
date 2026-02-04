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
