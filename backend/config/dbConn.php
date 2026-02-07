<?php
/**
 * Database Configuration
 * Auto-detects local vs live environment
 * 
 * SECURITY NOTE: 
 * - Never commit this file with production credentials
 * - Use different credentials for development and production
 * - Ensure this file is not accessible via web (protected by .htaccess)
 */

// Prevent direct access
if (!defined('DB_CONFIG_ACCESS')) {
    http_response_code(403);
    die('Direct access not permitted');
}

// Detect environment (local vs live)
// CLI mode check: if running from command line, assume local
$host = $_SERVER['HTTP_HOST'] ?? '';
$isLocal = (php_sapi_name() === 'cli')
           || (bool)preg_match('/^(localhost|127\.0\.0\.1)(:\d+)?$/', $host)
           || (isset($_SERVER['SERVER_ADDR']) && $_SERVER['SERVER_ADDR'] === '127.0.0.1');

// Local development configuration
$localConfig = [
    'host' => 'localhost',
    'database' => 'honestyWebDB',
    'username' => 'root',
    'password' => '',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];

// Live server configuration (Hostinger)
$liveConfig = [
    'host' => 'localhost',
    'database' => 'u133017855_honestyWebDB',
    'username' => 'u133017855_honestyWebDB',
    'password' => 'rZ3:VOZuUi~',
    'charset' => 'utf8mb4',
    'collation' => 'utf8mb4_unicode_ci',
];

// Return appropriate configuration
return $isLocal ? $localConfig : $liveConfig;
