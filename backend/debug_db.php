<?php
/**
 * Debug DB connection and clients count (remove after use)
 */

require_once __DIR__ . '/database/Database.php';
require_once __DIR__ . '/database/Response.php';
$db = new Database();
$conn = $db->getConnection();

if (!$conn) {
    Response::serverError('DB connection failed');
}

$result = $db->query('SELECT COUNT(*) AS count FROM clients');
$count = $result ? (int)$result[0]['count'] : 0;

$dbNameRow = $db->query('SELECT DATABASE() AS db_name');
$dbName = $dbNameRow ? $dbNameRow[0]['db_name'] : null;

Response::success([
    'database' => $dbName,
    'clients_count' => $count,
    'http_host' => $_SERVER['HTTP_HOST'] ?? null,
    'server_addr' => $_SERVER['SERVER_ADDR'] ?? null
]);
