<?php
/**
 * Seed Database with Existing Website Data
 * Inserts all current website content into database
 */

define('DB_CONFIG_ACCESS', true);
require_once __DIR__ . '/database/Database.php';

$database = new Database();
$pdo = $database->getConnection();

echo "🌱 Starting database seeding...\n\n";

try {
    // ============================================
    // 1. SITE CONFIGURATION
    // ============================================
    echo "1. Site Configuration...\n";
    $pdo->exec("DELETE FROM site_config");
    $stmt = $pdo->prepare("
        INSERT INTO site_config (
            site_name, tagline, email, phone, address, 
            trade_license, tin, bepza_license, founding_year,
            social_facebook, social_linkedin, social_whatsapp
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        'Honesty Engineering',
        'GOVT. APPROVED 1st CLASS CONTRACTOR',
        'info@honestyengineeringbd.com',
        '+880 1976 57 34 48',
        'Road # 18, House # 14 (Lift 4), Sector # 10, Uttara, Dhaka - 1230',
        '004737',
        '817588536183',
        'DEPZCHA062',
        2018,
        'https://facebook.com/honestyengineering',
        'https://linkedin.com/company/honestyengineering',
        'https://wa.me/8801976573448'
    ]);
    echo "   ✓ Site config inserted\n\n";

    // ============================================
    // 2. CEO INFO
    // ============================================
    echo "2. CEO Information...\n";
    $pdo->exec("DELETE FROM ceo_info");
    $stmt = $pdo->prepare("
        INSERT INTO ceo_info (name, title, message, photo) 
        VALUES (?, ?, ?, ?)
    ");
    $stmt->execute([
        'Engr. Md. Anwarul Islam Raton',
        'Proprietor & CEO, BSc (EEE), MSc (ECE)',
        'At Honesty Engineering, we are committed to delivering excellence in every project. Since 2018, our team has been providing comprehensive engineering solutions with integrity and professionalism. We take pride in our work and strive to exceed client expectations through innovative solutions and quality craftsmanship.',
        '/assets/images/team/ceo.png'
    ]);
    echo "   ✓ CEO info inserted\n\n";

    // ============================================
    // 3. ABOUT SECTION
    // ============================================
    echo "3. About Section...\n";
    $pdo->exec("DELETE FROM about_section");
    $stmt = $pdo->prepare("
        INSERT INTO about_section (title, description, image) 
        VALUES (?, ?, ?)
    ");
    $stmt->execute([
        'About Honesty Engineering',
        'A multidisciplinary engineering consultancy firm established in 2018. We provide comprehensive services in electrical works, civil construction, fire safety, interior works, and software solutions. Our team of experienced engineers delivers innovative solutions for industrial, commercial, and residential projects.',
        '/assets/images/about/company.jpg'
    ]);
    echo "   ✓ About section inserted\n\n";

    // ============================================
    // 4. ABOUT FEATURES
    // ============================================
    echo "4. About Features...\n";
    $pdo->exec("DELETE FROM about_features");
    $features = [
        ['Experience', 'Over 5 years of successful project delivery', 'fa-award', 1],
        ['Quality', 'ISO certified processes and quality assurance', 'fa-certificate', 2],
        ['Team', 'Skilled engineers and technical experts', 'fa-users', 3],
        ['Innovation', 'Modern solutions and cutting-edge technology', 'fa-lightbulb', 4]
    ];
    $stmt = $pdo->prepare("INSERT INTO about_features (title, description, icon, display_order) VALUES (?, ?, ?, ?)");
    foreach ($features as $feature) {
        $stmt->execute($feature);
    }
    echo "   ✓ " . count($features) . " about features inserted\n\n";

    // ============================================
    // 5. HERO SECTION
    // ============================================
    echo "5. Hero Section...\n";
    $pdo->exec("DELETE FROM hero_section");
    $stmt = $pdo->prepare("
        INSERT INTO hero_section (title, subtitle, cta_text, cta_link, background_image, is_active, display_order) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        'Engineering Excellence for Industrial Growth',
        'Comprehensive electrical, civil, and fire safety solutions for factories and commercial buildings',
        'Get Started',
        '#contact',
        '/assets/images/hero/industrial.jpg',
        1,
        1
    ]);
    echo "   ✓ Hero section inserted\n\n";

    // ============================================
    // 6. HERO STATS
    // ============================================
    echo "6. Hero Stats...\n";
    $pdo->exec("DELETE FROM hero_stats");
    $stats = [
        ['Projects Completed', '50+', 'fa-project-diagram', 1],
        ['Years Experience', '5+', 'fa-calendar', 2],
        ['Happy Clients', '30+', 'fa-smile', 3],
        ['Team Members', '20+', 'fa-users', 4]
    ];
    $stmt = $pdo->prepare("INSERT INTO hero_stats (label, value, icon, display_order) VALUES (?, ?, ?, ?)");
    foreach ($stats as $stat) {
        $stmt->execute($stat);
    }
    echo "   ✓ " . count($stats) . " hero stats inserted\n\n";

    // ============================================
    // 7. SERVICE CATEGORIES
    // ============================================
    echo "7. Service Categories...\n";
    // Delete services first due to foreign key
    $pdo->exec("DELETE FROM services");
    $pdo->exec("DELETE FROM service_categories");
    $categories = [
        ['Electrical Works', 'electrical', 'fa-bolt', '#fbbf24', 1],
        ['Civil Construction', 'civil', 'fa-building', '#3b82f6', 2],
        ['Electrical Design', 'electrical-design', 'fa-drafting-compass', '#a855f7', 3],
        ['Fire Safety', 'fire-safety', 'fa-fire-extinguisher', '#ef4444', 4],
        ['Factory Furniture', 'factory-furniture', 'fa-chair', '#10b981', 5],
        ['Water Treatment', 'water-treatment', 'fa-water', '#06b6d4', 6],
        ['Interior Works', 'interior', 'fa-paint-roller', '#f59e0b', 7],
        ['Software Solutions', 'software', 'fa-code', '#8b5cf6', 8]
    ];
    $stmt = $pdo->prepare("INSERT INTO service_categories (name, slug, icon, color, display_order) VALUES (?, ?, ?, ?, ?)");
    $categoryIds = [];
    foreach ($categories as $cat) {
        $stmt->execute($cat);
        $categoryIds[$cat[1]] = $pdo->lastInsertId(); // Store by slug
    }
    echo "   ✓ " . count($categories) . " service categories inserted\n\n";

    // ============================================
    // 8. SERVICES
    // ============================================
    echo "8. Services...\n";
    // Already deleted above with categories
    $services = [
        // Electrical Works
        ['electrical', 'Sub-Station Supply & Installation', 'Complete substation setup with transformers and switchgear', 1],
        ['electrical', 'PFI, MDB, SDB Supply & Earthing', 'Power factor improvement and distribution boards with proper earthing', 2],
        ['electrical', 'Thermography & Testing', 'Electrical testing including thermography, earthing & insulation', 3],
        ['electrical', 'Automation & Instrumentation', 'Industrial automation and control systems', 4],
        ['electrical', 'Electrical Wiring', 'All kinds of electrical wiring for industrial and commercial buildings', 5],
        
        // Civil Construction
        ['civil', 'RCC & Steel Structure', 'Reinforced concrete and steel structures as per RSC & BNBC', 1],
        ['civil', 'Architecture & Design', 'Architectural, structural design and drawing services', 2],
        
        // Electrical Design
        ['electrical-design', 'Electrical Single Line Diagram', 'Professional SLD design for electrical systems', 1],
        ['electrical-design', 'Electrical Layout Design', 'Comprehensive electrical layout design (ELD)', 2],
        ['electrical-design', 'Lightning Protection System', 'LPS design and installation', 3],
        ['electrical-design', 'Sub-Station Layout Design', 'Substation and earthing layout as per BNBC, RSC, BS-7671 & IEC', 4],
        
        // Fire Safety
        ['fire-safety', 'Fire Detection & Alarm', 'Advanced fire detection and alarm systems', 1],
        ['fire-safety', 'Fire Hydrant & Sprinkler', 'Complete fire hydrant and sprinkler system installation', 2],
        ['fire-safety', 'Fire Door & Separation', 'Fire-rated doors and fire separation solutions', 3],
        ['fire-safety', 'Gas Suspension System', 'Automatic gas suspension systems for fire safety', 4],
        
        // Factory Furniture
        ['factory-furniture', 'Industrial Furniture', 'Custom factory furniture and fixtures', 1],
        ['factory-furniture', 'Storage Solutions', 'Industrial storage and racking systems', 2],
        
        // Water Treatment
        ['water-treatment', 'ETP - Effluent Treatment', 'Industrial effluent treatment plant design and installation', 1],
        ['water-treatment', 'WTP - Water Treatment', 'Water treatment plant for industrial use', 2],
        ['water-treatment', 'RO Plant', 'Reverse osmosis water purification systems', 3],
        
        // Interior Works
        ['interior', 'Office Interior Design', 'Modern office interior solutions', 1],
        ['interior', 'Factory Interior', 'Industrial interior works and finishing', 2],
        
        // Software
        ['software', 'Industrial Software', 'Custom software solutions for industrial operations', 1],
        ['software', 'Automation Software', 'Industrial automation and SCADA systems', 2]
    ];
    $stmt = $pdo->prepare("INSERT INTO services (category_id, title, description, display_order) VALUES (?, ?, ?, ?)");
    foreach ($services as $service) {
        $slug = $service[0];
        if (isset($categoryIds[$slug])) {
            $stmt->execute([$categoryIds[$slug], $service[1], $service[2], $service[3]]);
        }
    }
    echo "   ✓ " . count($services) . " services inserted\n\n";

    // ============================================
    // 9. PRODUCTS
    // ============================================
    echo "9. Products...\n";
    // First create product categories and get IDs
    $pdo->exec("DELETE FROM products");
    $pdo->exec("DELETE FROM product_categories");
    
    $productCategories = [
        ['Equipment', 'equipment', 1],
        ['Electrical', 'electrical', 2],
        ['Pumps', 'pumps', 3],
        ['Power', 'power', 4],
        ['Safety', 'safety', 5]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO product_categories (name, slug, display_order) VALUES (?, ?, ?)");
    $productCategoryIds = [];
    foreach ($productCategories as $cat) {
        $stmt->execute($cat);
        $productCategoryIds[$cat[1]] = $pdo->lastInsertId();
    }
    
    $products = [
        ['Industrial Boilers', 'High-efficiency industrial boilers', '/assets/images/products/boiler.png', 'equipment', 1],
        ['Bus-bars', 'Electrical bus-bar systems', '/assets/images/products/busbar.png', 'electrical', 2],
        ['Industrial Generators', 'Reliable power generation systems', '/assets/images/products/generator.png', 'power', 3]
    ];
    $stmt = $pdo->prepare("INSERT INTO products (name, description, image, category_id, display_order) VALUES (?, ?, ?, ?, ?)");
    foreach ($products as $product) {
        $categorySlug = $product[3];
        if (isset($productCategoryIds[$categorySlug])) {
            $stmt->execute([$product[0], $product[1], $product[2], $productCategoryIds[$categorySlug], $product[4]]);
        }
    }
    echo "   ✓ " . count($products) . " products inserted\n\n";

    // ============================================
    // 10. CLIENTS
    // ============================================
    echo "10. Clients...\n";
    $pdo->exec("DELETE FROM clients");
    $clients = [
        ['Rich Cotton Apparels Ltd', '/assets/images/clients/rich cotton.png', 1],
        ['Scandex', '/assets/images/clients/scandex.png', 2],
        ['Silken Sewing Ltd', '/assets/images/clients/silken.png', 3],
        ['Philko Inc', '/assets/images/clients/philko.png', 4],
        ['Bashundhara Group', '/assets/images/clients/bashundhara.png', 5],
        ['GL Osman Group', '/assets/images/clients/gl osman group.png', 6],
        ['Advance Group', '/assets/images/clients/advance group.png', 7],
        ['SK Dreams', '/assets/images/clients/sk dreams.png', 8],
        ['RP Group', '/assets/images/clients/rp group.png', 9],
        ['AL', '/assets/images/clients/al.png', 10],
        ['Bangladesh Metro', '/assets/images/clients/bangladesh metro.png', 11],
        ['Pan Pacific', '/assets/images/clients/pan pacific.png', 12],
        ['Posmi Sweaters', '/assets/images/clients/posmi sweaters.png', 13],
        ['Saadatia', '/assets/images/clients/saadatia.png', 14],
        ['Hyopshin', '/assets/images/clients/hyopshin.png', 15],
        ['Gazipur Agriculture University', '/assets/images/clients/gazipur agriculture university.png', 16]
    ];
    $stmt = $pdo->prepare("INSERT INTO clients (name, logo, display_order) VALUES (?, ?, ?)");
    foreach ($clients as $client) {
        $stmt->execute($client);
    }
    echo "   ✓ " . count($clients) . " clients inserted\n\n";

    // ============================================
    // 11. PROJECTS
    // ============================================
    echo "11. Projects...\n";
    $pdo->exec("DELETE FROM projects");
    $projects = [
        [
            'Rich Cotton Apparels Ltd - Turnkey Project',
            'Complete turnkey project including electrical, civil construction, and interior works',
            'Rich Cotton Apparels Ltd',
            'Turnkey Project',
            '/assets/images/projects/rich-cotton.jpg',
            1,
            1
        ],
        [
            'Philko Sports Ltd - Factory Setup',
            'Contract signing and full project implementation for factory setup',
            'Philko Sports Ltd',
            'Factory Setup',
            '/assets/images/projects/philko.jpg',
            1,
            2
        ],
        [
            'Scandex BD Ltd - Project Completion',
            'Successful project handover with complete electrical and fire safety systems',
            'Scandex BD Ltd',
            'Electrical & Fire Safety',
            '/assets/images/projects/scandex.jpg',
            1,
            3
        ]
    ];
    $stmt = $pdo->prepare("INSERT INTO projects (title, description, client_name, project_type, featured_image, is_featured, display_order) VALUES (?, ?, ?, ?, ?, ?, ?)");
    foreach ($projects as $project) {
        $stmt->execute($project);
    }
    echo "   ✓ " . count($projects) . " projects inserted\n\n";

    // ============================================
    // 12. GALLERY
    // ============================================
    echo "12. Gallery...\n";
    // First create gallery categories
    $pdo->exec("DELETE FROM gallery");
    $pdo->exec("DELETE FROM gallery_categories");
    
    $galleryCategories = [
        ['Electrical', 'electrical', 1],
        ['Fire Safety', 'fire-safety', 2],
        ['Civil', 'civil', 3],
        ['Interior', 'interior', 4],
        ['Projects', 'projects', 5]
    ];
    
    $stmt = $pdo->prepare("INSERT INTO gallery_categories (name, slug, display_order) VALUES (?, ?, ?)");
    $galleryCategoryIds = [];
    foreach ($galleryCategories as $cat) {
        $stmt->execute($cat);
        $galleryCategoryIds[$cat[1]] = $pdo->lastInsertId();
    }
    
    $galleryItems = [
        ['Electrical Panel Installation', '/assets/images/gallery/panel.jpg', 'electrical', 1],
        ['Substation Construction', '/assets/images/gallery/substation.jpg', 'electrical', 2],
        ['Fire Safety System', '/assets/images/gallery/fire.jpg', 'fire-safety', 3],
        ['Civil Construction Work', '/assets/images/gallery/construction.jpg', 'civil', 4],
        ['Factory Interior', '/assets/images/gallery/interior.jpg', 'interior', 5],
        ['Project Site', '/assets/images/gallery/site.jpg', 'projects', 6]
    ];
    $stmt = $pdo->prepare("INSERT INTO gallery (title, image_url, category_id, display_order) VALUES (?, ?, ?, ?)");
    foreach ($galleryItems as $item) {
        $categorySlug = $item[2];
        if (isset($galleryCategoryIds[$categorySlug])) {
            $stmt->execute([$item[0], $item[1], $galleryCategoryIds[$categorySlug], $item[3]]);
        }
    }
    echo "   ✓ " . count($galleryItems) . " gallery items inserted\n\n";

    echo "✅ Database seeding completed successfully!\n\n";
    echo "📊 Summary:\n";
    echo "   - Site Configuration: 1 record\n";
    echo "   - CEO Info: 1 record\n";
    echo "   - About Section: 1 record\n";
    echo "   - About Features: " . count($features) . " records\n";
    echo "   - Hero Section: 1 record\n";
    echo "   - Hero Stats: " . count($stats) . " records\n";
    echo "   - Service Categories: " . count($categories) . " records\n";
    echo "   - Services: " . count($services) . " records\n";
    echo "   - Products: " . count($products) . " records\n";
    echo "   - Clients: " . count($clients) . " records\n";
    echo "   - Projects: " . count($projects) . " records\n";
    echo "   - Gallery: " . count($galleryItems) . " records\n";
    echo "\n✨ All data is now available in admin panel for editing!\n";

} catch (PDOException $e) {
    echo "\n❌ Seeding failed: " . $e->getMessage() . "\n";
    exit(1);
}
