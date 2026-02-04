<?php
/**
 * Site Configuration API Endpoint
 * GET /api/site-config
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
    
    // Get site configuration
    $query = "SELECT * FROM site_config WHERE id = 1 LIMIT 1";
    $siteConfig = $database->queryOne($query);
    
    if (!$siteConfig) {
        Response::error('Site configuration not found', 404);
    }
    
    // Format the response
    $data = [
        'site_name' => $siteConfig['site_name'],
        'tagline' => $siteConfig['tagline'],
        'description' => $siteConfig['description'],
        'url' => $siteConfig['site_url'],
        'email' => $siteConfig['email'],
        'phone' => $siteConfig['phone'],
        'address' => [
            'street' => $siteConfig['address_street'],
            'sector' => $siteConfig['address_sector'],
            'area' => $siteConfig['address_area'],
            'city' => $siteConfig['address_city'],
            'postal_code' => $siteConfig['address_postal_code'],
            'country' => $siteConfig['address_country'],
        ],
        'credentials' => [
            'trade_license' => $siteConfig['trade_license'],
            'tin' => $siteConfig['tin'],
            'vat' => $siteConfig['vat'],
            'bepza' => $siteConfig['bepza'],
        ],
        'founding_year' => (int)$siteConfig['founding_year'],
        'logo' => $siteConfig['logo'],
        'favicon' => $siteConfig['favicon'],
        'social' => [
            'facebook' => $siteConfig['social_facebook'],
            'linkedin' => $siteConfig['social_linkedin'],
            'whatsapp' => $siteConfig['social_whatsapp'],
            'youtube' => $siteConfig['social_youtube'],
            'instagram' => $siteConfig['social_instagram'],
        ],
        'powered_by' => [
            'name' => $siteConfig['powered_by_name'],
            'url' => $siteConfig['powered_by_url'],
        ],
    ];
    
    Response::success($data);
    
} catch (Exception $e) {
    error_log("Site Config API Error: " . $e->getMessage());
    Response::serverError('An error occurred while fetching site configuration');
}
