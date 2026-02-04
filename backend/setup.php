<?php
/**
 * Quick Setup Guide
 * Run this file to check your setup and initialize the database
 * 
 * Access: http://localhost/api/setup.php
 */

// Prevent running in production
if ($_SERVER['SERVER_NAME'] !== 'localhost' && $_SERVER['SERVER_NAME'] !== '127.0.0.1') {
    die('Setup can only be run on localhost');
}

?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honesty Engineering - API Setup</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        .subtitle {
            color: #666;
            margin-bottom: 30px;
        }
        .step {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 20px;
            margin-bottom: 20px;
            border-radius: 4px;
        }
        .step h2 {
            color: #667eea;
            font-size: 18px;
            margin-bottom: 10px;
        }
        .status {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 4px;
            font-size: 14px;
            font-weight: bold;
            margin-left: 10px;
        }
        .status.success {
            background: #d4edda;
            color: #155724;
        }
        .status.error {
            background: #f8d7da;
            color: #721c24;
        }
        .status.warning {
            background: #fff3cd;
            color: #856404;
        }
        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
            color: #e83e8c;
        }
        pre {
            background: #2d2d2d;
            color: #f8f8f2;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
            margin: 10px 0;
        }
        .btn {
            display: inline-block;
            padding: 12px 24px;
            background: #667eea;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            margin-top: 20px;
            border: none;
            cursor: pointer;
        }
        .btn:hover {
            background: #5568d3;
        }
        ul {
            margin: 10px 0;
            padding-left: 20px;
        }
        li {
            margin: 5px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 Honesty Engineering - API Setup</h1>
        <p class="subtitle">Follow these steps to set up your backend</p>

        <!-- Step 1: PHP Version Check -->
        <div class="step">
            <h2>Step 1: PHP Version Check</h2>
            <?php
            $phpVersion = phpversion();
            $phpOk = version_compare($phpVersion, '7.4.0', '>=');
            ?>
            <p>
                Current PHP Version: <strong><?php echo $phpVersion; ?></strong>
                <span class="status <?php echo $phpOk ? 'success' : 'error'; ?>">
                    <?php echo $phpOk ? '✓ OK' : '✗ Upgrade Required'; ?>
                </span>
            </p>
            <?php if (!$phpOk): ?>
                <p style="color: #721c24; margin-top: 10px;">
                    ⚠️ Please upgrade to PHP 7.4 or higher
                </p>
            <?php endif; ?>
        </div>

        <!-- Step 2: Required Extensions -->
        <div class="step">
            <h2>Step 2: Required PHP Extensions</h2>
            <?php
            $requiredExtensions = ['pdo', 'pdo_mysql', 'json', 'mbstring'];
            $allExtensionsOk = true;
            ?>
            <ul>
                <?php foreach ($requiredExtensions as $ext): ?>
                    <?php
                    $loaded = extension_loaded($ext);
                    if (!$loaded) $allExtensionsOk = false;
                    ?>
                    <li>
                        <code><?php echo $ext; ?></code>
                        <span class="status <?php echo $loaded ? 'success' : 'error'; ?>">
                            <?php echo $loaded ? '✓ Loaded' : '✗ Missing'; ?>
                        </span>
                    </li>
                <?php endforeach; ?>
            </ul>
        </div>

        <!-- Step 3: Database Connection -->
        <div class="step">
            <h2>Step 3: Database Connection</h2>
            <?php
            $dbConfigFile = __DIR__ . '/config/dbConn.php';
            $dbConfigExists = file_exists($dbConfigFile);
            ?>
            <p>
                Config File: <span class="status <?php echo $dbConfigExists ? 'success' : 'error'; ?>">
                    <?php echo $dbConfigExists ? '✓ Found' : '✗ Not Found'; ?>
                </span>
            </p>
            
            <?php if ($dbConfigExists): ?>
                <?php
                $config = require $dbConfigFile;
                try {
                    $dsn = "mysql:host={$config['host']};dbname={$config['database']};charset={$config['charset']}";
                    $pdo = new PDO($dsn, $config['username'], $config['password']);
                    $dbConnected = true;
                    ?>
                    <p>
                        Database Connection: <span class="status success">✓ Connected</span>
                    </p>
                    <p>Database: <strong><?php echo $config['database']; ?></strong></p>
                <?php } catch (PDOException $e) { ?>
                    <p>
                        Database Connection: <span class="status error">✗ Failed</span>
                    </p>
                    <p style="color: #721c24; margin-top: 10px;">
                        Error: <?php echo $e->getMessage(); ?>
                    </p>
                    <p style="margin-top: 10px;">
                        <strong>To fix this:</strong><br>
                        1. Create the database using <code>backend/database/schema.sql</code><br>
                        2. Update credentials in <code>backend/config/dbConn.php</code>
                    </p>
                <?php } ?>
            <?php else: ?>
                <p style="color: #721c24; margin-top: 10px;">
                    Please create <code>backend/config/dbConn.php</code> with your database credentials
                </p>
            <?php endif; ?>
        </div>

        <!-- Step 4: Setup Instructions -->
        <div class="step">
            <h2>Step 4: Import Database Schema</h2>
            <p>Run this command in your terminal:</p>
            <pre>mysql -u root -p honesty_engineering < backend/database/schema.sql</pre>
            
            <p style="margin-top: 15px;">Or import via phpMyAdmin:</p>
            <ul>
                <li>Open phpMyAdmin</li>
                <li>Create database: <code>honesty_engineering</code></li>
                <li>Import <code>backend/database/schema.sql</code></li>
                <li>(Optional) Import <code>backend/database/sample-data.sql</code></li>
            </ul>
        </div>

        <!-- Step 5: Test API -->
        <div class="step">
            <h2>Step 5: Test API Endpoints</h2>
            <p>Try these URLs in your browser or Postman:</p>
            <ul>
                <li><a href="index.php?endpoint=site-config" target="_blank">Site Config</a></li>
                <li><a href="index.php?endpoint=services" target="_blank">Services</a></li>
                <li><a href="index.php?endpoint=clients" target="_blank">Clients</a></li>
                <li><a href="index.php?endpoint=hero" target="_blank">Hero Section</a></li>
            </ul>
        </div>

        <!-- Step 6: Next.js Integration -->
        <div class="step">
            <h2>Step 6: Connect with Next.js Frontend</h2>
            <p>Update your Next.js API base URL to:</p>
            <pre>const API_BASE_URL = 'http://localhost/backend';</pre>
            
            <p style="margin-top: 15px;">Example fetch:</p>
            <pre>const response = await fetch(`${API_BASE_URL}/index.php?endpoint=services`);
const data = await response.json();</pre>
        </div>

        <!-- Summary -->
        <div style="margin-top: 30px; padding: 20px; background: #e7f3ff; border-radius: 5px;">
            <h3 style="color: #004085; margin-bottom: 10px;">📚 Documentation</h3>
            <p>For complete API documentation, see: <code>backend/database/README.md</code></p>
            <p style="margin-top: 10px;">
                <strong>Database Tables:</strong> 25 tables created<br>
                <strong>API Endpoints:</strong> 13+ endpoints available<br>
                <strong>Authentication:</strong> JWT-based admin authentication
            </p>
        </div>

        <a href="index.php?endpoint=site-config" class="btn">Test First API Endpoint →</a>
    </div>
</body>
</html>
