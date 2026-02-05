<?php
/**
 * Response Helper Class
 * Handles JSON API responses
 */

class Response {
    
    /**
     * Send success response
     * @param mixed $data Data to send
     * @param string $message Optional success message
     * @param int $code HTTP status code
     */
    public static function success($data, $message = null, $code = 200) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => true,
            'data' => $data
        ];
        
        if ($message) {
            $response['message'] = $message;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Send error response
     * @param string $error Error message
     * @param int $code HTTP status code
     * @param array $details Optional error details
     */
    public static function error($error, $code = 400, $details = null) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        
        $response = [
            'success' => false,
            'error' => $error,
            'code' => $code
        ];
        
        if ($details) {
            $response['details'] = $details;
        }
        
        echo json_encode($response, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
        exit;
    }

    /**
     * Send validation error response
     * @param array $errors Array of validation errors
     */
    public static function validationError($errors) {
        self::error('Validation failed', 422, $errors);
    }

    /**
     * Send not found response
     * @param string $resource Resource name
     */
    public static function notFound($resource = 'Resource') {
        self::error($resource . ' not found', 404);
    }

    /**
     * Send unauthorized response
     */
    public static function unauthorized($message = 'Unauthorized access') {
        self::error($message, 401);
    }

    /**
     * Send forbidden response
     */
    public static function forbidden($message = 'Access forbidden') {
        self::error($message, 403);
    }

    /**
     * Send method not allowed response
     */
    public static function methodNotAllowed($allowed = []) {
        http_response_code(405);
        header('Allow: ' . implode(', ', $allowed));
        self::error('Method not allowed', 405);
    }

    /**
     * Send server error response
     */
    public static function serverError($message = 'Internal server error') {
        self::error($message, 500);
    }

    /**
     * Send bad request response
     * @param string $message Error message
     * @param array $details Optional error details
     */
    public static function badRequest($message = 'Bad request', $details = null) {
        self::error($message, 400, $details);
    }

    /**
     * Send created response
     * @param mixed $data Data to send
     * @param string $message Optional success message
     */
    public static function created($data, $message = null) {
        self::success($data, $message, 201);
    }
}
