-- ================================================
-- SEED DATA FOR HONESTY ENGINEERING DATABASE
-- Generated: 2026-02-04
-- This file contains INSERT queries for all static data
-- ================================================

-- First, clear existing data (optional - uncomment if needed)
-- TRUNCATE TABLE hero_section;
-- TRUNCATE TABLE hero_stats;
-- TRUNCATE TABLE about_section;
-- TRUNCATE TABLE about_features;
-- TRUNCATE TABLE ceo_info;
-- TRUNCATE TABLE service_categories;
-- TRUNCATE TABLE services;
-- TRUNCATE TABLE product_categories;
-- TRUNCATE TABLE products;
-- TRUNCATE TABLE projects;
-- TRUNCATE TABLE clients;
-- TRUNCATE TABLE gallery_categories;
-- TRUNCATE TABLE gallery;

-- ================================================
-- SITE CONFIGURATION
-- ================================================
INSERT INTO site_config (
    id, site_name, tagline, description, site_url,
    email, phone, address_street, address_sector, address_area,
    address_city, address_postal_code, address_country,
    trade_license, tin, vat, bepza, founding_year,
    logo, favicon,
    social_facebook, social_linkedin, social_whatsapp,
    powered_by_name, powered_by_url,
    created_at
) VALUES (
    1,
    'Honesty Engineering',
    'Engineering Excellence Since 2009',
    'Leading provider of turnkey electrical, civil, and MEP solutions for industrial and commercial sectors in Bangladesh.',
    'https://honestyengineering.com',
    'info@honestyengineering.com',
    '+880 1711-123456',
    'House #123, Road #12',
    'Sector #7',
    'Uttara',
    'Dhaka',
    '1230',
    'Bangladesh',
    'TRAD/DSCC/123456/2009',
    '123456789012',
    'VAT-123456',
    'BEPZA-REG-2009',
    2009,
    '/uploads/branding/logo.png',
    '/uploads/branding/favicon.ico',
    'https://facebook.com/honestyengineering',
    'https://linkedin.com/company/honestyengineering',
    'https://wa.me/8801711123456',
    'AD Bangla Tech',
    'https://adbangla.tech',
    NOW()
);

-- ================================================
-- HERO SECTION
-- ================================================
INSERT INTO hero_section (title, subtitle, description, cta_text, cta_link, background_image, is_active, display_order, created_at) VALUES
('Engineering Excellence Since 2009', 'Your Trusted Partner in Industrial Solutions', 'Leading provider of turnkey electrical, civil, and MEP solutions for industrial and commercial sectors in Bangladesh.', 'Explore Our Services', '/services', '/uploads/hero/hero-1.jpg', 1, 1, NOW()),
('Turnkey Project Solutions', 'From Design to Commissioning', 'Complete end-to-end project management with professional expertise and quality assurance.', 'View Projects', '/gallery', '/uploads/hero/hero-2.jpg', 1, 2, NOW()),
('Certified & Compliant', 'Meeting International Standards', 'All our projects comply with BNBC, RSC, BS-7671, and IEC standards for quality and safety.', 'Our Certifications', '/certification', '/uploads/hero/hero-3.jpg', 1, 3, NOW());

-- ================================================
-- HERO STATS
-- ================================================
INSERT INTO hero_stats (label, value, suffix, icon, display_order, created_at) VALUES
('Years Experience', 15, '+', 'calendar', 1, NOW()),
('Projects Completed', 500, '+', 'check-circle', 2, NOW()),
('Happy Clients', 200, '+', 'users', 3, NOW()),
('Team Members', 50, '+', 'user-friends', 4, NOW());

-- ================================================
-- ABOUT SECTION
-- ================================================
INSERT INTO about_section (
    title, subtitle, description, mission, vision, 
    years_experience, team_size, certifications, 
    image, created_at
) VALUES (
    'About Honesty Engineering',
    'Building Tomorrow\'s Infrastructure Today',
    'Honesty Engineering has been at the forefront of industrial and commercial construction since 2009. We specialize in providing comprehensive turnkey solutions that encompass electrical works, civil construction, MEP services, and fire safety systems.',
    'To deliver exceptional engineering solutions that exceed client expectations while maintaining the highest standards of quality, safety, and environmental responsibility.',
    'To become the most trusted and innovative engineering partner in Bangladesh, setting industry benchmarks for excellence and sustainability.',
    15,
    50,
    'ISO 9001:2015, BNBC Certified, BEPZA Registered',
    '/uploads/about/about-main.jpg',
    NOW()
);

-- ================================================
-- ABOUT FEATURES
-- ================================================
INSERT INTO about_features (title, description, icon, display_order, created_at) VALUES
('Expert Team', 'Highly qualified engineers and technicians with extensive industry experience', 'users-cog', 1, NOW()),
('Quality Assurance', 'Strict quality control measures at every stage of project execution', 'certificate', 2, NOW()),
('Timely Delivery', 'Committed to completing projects within scheduled timelines', 'clock', 3, NOW()),
('Cost Effective', 'Competitive pricing without compromising on quality and standards', 'dollar-sign', 4, NOW());

-- ================================================
-- CEO INFORMATION
-- ================================================
INSERT INTO ceo_info (
    name, title, message, image, signature,
    email, phone, linkedin, created_at
) VALUES (
    'Engr. Mohammad Rahman',
    'Founder & CEO',
    'Since our inception in 2009, Honesty Engineering has been committed to delivering excellence in every project we undertake. Our success is built on the foundation of integrity, technical expertise, and unwavering dedication to client satisfaction. We take pride in our team of skilled professionals who bring innovative solutions to complex engineering challenges. As we look to the future, we remain focused on expanding our capabilities while maintaining the core values that have made us a trusted name in the industry.',
    '/uploads/team/ceo.jpg',
    '/uploads/team/ceo-signature.png',
    'ceo@honestyengineering.com',
    '+880 1711-999999',
    'https://linkedin.com/in/mohammad-rahman',
    NOW()
);

-- ================================================
-- SERVICE CATEGORIES
-- ================================================
INSERT INTO service_categories (name, slug, description, icon, color, display_order, created_at) VALUES
('Electrical Works', 'electrical', 'Complete electrical installation and maintenance services', 'bolt', 'yellow-500', 1, NOW()),
('Civil Construction', 'civil', 'RCC and steel structure construction services', 'building', 'blue-500', 2, NOW()),
('Electrical Design', 'design', 'Professional electrical design and layout services', 'drafting-compass', 'purple-500', 3, NOW()),
('Fire Safety', 'fire-safety', 'Comprehensive fire detection and suppression systems', 'fire-extinguisher', 'red-500', 4, NOW()),
('Factory Furniture', 'furniture', 'Custom furniture solutions for industrial facilities', 'couch', 'green-500', 5, NOW()),
('HVAC Systems', 'hvac', 'Heating, ventilation, and air conditioning solutions', 'wind', 'cyan-500', 6, NOW()),
('Plumbing & Sanitary', 'plumbing', 'Complete plumbing and sanitary installations', 'faucet', 'indigo-500', 7, NOW()),
('Interior Works', 'interior', 'Professional interior finishing and decoration', 'paint-roller', 'pink-500', 8, NOW());

-- ================================================
-- SERVICES
-- ================================================
-- Electrical Works
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(1, 'Sub-Station Supply & Installation', 'Complete substation setup with quality equipment and professional installation', 'plug', '["HT/LT Panel Installation", "Transformer Setup", "Cable Laying", "Testing & Commissioning"]', 1, 1, NOW()),
(1, 'PFI, MDB, SDB Supply & Earthing', 'Power factor improvement, distribution boards, and earthing systems', 'network-wired', '["Power Factor Correction", "Distribution Boards", "Standard Earthing", "Deep Boring"]', 1, 2, NOW()),
(1, 'Thermography & Testing', 'Electrical testing and thermal imaging services', 'thermometer', '["Thermography Testing", "Earthing Testing", "Insulation Testing", "Load Testing"]', 0, 3, NOW()),
(1, 'Automation & Instrumentation', 'Industrial automation and control systems', 'microchip', '["PLC Programming", "SCADA Systems", "Control Panels", "Sensor Integration"]', 1, 4, NOW()),
(1, 'Electrical Wiring', 'All types of electrical wiring for industrial and commercial buildings', 'project-diagram', '["Power Wiring", "Lighting Circuits", "Control Wiring", "Data Cabling"]', 0, 5, NOW());

-- Civil Construction
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(2, 'RCC Structure Works', 'Reinforced concrete construction as per BNBC standards', 'hard-hat', '["Foundation Work", "Column & Beam Construction", "Slab Casting", "Quality Testing"]', 1, 6, NOW()),
(2, 'Steel Structure Works', 'Steel fabrication and erection services', 'industry', '["Structural Steel Design", "Fabrication", "Erection", "Welding & Inspection"]', 1, 7, NOW()),
(2, 'Architecture & Design', 'Architectural and structural design services', 'ruler-combined', '["Architectural Plans", "Structural Design", "3D Visualization", "Approval Drawings"]', 0, 8, NOW());

-- Electrical Design
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(3, 'Single Line Diagram (SLD)', 'Electrical single line diagrams as per standards', 'sitemap', '["HT/LT SLD", "Load Calculation", "Cable Sizing", "Protection Coordination"]', 1, 9, NOW()),
(3, 'Electrical Layout Design', 'Complete electrical layout for buildings and factories', 'map', '["Power Layout", "Lighting Layout", "Socket Layout", "CAD Drawings"]', 1, 10, NOW()),
(3, 'Lightning Protection System', 'LPS design and installation as per standards', 'bolt', '["Risk Assessment", "Air Terminal Design", "Down Conductor Layout", "Earthing Design"]', 0, 11, NOW()),
(3, 'Sub-Station Layout Design', 'Substation and earthing layout as per BNBC, RSC, BS-7671 & IEC', 'th', '["Substation Layout", "Earthing Layout", "Cable Trenching", "Equipment Placement"]', 0, 12, NOW());

-- Fire Safety
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(4, 'Fire Detection & Alarm', 'Automatic fire detection and alarm systems', 'bell', '["Smoke Detectors", "Heat Detectors", "Manual Call Points", "Alarm Panels"]', 1, 13, NOW()),
(4, 'Fire Hydrant System', 'Fire hydrant and sprinkler systems', 'fire', '["Fire Pumps", "Hydrant Valves", "Hose Reels", "Sprinkler Heads"]', 1, 14, NOW()),
(4, 'Fire Door & Separation', 'Fire-rated doors and fire separation walls', 'door-closed', '["Fire Doors", "Fire Dampers", "Fire Seals", "Fire Walls"]', 0, 15, NOW()),
(4, 'Gas Suspension System', 'Automatic gas-based fire suppression systems', 'spray-can', '["FM200 Systems", "CO2 Systems", "Gas Detection", "Auto Activation"]', 0, 16, NOW());

-- Factory Furniture
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(5, 'Production Line Furniture', 'Custom furniture for manufacturing facilities', 'chair', '["Workstations", "Storage Racks", "Assembly Tables", "Tool Cabinets"]', 1, 17, NOW()),
(5, 'Office Furniture', 'Complete office furniture solutions', 'desktop', '["Executive Desks", "Office Chairs", "Conference Tables", "Storage Units"]', 0, 18, NOW());

-- HVAC
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(6, 'Central AC System', 'Central air conditioning system design and installation', 'snowflake', '["Chiller Units", "AHU Installation", "Duct Work", "Controls"]', 1, 19, NOW()),
(6, 'Ventilation System', 'Industrial ventilation and exhaust systems', 'fan', '["Exhaust Fans", "Fresh Air Systems", "Duct Design", "Air Quality Control"]', 0, 20, NOW());

-- Plumbing
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(7, 'Water Supply System', 'Complete water supply and distribution system', 'tint', '["Overhead Tank", "Pump Installation", "Pipe Network", "Water Treatment"]', 1, 21, NOW()),
(7, 'Sanitary & Drainage', 'Sanitary installation and drainage systems', 'toilet', '["Sanitary Fixtures", "Drainage Lines", "Septic Tank", "STP Installation"]', 0, 22, NOW());

-- Interior
INSERT INTO services (category_id, title, description, icon, features, is_featured, display_order, created_at) VALUES
(8, 'False Ceiling', 'Gypsum board and false ceiling installation', 'layer-group', '["Grid System", "Gypsum Boards", "Lighting Integration", "Finishing"]', 0, 23, NOW()),
(8, 'Floor & Wall Finishing', 'Floor tiles, wall tiles, and finishing works', 'palette', '["Floor Tiles", "Wall Tiles", "Painting", "Polishing"]', 0, 24, NOW());

-- ================================================
-- PRODUCT CATEGORIES
-- ================================================
INSERT INTO product_categories (name, slug, description, display_order, created_at) VALUES
('Equipment', 'equipment', 'Industrial equipment and machinery', 1, NOW()),
('Electrical', 'electrical', 'Electrical components and materials', 2, NOW()),
('Pumps', 'pumps', 'Industrial and commercial pumps', 3, NOW()),
('Power', 'power', 'Power generation and backup systems', 4, NOW()),
('Safety', 'safety', 'Fire and safety equipment', 5, NOW());

-- ================================================
-- PRODUCTS
-- ================================================
INSERT INTO products (category_id, name, description, specifications, image, price, is_featured, display_order, created_at) VALUES
(1, 'Industrial Boilers', 'High-efficiency industrial boilers for steam generation', '["Capacity: 1-10 TPH", "Pressure: 10-20 Bar", "Fuel: Gas/Oil/Biomass", "Efficiency: 85-92%"]', '/uploads/products/boiler.png', NULL, 1, 1, NOW()),
(2, 'Bus-bars', 'Copper and aluminum bus-bars for electrical distribution', '["Material: Copper/Aluminum", "Current: 100A-6300A", "Standard: IEC 61439", "IP Rating: IP31-IP65"]', '/uploads/products/busbar.png', NULL, 1, 2, NOW()),
(3, 'KSB Submersible Pumps', 'German technology submersible pumps', '["Flow: 5-500 m³/h", "Head: 10-200 m", "Power: 1-100 HP", "Material: SS/CI"]', '/uploads/products/pump.png', NULL, 1, 3, NOW()),
(4, 'Industrial Generators', 'Diesel and gas generators for backup power', '["Capacity: 10-1000 KVA", "Voltage: 415V", "Frequency: 50Hz", "Silent/Open Type"]', '/uploads/products/generator.png', NULL, 1, 4, NOW()),
(5, 'Fire Suppression Systems', 'Automatic fire detection and suppression systems', '["FM200/CO2/Foam", "Automatic Activation", "Manual Override", "Zone Control"]', '/uploads/products/fire-system.png', NULL, 1, 5, NOW()),
(3, 'Centrifugal Pumps', 'End suction and multi-stage centrifugal pumps', '["Flow: 10-1000 m³/h", "Head: 20-150 m", "Power: 5-200 HP", "Horizontal/Vertical"]', '/uploads/products/centrifugal-pump.png', NULL, 0, 6, NOW()),
(2, 'Electric Motors', 'Three-phase induction motors', '["Power: 0.5-500 HP", "Voltage: 415V", "Speed: 1500/3000 RPM", "Efficiency: IE2/IE3"]', '/uploads/products/motor.png', NULL, 0, 7, NOW()),
(2, 'Control Panels', 'Electrical control and distribution panels', '["MCC/PCC/APFC", "IP Rating: IP42-IP65", "Customizable", "Metering Included"]', '/uploads/products/panel.png', NULL, 0, 8, NOW());

-- ================================================
-- PROJECTS
-- ================================================
INSERT INTO projects (
    title, description, client_name, project_type, location,
    completion_date, project_value, featured_image, status,
    is_featured, display_order, created_at
) VALUES
('Rich Cotton Apparels Ltd - Turnkey Project', 'Complete turnkey project including electrical works, civil construction, fire safety, HVAC, and interior finishing for a 5-storey garment factory.', 'Rich Cotton Apparels Ltd', 'Turnkey', 'Gazipur, Bangladesh', '2023-12-15', 150000000, '/uploads/projects/rich-cotton-main.jpg', 'completed', 1, 1, NOW()),
('Philko Sports Ltd - Factory Setup', 'Electrical installation, fire safety system, and MEP works for new sports equipment manufacturing facility.', 'Philko Sports Ltd', 'MEP Works', 'Chittagong, Bangladesh', '2023-08-20', 85000000, '/uploads/projects/philko-main.jpg', 'completed', 1, 2, NOW()),
('Scandex BD Ltd - Industrial Facility', 'Complete electrical system upgrade, substation installation, and automation system for textile factory.', 'Scandex BD Ltd', 'Electrical', 'Narayanganj, Bangladesh', '2023-06-30', 65000000, '/uploads/projects/scandex-main.jpg', 'completed', 1, 3, NOW()),
('Silken Sewing Ltd - Expansion Project', 'Factory expansion with new electrical distribution, HVAC system, and fire safety compliance.', 'Silken Sewing Ltd', 'Expansion', 'Dhaka, Bangladesh', '2024-01-10', 45000000, '/uploads/projects/silken-main.jpg', 'completed', 0, 4, NOW()),
('Bashundhara Group - Commercial Complex', 'Electrical and fire safety systems for 12-storey commercial building.', 'Bashundhara Group', 'Commercial', 'Dhaka, Bangladesh', '2024-03-25', 120000000, '/uploads/projects/bashundhara-main.jpg', 'in-progress', 1, 5, NOW());

-- ================================================
-- CLIENTS
-- ================================================
INSERT INTO clients (name, logo, website, description, display_order, created_at) VALUES
('Rich Cotton Apparels Ltd', '/uploads/clients/rich-cotton.png', 'https://richcotton.com', 'Leading garment manufacturer', 1, NOW()),
('Scandex BD Ltd', '/uploads/clients/scandex.png', 'https://scandex.com', 'Textile and garment exporter', 2, NOW()),
('Silken Sewing Ltd', '/uploads/clients/silken.png', NULL, 'Quality garment manufacturer', 3, NOW()),
('Philko Sports Ltd', '/uploads/clients/philko.png', 'https://philko.com', 'Sports equipment manufacturer', 4, NOW()),
('Bashundhara Group', '/uploads/clients/bashundhara.png', 'https://bashundharagroup.com', 'Leading conglomerate in Bangladesh', 5, NOW()),
('GL Osman Group', '/uploads/clients/gl-osman.png', NULL, 'Industrial manufacturing group', 6, NOW()),
('Advance Group', '/uploads/clients/advance.png', NULL, 'Garment manufacturing group', 7, NOW()),
('SK Dreams', '/uploads/clients/sk-dreams.png', NULL, 'Textile manufacturer', 8, NOW()),
('RP Group', '/uploads/clients/rp-group.png', NULL, 'Industrial conglomerate', 9, NOW()),
('AL Group', '/uploads/clients/al.png', NULL, 'Manufacturing group', 10, NOW()),
('Bangladesh Agricultural University', '/uploads/clients/bau.png', 'https://bau.edu.bd', 'Leading agricultural university', 11, NOW()),
('Pan Pacific Hotels and Resorts', '/uploads/clients/pan-pacific.png', 'https://panpacific.com', 'International hotel chain', 12, NOW()),
('Posmi Sweaters Limited', '/uploads/clients/posmi.png', NULL, 'Sweater manufacturer', 13, NOW()),
('Saadatia Group', '/uploads/clients/saadatia.png', NULL, 'Garment manufacturing', 14, NOW()),
('Hyopshin Bangladesh', '/uploads/clients/hyopshin.png', NULL, 'Korean manufacturing company', 15, NOW());

-- ================================================
-- GALLERY CATEGORIES
-- ================================================
INSERT INTO gallery_categories (name, slug, description, display_order, created_at) VALUES
('Electrical Works', 'electrical', 'Electrical installation projects', 1, NOW()),
('Civil Construction', 'civil', 'Civil construction projects', 2, NOW()),
('Fire Safety', 'fire-safety', 'Fire safety system installations', 3, NOW()),
('HVAC', 'hvac', 'HVAC system projects', 4, NOW()),
('Interior', 'interior', 'Interior finishing projects', 5, NOW()),
('Completed Projects', 'completed', 'Fully completed project photos', 6, NOW());

-- ================================================
-- GALLERY IMAGES
-- ================================================
INSERT INTO gallery (category_id, title, description, image_path, thumbnail_path, is_featured, display_order, created_at) VALUES
-- Electrical Works
(1, 'Substation Installation', 'Complete HT/LT substation installation at Rich Cotton', '/uploads/gallery/electrical-substation-1.jpg', '/uploads/gallery/thumb/electrical-substation-1.jpg', 1, 1, NOW()),
(1, 'Main Distribution Board', 'MDB installation with bus-bar system', '/uploads/gallery/electrical-mdb-1.jpg', '/uploads/gallery/thumb/electrical-mdb-1.jpg', 1, 2, NOW()),
(1, 'Cable Tray Installation', 'Organized cable management system', '/uploads/gallery/electrical-cable-1.jpg', '/uploads/gallery/thumb/electrical-cable-1.jpg', 0, 3, NOW()),

-- Civil Construction
(2, 'Factory Building Construction', 'RCC structure construction for factory', '/uploads/gallery/civil-factory-1.jpg', '/uploads/gallery/thumb/civil-factory-1.jpg', 1, 4, NOW()),
(2, 'Steel Structure Erection', 'Industrial shed steel structure', '/uploads/gallery/civil-steel-1.jpg', '/uploads/gallery/thumb/civil-steel-1.jpg', 1, 5, NOW()),

-- Fire Safety
(3, 'Fire Hydrant System', 'Complete fire hydrant installation', '/uploads/gallery/fire-hydrant-1.jpg', '/uploads/gallery/thumb/fire-hydrant-1.jpg', 1, 6, NOW()),
(3, 'Fire Alarm Panel', 'Addressable fire alarm control panel', '/uploads/gallery/fire-alarm-1.jpg', '/uploads/gallery/thumb/fire-alarm-1.jpg', 0, 7, NOW()),

-- HVAC
(4, 'Central AC Installation', 'VRF system installation for office', '/uploads/gallery/hvac-central-1.jpg', '/uploads/gallery/thumb/hvac-central-1.jpg', 1, 8, NOW()),
(4, 'Duct Work', 'Complete ducting for HVAC system', '/uploads/gallery/hvac-duct-1.jpg', '/uploads/gallery/thumb/hvac-duct-1.jpg', 0, 9, NOW()),

-- Interior
(5, 'False Ceiling Work', 'Gypsum board false ceiling installation', '/uploads/gallery/interior-ceiling-1.jpg', '/uploads/gallery/thumb/interior-ceiling-1.jpg', 0, 10, NOW()),
(5, 'Factory Interior', 'Complete interior finishing for factory', '/uploads/gallery/interior-factory-1.jpg', '/uploads/gallery/thumb/interior-factory-1.jpg', 1, 11, NOW()),

-- Completed Projects
(6, 'Rich Cotton - Completed', 'Completed turnkey project view', '/uploads/gallery/completed-rich-1.jpg', '/uploads/gallery/thumb/completed-rich-1.jpg', 1, 12, NOW()),
(6, 'Philko - Completed', 'Completed factory setup', '/uploads/gallery/completed-philko-1.jpg', '/uploads/gallery/thumb/completed-philko-1.jpg', 1, 13, NOW()),
(6, 'Scandex - Completed', 'Completed electrical project', '/uploads/gallery/completed-scandex-1.jpg', '/uploads/gallery/thumb/completed-scandex-1.jpg', 1, 14, NOW());

-- ================================================
-- END OF SEED DATA
-- ================================================
