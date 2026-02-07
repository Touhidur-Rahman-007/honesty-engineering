<?php
/**
 * File Upload API Endpoint
 * POST /api/upload - Upload single file
 * POST /api/upload?multiple=1 - Upload multiple files
 * DELETE /api/upload?path=xxx - Delete uploaded file
 */

define('CORS_CONFIG_ACCESS', true);
require_once __DIR__ . '/../config/cors.php';
require_once __DIR__ . '/../database/Response.php';

header('Content-Type: application/json; charset=utf-8');

// Get request method
$method = $_SERVER['REQUEST_METHOD'];

// Allow POST, DELETE
if (!in_array($method, ['POST', 'DELETE'])) {
    Response::methodNotAllowed(['POST', 'DELETE']);
}

// Configuration
$uploadBasePath = __DIR__ . '/../../public/uploads/';
$allowedTypes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
    'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
$maxFileSize = 10 * 1024 * 1024; // 10MB

try {
    // POST - Upload file(s)
    if ($method === 'POST') {
        // Check if files were uploaded
        if (empty($_FILES)) {
            Response::badRequest('No file uploaded');
        }

        // Get folder parameter
        $folder = isset($_POST['folder']) ? trim($_POST['folder']) : 'general';
        $folder = preg_replace('/[^a-zA-Z0-9_-]/', '', $folder); // Sanitize folder name
        
        // Create upload directory if doesn't exist
        $uploadDir = $uploadBasePath . $folder . '/';
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $uploadedFiles = [];
        $errors = [];

        // Handle multiple files or single file
        $files = $_FILES['files'] ?? $_FILES['file'] ?? [];
        
        // Normalize files array structure
        if (isset($files['name']) && is_string($files['name'])) {
            // Single file
            $files = [
                'name' => [$files['name']],
                'type' => [$files['type']],
                'tmp_name' => [$files['tmp_name']],
                'error' => [$files['error']],
                'size' => [$files['size']]
            ];
        }

        // Process each file
        $fileCount = count($files['name']);
        for ($i = 0; $i < $fileCount; $i++) {
            $fileName = $files['name'][$i];
            $fileType = $files['type'][$i];
            $fileTmpName = $files['tmp_name'][$i];
            $fileError = $files['error'][$i];
            $fileSize = $files['size'][$i];

            // Check for upload errors
            if ($fileError !== UPLOAD_ERR_OK) {
                $errors[] = "Error uploading $fileName: Upload error code $fileError";
                continue;
            }

            // Validate file type
            if (!in_array($fileType, $allowedTypes)) {
                $errors[] = "File type not allowed for $fileName. Allowed: images and PDF";
                continue;
            }

            // Validate file size
            if ($fileSize > $maxFileSize) {
                $errors[] = "File $fileName is too large. Maximum size: 10MB";
                continue;
            }

            // Generate unique filename
            $fileExtension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $originalName = pathinfo($fileName, PATHINFO_FILENAME);
            $originalName = preg_replace('/[^a-zA-Z0-9_-]/', '-', $originalName); // Sanitize filename
            $uniqueName = $originalName . '-' . time() . '-' . uniqid() . '.' . $fileExtension;
            $targetPath = $uploadDir . $uniqueName;

            // Move uploaded file
            if (move_uploaded_file($fileTmpName, $targetPath)) {
                // Return public URL
                $relativePath = '/honesty-engineering/uploads/' . $folder . '/' . $uniqueName;
                $uploadedFiles[] = [
                    'original_name' => $fileName,
                    'filename' => $uniqueName,
                    'path' => $relativePath,
                    'url' => $relativePath,
                    'size' => $fileSize,
                    'type' => $fileType
                ];
            } else {
                $errors[] = "Failed to move uploaded file: $fileName";
            }
        }

        // Prepare response
        if (empty($uploadedFiles) && !empty($errors)) {
            Response::badRequest('All uploads failed', ['errors' => $errors]);
        }

        $response = [
            'files' => $uploadedFiles,
            'count' => count($uploadedFiles)
        ];

        if (!empty($errors)) {
            $response['errors'] = $errors;
        }

        Response::success($response);
    }

    // DELETE - Delete uploaded file
    elseif ($method === 'DELETE') {
        $path = isset($_GET['path']) ? trim($_GET['path']) : '';

        if (empty($path)) {
            Response::badRequest('File path is required');
        }

        // Security: Ensure path is within uploads directory
        if (strpos($path, '/honesty-engineering/uploads/') !== 0) {
            Response::badRequest('Invalid file path');
        }

        // Remove leading slash and construct full path
        $relativePath = str_replace('/honesty-engineering/', '', $path);
        $fullPath = __DIR__ . '/../../public/' . $relativePath;

        // Check if file exists
        if (!file_exists($fullPath)) {
            Response::notFound('File not found');
        }

        // Security: Ensure file is within uploads directory
        $realPath = realpath($fullPath);
        $realUploadPath = realpath($uploadBasePath);
        
        if (strpos($realPath, $realUploadPath) !== 0) {
            Response::badRequest('Invalid file path');
        }

        // Delete file
        if (unlink($fullPath)) {
            Response::success(['message' => 'File deleted successfully', 'path' => $path]);
        } else {
            Response::serverError('Failed to delete file');
        }
    }

} catch (Exception $e) {
    error_log("Upload API Error: " . $e->getMessage());
    Response::serverError('An error occurred: ' . $e->getMessage());
}
