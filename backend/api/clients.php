<?php
/**
 * Clients API Endpoint
 * GET /api/clients - Get all clients
 * GET /api/clients?id=1 - Get single client
 * POST /api/clients - Create new client
 * PUT /api/clients - Update client
 * DELETE /api/clients?id=1 - Delete client
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Allow GET, POST, PUT, PATCH, DELETE
if (!in_array($method, ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'])) {
    Response::methodNotAllowed(['GET', 'POST', 'PUT', 'PATCH', 'DELETE']);
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError('Database connection failed');
}

try {
    // GET - Fetch clients
    if ($method === 'GET') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        
        if ($id) {
            // Get single client
            $query = "SELECT * FROM clients WHERE id = :id";
            $result = $database->query($query, ['id' => $id]);
            
            if (empty($result)) {
                Response::notFound('Client not found');
            }
            
            Response::success($result[0]);
        } else {
            // Get sorting parameters
            $sortBy = isset($_GET['sort']) ? $_GET['sort'] : 'display_order';
            $sortOrder = isset($_GET['order']) && strtoupper($_GET['order']) === 'DESC' ? 'DESC' : 'ASC';
            
            // Validate sort field
            $allowedSortFields = ['display_order', 'name', 'id'];
            if (!in_array($sortBy, $allowedSortFields)) {
                $sortBy = 'display_order';
            }
            
            // Get all clients (including inactive for admin)
            $query = "
                SELECT 
                    id,
                    name,
                    logo,
                    website,
                    display_order,
                    is_active
                FROM clients
                ORDER BY {$sortBy} {$sortOrder}
            ";
            
            $clients = $database->query($query);
            Response::success($clients ?: []);
        }
    }
    
    // POST - Create new client
    elseif ($method === 'POST') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['name']) || empty(trim($data['name']))) {
            Response::badRequest('Client name is required');
        }
        
        $query = "
            INSERT INTO clients (
                name, logo, website, 
                display_order, is_active
            ) VALUES (
                :name, :logo, :website,
                :display_order, :is_active
            )
        ";
        
        $params = [
            'name' => trim($data['name']),
            'logo' => isset($data['logo']) ? trim($data['logo']) : null,
            'website' => isset($data['website']) ? trim($data['website']) : null,
            'display_order' => isset($data['display_order']) ? intval($data['display_order']) : 0,
            'is_active' => isset($data['is_active']) ? intval($data['is_active']) : 1
        ];
        
        $result = $database->execute($query, $params);
        
        if ($result) {
            Response::created(['id' => $db->lastInsertId(), 'message' => 'Client created successfully']);
        } else {
            Response::serverError('Failed to create client');
        }
    }
    
    // PUT - Update client
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!isset($data['id']) || !intval($data['id'])) {
            Response::badRequest('Client ID is required');
        }
        
        if (!isset($data['name']) || empty(trim($data['name']))) {
            Response::badRequest('Client name is required');
        }
        
        $query = "
            UPDATE clients SET
                name = :name,
                logo = :logo,
                website = :website,
                display_order = :display_order,
                is_active = :is_active
            WHERE id = :id
        ";
        
        $params = [
            'id' => intval($data['id']),
            'name' => trim($data['name']),
            'logo' => isset($data['logo']) ? trim($data['logo']) : null,
            'website' => isset($data['website']) ? trim($data['website']) : null,
            'display_order' => isset($data['display_order']) ? intval($data['display_order']) : 0,
            'is_active' => isset($data['is_active']) ? intval($data['is_active']) : 1
        ];
        
        $result = $database->execute($query, $params);
        
        if ($result) {
            Response::success(['message' => 'Client updated successfully']);
        } else {
            Response::serverError('Failed to update client');
        }
    }

    // PATCH - Update display order
    elseif ($method === 'PATCH') {
        $input = json_decode(file_get_contents('php://input'), true);

        if (!isset($input['orders']) || !is_array($input['orders'])) {
            Response::badRequest('Invalid order data');
        }

        foreach ($input['orders'] as $order) {
            $id = isset($order['id']) ? intval($order['id']) : 0;
            $displayOrder = isset($order['display_order']) ? intval($order['display_order']) : 0;

            if ($id > 0) {
                $database->execute(
                    'UPDATE clients SET display_order = :display_order WHERE id = :id',
                    ['display_order' => $displayOrder, 'id' => $id]
                );
            }
        }

        Response::success(['message' => 'Client orders updated successfully']);
    }
    
    // DELETE - Delete client
    elseif ($method === 'DELETE') {
        $id = isset($_GET['id']) ? intval($_GET['id']) : null;
        
        if (!$id) {
            Response::badRequest('Client ID is required');
        }
        
        $query = "DELETE FROM clients WHERE id = :id";
        $result = $database->execute($query, ['id' => $id]);
        
        if ($result) {
            Response::success(['message' => 'Client deleted successfully']);
        } else {
            Response::serverError('Failed to delete client');
        }
    }
    
} catch (Exception $e) {
    error_log("Clients API Error: " . $e->getMessage());
    Response::serverError('An error occurred: ' . $e->getMessage());
}
