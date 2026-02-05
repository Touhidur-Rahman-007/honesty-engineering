<?php
/**
 * Contact API Endpoint
 * POST /api/contact - Submit contact form
 * GET /api/contact?action=list
 * GET /api/contact?action=view&id={id}
 * POST /api/contact?action=reply
 * POST /api/contact?action=archive
 * POST /api/contact?action=delete
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Database.php';
require_once __DIR__ . '/../database/Response.php';
require_once __DIR__ . '/../services/MailService.php';

header('Content-Type: application/json; charset=utf-8');

$method = $_SERVER['REQUEST_METHOD'];
$action = isset($_GET['action']) ? trim($_GET['action']) : '';

if (!in_array($method, ['GET', 'POST'])) {
    Response::methodNotAllowed(['GET', 'POST']);
}

try {
    $database = new Database();
    $db = $database->getConnection();

    if (!$db) {
        Response::serverError('Database connection failed');
    }

    if ($method === 'GET') {
        if ($action === 'view') {
            handleView($database);
        }

        if ($action === 'list') {
            handleList($database);
        }

        Response::badRequest('Invalid action');
    }

    if ($method === 'POST') {
        if ($action === 'reply') {
            handleReply($database);
        }

        if ($action === 'archive') {
            handleArchive($database);
        }

        if ($action === 'delete') {
            handleDelete($database);
        }

        if ($action === '') {
            handleCreate($database);
        }

        Response::badRequest('Invalid action');
    }
} catch (Exception $e) {
    error_log('Contact API Error: ' . $e->getMessage());
    Response::serverError('An error occurred');
}

function handleCreate(Database $database) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        Response::badRequest('Invalid JSON payload');
    }

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

    $name = trim($input['name']);
    $email = trim($input['email']);
    $phone = isset($input['phone']) ? trim($input['phone']) : null;
    $subject = isset($input['subject']) ? trim($input['subject']) : null;
    $message = trim($input['message']);

    $query = "
        INSERT INTO contact_inquiries 
        (name, email, phone, subject, message, status, created_at)
        VALUES 
        (:name, :email, :phone, :subject, :message, 'new', NOW())
    ";

    $params = [
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message
    ];

    $insertId = $database->execute($query, $params);

    if (!$insertId) {
        Response::serverError('Failed to submit contact form');
    }

    $inquiry = [
        'id' => $insertId,
        'name' => $name,
        'email' => $email,
        'phone' => $phone,
        'subject' => $subject,
        'message' => $message,
        'created_at' => date('Y-m-d H:i:s')
    ];

    try {
        $mailer = new MailService();
        $mailer->sendAdminNotification($inquiry);
    } catch (Exception $e) {
        error_log('Admin notification error: ' . $e->getMessage());
    }

    Response::success(
        ['id' => $insertId],
        'Thank you for contacting us. We will get back to you soon!',
        201
    );
}

function handleList(Database $database) {
    $page = isset($_GET['page']) ? max(1, intval($_GET['page'])) : 1;
    $limit = isset($_GET['limit']) ? max(1, min(100, intval($_GET['limit']))) : 10;
    $status = isset($_GET['status']) ? trim($_GET['status']) : '';

    $offset = ($page - 1) * $limit;

    $whereSql = '';
    $params = [];

    if ($status !== '') {
        $allowedStatus = ['new', 'read', 'replied', 'archived'];
        if (!in_array($status, $allowedStatus, true)) {
            Response::badRequest('Invalid status');
        }
        $whereSql = 'WHERE status = :status';
        $params['status'] = $status;
    }

    $countQuery = "SELECT COUNT(*) as total FROM contact_inquiries $whereSql";
    $countResult = $database->queryOne($countQuery, $params);
    $total = $countResult ? intval($countResult['total']) : 0;

    $query = "
        SELECT * FROM contact_inquiries
        $whereSql
        ORDER BY created_at DESC
        LIMIT :limit OFFSET :offset
    ";

    $db = $database->getConnection();
    $stmt = $db->prepare($query);

    if ($status !== '') {
        $stmt->bindValue(':status', $status, PDO::PARAM_STR);
    }
    $stmt->bindValue(':limit', $limit, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->execute();
    $inquiries = $stmt->fetchAll();

    Response::success([
        'items' => $inquiries,
        'pagination' => [
            'page' => $page,
            'limit' => $limit,
            'total' => $total,
            'total_pages' => $limit > 0 ? (int)ceil($total / $limit) : 0
        ]
    ]);
}

function handleView(Database $database) {
    $id = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($id <= 0) {
        Response::badRequest('Invalid ID');
    }

    $inquiry = $database->queryOne(
        'SELECT * FROM contact_inquiries WHERE id = :id',
        ['id' => $id]
    );

    if (!$inquiry) {
        Response::notFound('Inquiry');
    }

    // Mark as read if new
    if ($inquiry['status'] === 'new') {
        $database->execute(
            'UPDATE contact_inquiries SET status = "read" WHERE id = :id',
            ['id' => $id]
        );
        $inquiry['status'] = 'read';
    }

    // Fetch all replies for this inquiry
    $replies = $database->query(
        'SELECT * FROM inquiry_replies WHERE inquiry_id = :inquiry_id ORDER BY sent_at ASC',
        ['inquiry_id' => $id]
    );
    
    $inquiry['replies'] = $replies ?: [];

    Response::success($inquiry);
}

function handleReply(Database $database) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        Response::badRequest('Invalid JSON payload');
    }

    $inquiryId = isset($input['inquiry_id']) ? intval($input['inquiry_id']) : 0;
    $replyMessage = isset($input['reply_message']) ? trim($input['reply_message']) : '';

    if ($inquiryId <= 0) {
        Response::badRequest('Invalid inquiry_id');
    }

    if ($replyMessage === '') {
        Response::badRequest('reply_message is required');
    }

    $inquiry = $database->queryOne(
        'SELECT * FROM contact_inquiries WHERE id = :id',
        ['id' => $inquiryId]
    );

    if (!$inquiry) {
        Response::notFound('Inquiry');
    }

    $subject = $inquiry['subject'] ?: 'Your Inquiry';

    try {
        $mailer = new MailService();
        $result = $mailer->sendReplyEmail($inquiry['email'], $inquiry['name'], $subject, $replyMessage, $inquiry);
        
        if (!$result) {
            throw new Exception('Email sending returned false');
        }
        
        // Store reply in database
        $database->execute(
            'INSERT INTO inquiry_replies (inquiry_id, reply_message, sent_by) VALUES (:inquiry_id, :reply_message, :sent_by)',
            [
                'inquiry_id' => $inquiryId,
                'reply_message' => $replyMessage,
                'sent_by' => 'Admin'
            ]
        );
        
        // Update inquiry status to replied
        $database->execute(
            'UPDATE contact_inquiries SET status = "replied" WHERE id = :id',
            ['id' => $inquiryId]
        );
        
    } catch (Exception $e) {
        error_log('Reply email error: ' . $e->getMessage());
        error_log('Stack trace: ' . $e->getTraceAsString());
        Response::serverError('Failed to send reply: ' . $e->getMessage());
    }

    Response::success(['message' => 'Reply sent successfully']);
}

function handleArchive(Database $database) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        Response::badRequest('Invalid JSON payload');
    }

    $id = isset($input['id']) ? intval($input['id']) : 0;

    if ($id <= 0) {
        Response::badRequest('Invalid ID');
    }

    $affected = $database->execute(
        'UPDATE contact_inquiries SET status = "archived" WHERE id = :id',
        ['id' => $id]
    );

    if ($affected === false) {
        Response::serverError('Failed to archive inquiry');
    }

    Response::success(['message' => 'Inquiry archived']);
}

function handleDelete(Database $database) {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!is_array($input)) {
        Response::badRequest('Invalid JSON payload');
    }

    $id = isset($input['id']) ? intval($input['id']) : 0;

    if ($id <= 0) {
        Response::badRequest('Invalid ID');
    }

    $affected = $database->execute(
        'DELETE FROM contact_inquiries WHERE id = :id',
        ['id' => $id]
    );

    if ($affected === false) {
        Response::serverError('Failed to delete inquiry');
    }

    Response::success(['message' => 'Inquiry deleted']);
}
