<?php
/**
 * CORS Configuration
 * Handles Cross-Origin Resource Sharing for API
 * 
 * SECURITY NOTE:
 * - Update $allowedOrigins with your exact production domain
 * - Never use '*' in production
 * - Keep this list as restrictive as possible
 */

// Prevent direct access
if (!defined('CORS_CONFIG_ACCESS')) {
    http_response_code(403);
    die('Direct access not permitted');
}

// Allow from any origin for development
// In production, specify your exact domain
$allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://www.honestyengineeringbd.com',
    'https://honestyengineeringbd.com'
];

// Get the origin of the request
$origin = isset($_SERVER['HTTP_ORIGIN']) ? $_SERVER['HTTP_ORIGIN'] : '';

// Check if origin is allowed
if (in_array($origin, $allowedOrigins)) {
    header("Access-Control-Allow-Origin: $origin");
} else {
    // For development, allow all origins
    // REMOVE THIS IN PRODUCTION
    header("Access-Control-Allow-Origin: *");
}

header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Credentials: true");

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Set content type
header("Content-Type: application/json; charset=UTF-8");
