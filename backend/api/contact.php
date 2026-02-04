<?php
/**
 * Contact Form API Endpoint
 * POST /api/contact - Submit contact form
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    Response::methodNotAllowed(['POST']);
}

try {
    // Get POST data
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Validate required fields
    $errors = [];
    
    if (empty($input['name'])) {
        $errors['name'] = 'Name is required';
    }
    
    if (empty($input['email'])) {
        $errors['email'] = 'Email is required';
    } elseif (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $errors['email'] = 'Invalid email format';
    }
    
    if (empty($input['message'])) {
        $errors['message'] = 'Message is required';
    }
    
    if (!empty($errors)) {
        Response::validationError($errors);
    }
    
    // Sanitize input
    $name = htmlspecialchars(trim($input['name']), ENT_QUOTES, 'UTF-8');
    $email = filter_var(trim($input['email']), FILTER_SANITIZE_EMAIL);
    $phone = isset($input['phone']) ? htmlspecialchars(trim($input['phone']), ENT_QUOTES, 'UTF-8') : null;
    $subject = isset($input['subject']) ? htmlspecialchars(trim($input['subject']), ENT_QUOTES, 'UTF-8') : null;
    $message = htmlspecialchars(trim($input['message']), ENT_QUOTES, 'UTF-8');
    
    // Get client info
    $ipAddress = $_SERVER['REMOTE_ADDR'] ?? null;
    $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? null;
    
    // Insert into database
    $database = new Database();
    $db = $database->getConnection();
    
    if (!$db) {
        Response::serverError('Database connection failed');
    }
    
    $query = "
        INSERT INTO contact_inquiries 
        (name, email, phone, subject, message, ip_address, user_agent, status)
        VALUES 
        (:name, :email, :phone, :subject, :message, :ip_address, :user_agent, 'new')
    ";
    
    $params = [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message,
        'ip_address' => $ipAddress,
        'user_agent' => $userAgent,
    ];
    
    $insertId = $database->execute($query, $params);
    
    if ($insertId) {
        // Optional: Send email notification to admin
        // mail($adminEmail, "New Contact Inquiry", $message, "From: $email");
        
        Response::success(
            ['id' => $insertId],
            'Thank you for contacting us. We will get back to you soon!',
            201
        );
    } else {
        Response::serverError('Failed to submit contact form');
    }
    
} catch (Exception $e) {
    error_log("Contact API Error: " . $e->getMessage());
    Response::serverError('An error occurred while submitting the form');
}
