<?php
/**
 * Update client logo paths to match actual files in /public/assets/images/clients
 */

require_once __DIR__ . '/database/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed!\n");
}

$logoMap = [
    'Rich Cotton Apparels Ltd' => '/assets/images/clients/rich cotton.png',
    'Scandex BD Ltd' => '/assets/images/clients/scandex.png',
    'Silken Sewing Ltd' => '/assets/images/clients/silken.png',
    'Philko Sports Ltd' => '/assets/images/clients/philko.png',
    'Bashundhara Group' => '/assets/images/clients/bashundhara.png',
    'GL Osman Group' => '/assets/images/clients/gl osman group.png',
    'Advance Group' => '/assets/images/clients/advance group.png',
    'SK Dreams' => '/assets/images/clients/sk dreams.png',
    'RP Group' => '/assets/images/clients/rp group.png',
    'AL Group' => '/assets/images/clients/al.png',
    'Bangladesh Agricultural University' => '/assets/images/clients/gazipur agriculture university.png',
    'Pan Pacific Hotels and Resorts' => '/assets/images/clients/pan pacific.png',
    'Posmi Sweaters Limited' => '/assets/images/clients/posmi sweaters.png',
    'Saadatia Group' => '/assets/images/clients/saadatia.png',
    'Hyopshin Bangladesh' => '/assets/images/clients/hyopshin.png'
];

$updated = 0;
foreach ($logoMap as $name => $logoPath) {
    $stmt = $db->prepare('UPDATE clients SET logo = ? WHERE name = ?');
    $stmt->execute([$logoPath, $name]);
    $updated += $stmt->rowCount();
}

echo "Updated logo paths for {$updated} client(s).\n";
