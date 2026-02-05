<?php
/**
 * Admin Authentication Endpoint
 * POST /api/auth - Login
 * GET /api/auth - Check session
 * DELETE /api/auth - Logout
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';

function jsonResponse($payload, $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $loggedIn = isset($_SESSION['admin_logged_in']) && $_SESSION['admin_logged_in'] === true;
    $username = null;
    if ($loggedIn && isset($_SESSION['admin_username']) && $_SESSION['admin_username'] !== '') {
        $username = $_SESSION['admin_username'];
    }
    jsonResponse([
        'success' => true,
        'data' => [
            'logged_in' => $loggedIn,
            'username' => $loggedIn ? $username : null
        ]
    ]);
}

if ($method === 'POST') {
    $raw = file_get_contents('php://input');
    $body = json_decode($raw, true);
    if (!is_array($body)) {
        $body = [];
    }

    $username = isset($body['username']) ? trim($body['username']) : (isset($_POST['username']) ? trim($_POST['username']) : '');
    $password = isset($body['password']) ? $body['password'] : (isset($_POST['password']) ? $_POST['password'] : '');

    // Default credentials (change in production)
    $validUser = 'admin';
    $validPass = 'admin123';

    if ($username === $validUser && $password === $validPass) {
        $_SESSION['admin_logged_in'] = true;
        $_SESSION['admin_username'] = $username;

        jsonResponse([
            'success' => true,
            'data' => [
                'logged_in' => true,
                'username' => $username
            ],
            'message' => 'Login successful'
        ]);
    }

    jsonResponse([
        'success' => false,
        'error' => 'Invalid credentials'
    ], 401);
}

if ($method === 'DELETE') {
    $_SESSION = [];

    if (ini_get('session.use_cookies')) {
        $params = session_get_cookie_params();
        setcookie(session_name(), '', time() - 42000, $params['path'], $params['domain'], $params['secure'], $params['httponly']);
    }

    session_destroy();
    jsonResponse([
        'success' => true,
        'data' => ['logged_in' => false],
        'message' => 'Logged out'
    ]);
}

jsonResponse([
    'success' => false,
    'error' => 'Method not allowed'
], 405);
