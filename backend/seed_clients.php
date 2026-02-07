<?php
/**
 * Seed Clients into Database
 */

require_once __DIR__ . '/database/Database.php';

$database = new Database();
$db = $database->getConnection();

if (!$db) {
    die("Database connection failed!\n");
}

echo "Seeding clients...\n\n";

// Check if clients already exist
$existingClients = $database->query("SELECT COUNT(*) as count FROM clients");
if ($existingClients[0]['count'] > 0) {
    echo "Clients already exist. Clearing existing clients...\n";
    $database->query("TRUNCATE TABLE clients");
}

// Insert clients
$clients = [
    ['name' => 'Rich Cotton Apparels Ltd', 'logo' => '/assets/images/clients/rich cotton.png', 'display_order' => 1],
    ['name' => 'Scandex BD Ltd', 'logo' => '/assets/images/clients/scandex.png', 'display_order' => 2],
    ['name' => 'Silken Sewing Ltd', 'logo' => '/assets/images/clients/silken.png', 'display_order' => 3],
    ['name' => 'Philko Sports Ltd', 'logo' => '/assets/images/clients/philko.png', 'display_order' => 4],
    ['name' => 'Bashundhara Group', 'logo' => '/assets/images/clients/bashundhara.png', 'display_order' => 5],
    ['name' => 'GL Osman Group', 'logo' => '/assets/images/clients/gl osman group.png', 'display_order' => 6],
    ['name' => 'Advance Group', 'logo' => '/assets/images/clients/advance group.png', 'display_order' => 7],
    ['name' => 'SK Dreams', 'logo' => '/assets/images/clients/sk dreams.png', 'display_order' => 8],
    ['name' => 'RP Group', 'logo' => '/assets/images/clients/rp group.png', 'display_order' => 9],
    ['name' => 'AL Group', 'logo' => '/assets/images/clients/al.png', 'display_order' => 10],
    ['name' => 'Bangladesh Agricultural University', 'logo' => '/assets/images/clients/gazipur agriculture university.png', 'display_order' => 11],
    ['name' => 'Pan Pacific Hotels and Resorts', 'logo' => '/assets/images/clients/pan pacific.png', 'display_order' => 12],
    ['name' => 'Posmi Sweaters Limited', 'logo' => '/assets/images/clients/posmi sweaters.png', 'display_order' => 13],
    ['name' => 'Saadatia Group', 'logo' => '/assets/images/clients/saadatia.png', 'display_order' => 14],
    ['name' => 'Hyopshin Bangladesh', 'logo' => '/assets/images/clients/hyopshin.png', 'display_order' => 15],
];

$inserted = 0;
foreach ($clients as $client) {
    try {
        $stmt = $db->prepare("
            INSERT INTO clients (name, logo, display_order, is_active)
            VALUES (?, ?, ?, 1)
        ");
        $stmt->execute([
            $client['name'],
            $client['logo'],
            $client['display_order']
        ]);
        $inserted++;
        echo "✓ Added: {$client['name']}\n";
    } catch (Exception $e) {
        echo "✗ Failed to add {$client['name']}: " . $e->getMessage() . "\n";
    }
}

echo "\n========================================\n";
echo "Successfully inserted {$inserted} clients!\n";
echo "========================================\n";

// Verify
$count = $database->query("SELECT COUNT(*) as count FROM clients");
echo "\nTotal clients in database: " . $count[0]['count'] . "\n";
