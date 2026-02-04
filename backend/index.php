<?php
/**
 * API Router
 * Main entry point for all API requests
 * 
 * Usage: /api/index.php?endpoint=<endpoint_name>
 * Example: /api/index.php?endpoint=site-config
 * 
 * With URL rewriting (.htaccess):
 * /api/site-config
 * /api/services
 * /api/clients
 */

// Enable error reporting for development
// DISABLE IN PRODUCTION
ini_set('display_errors', 1);
error_reporting(E_ALL);

// Load CORS configuration
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/database/Response.php';

// Get the endpoint from URL
$endpoint = isset($_GET['endpoint']) ? $_GET['endpoint'] : '';

// Remove any extra slashes or path segments
$endpoint = trim($endpoint, '/');
$endpoint = strtok($endpoint, '?'); // Remove query string

// Map endpoints to their files
$endpoints = [
    'site-config' => 'api/site-config.php',
    'hero' => 'api/hero.php',
    'about' => 'api/about.php',
    'services' => 'api/services.php',
    'products' => 'api/products.php',
    'projects' => 'api/projects.php',
    'clients' => 'api/clients.php',
    'gallery' => 'api/gallery.php',
    'testimonials' => 'api/testimonials.php',
    'ceo' => 'api/ceo.php',
    'team' => 'api/team.php',
    'certifications' => 'api/certifications.php',
    'navigation' => 'api/navigation.php',
    'contact' => 'api/contact.php',
];

// Check if endpoint exists
if (empty($endpoint)) {
    Response::error('No endpoint specified', 400);
}

if (!isset($endpoints[$endpoint])) {
    Response::error('Invalid endpoint: ' . $endpoint, 404);
}

$endpointFile = __DIR__ . '/' . $endpoints[$endpoint];

// Check if endpoint file exists
if (!file_exists($endpointFile)) {
    Response::error('Endpoint not implemented yet: ' . $endpoint, 501);
}

// Include and execute the endpoint
require_once $endpointFile;
