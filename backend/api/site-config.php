<?php
/**
 * Site Configuration API Endpoint
 * GET /api/site-config - Get site configuration
 * PUT /api/site-config - Update site configuration
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Allow GET, PUT
if (!in_array($method, ['GET', 'PUT'])) {
    Response::methodNotAllowed(['GET', 'PUT']);
}

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    Response::serverError('Database connection failed');
}

try {
    // GET - Fetch site configuration
    if ($method === 'GET') {
        // Get site configuration
        $query = "SELECT * FROM site_config WHERE id = 1 LIMIT 1";
        $siteConfig = $database->queryOne($query);
        
        if (!$siteConfig) {
            // Return empty config with field names matching admin panel form
            Response::success([
                'company_name' => '',
                'tagline' => '',
                'email' => '',
                'phone' => '',
                'address' => '',
                'facebook_url' => '',
                'linkedin_url' => '',
                'twitter_url' => '',
                'instagram_url' => ''
            ]);
        }
        
        // Format the response to match admin panel form field names
        $data = [
            'company_name' => $siteConfig['site_name'] ?? '',
            'tagline' => $siteConfig['tagline'] ?? '',
            'email' => $siteConfig['email'] ?? '',
            'phone' => $siteConfig['phone'] ?? '',
            'address' => $siteConfig['address'] ?? '',
            'facebook_url' => $siteConfig['social_facebook'] ?? '',
            'linkedin_url' => $siteConfig['social_linkedin'] ?? '',
            'twitter_url' => $siteConfig['social_whatsapp'] ?? '',
            'instagram_url' => $siteConfig['social_instagram'] ?? ''
        ];
        
        Response::success($data);
    }
    
    // PUT - Update site configuration
    elseif ($method === 'PUT') {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (!$data) {
            Response::badRequest('Invalid JSON data');
        }
        
        // Check if record exists
        $checkQuery = "SELECT id FROM site_config WHERE id = 1";
        $exists = $database->queryOne($checkQuery);
        
        if ($exists) {
            // Update existing configuration
            $query = "
                UPDATE site_config SET
                    site_name = :site_name,
                    tagline = :tagline,
                    email = :email,
                    phone = :phone,
                    address = :address,
                    social_facebook = :facebook_url,
                    social_linkedin = :linkedin_url,
                    social_whatsapp = :twitter_url,
                    social_instagram = :instagram_url,
                    updated_at = NOW()
                WHERE id = 1
            ";
        } else {
            // Insert new configuration
            $query = "
                INSERT INTO site_config (
                    id, site_name, tagline, email, phone, address,
                    social_facebook, social_linkedin, social_whatsapp, social_instagram,
                    updated_at
                ) VALUES (
                    1, :site_name, :tagline, :email, :phone, :address,
                    :facebook_url, :linkedin_url, :twitter_url, :instagram_url,
                    NOW()
                )
            ";
        }
        
        $params = [
            'site_name' => isset($data['company_name']) ? trim($data['company_name']) : '',
            'tagline' => isset($data['tagline']) ? trim($data['tagline']) : '',
            'email' => isset($data['email']) ? trim($data['email']) : '',
            'phone' => isset($data['phone']) ? trim($data['phone']) : '',
            'address' => isset($data['address']) ? trim($data['address']) : '',
            'facebook_url' => isset($data['facebook_url']) ? trim($data['facebook_url']) : '',
            'linkedin_url' => isset($data['linkedin_url']) ? trim($data['linkedin_url']) : '',
            'twitter_url' => isset($data['twitter_url']) ? trim($data['twitter_url']) : '',
            'instagram_url' => isset($data['instagram_url']) ? trim($data['instagram_url']) : ''
        ];
        
        $result = $database->execute($query, $params);
        
        if ($result) {
            Response::success(['message' => 'Site configuration updated successfully']);
        } else {
            Response::serverError('Failed to update site configuration');
        }
    }
    
} catch (Exception $e) {
    error_log("Site Config API Error: " . $e->getMessage());
    Response::serverError('An error occurred: ' . $e->getMessage());
}
