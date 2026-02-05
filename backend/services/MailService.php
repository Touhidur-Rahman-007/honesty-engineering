<?php
/**
 * Mail Service Class
 * Handles SMTP email sending without external dependencies
 * Loads configuration from .env file
 */

class MailService {
    private $config;

    public function __construct() {
        $this->config = [];
        // Load environment variables
        $this->loadEnv();
    }

    /**
     * Load environment variables from .env file
     */
    private function loadEnv() {
        $envFile = __DIR__ . '/../.env';
        
        if (!file_exists($envFile)) {
            throw new Exception('.env file not found. Please create it from .env.example');
        }

        $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
        
        foreach ($lines as $line) {
            // Skip comments
            if (strpos(trim($line), '#') === 0) {
                continue;
            }

            // Parse key=value
            if (strpos($line, '=') !== false) {
                list($key, $value) = explode('=', $line, 2);
                $key = trim($key);
                $value = trim($value);
                
                // Remove quotes if present
                $value = trim($value, '"\'');
                
                if ($key !== '') {
                    $this->config[$key] = $value;
                }
            }
        }

        $required = [
            'SMTP_HOST',
            'SMTP_PORT',
            'SMTP_ENCRYPTION',
            'SMTP_USERNAME',
            'SMTP_PASSWORD',
            'SMTP_FROM_EMAIL',
            'SMTP_FROM_NAME',
            'ADMIN_NOTIFICATION_EMAIL'
        ];

        foreach ($required as $key) {
            if (empty($this->config[$key])) {
                throw new Exception("Missing required .env value: {$key}");
            }
        }
    }

    /**
     * Send email notification to admin about new contact inquiry
     * 
     * @param array $inquiry Contact inquiry data
     * @return bool Success status
     */
    public function sendAdminNotification($inquiry) {
        try {
            $adminEmail = $this->config['ADMIN_NOTIFICATION_EMAIL'];
            
            // Email subject
            $subject = 'New Contact Inquiry: ' . ($inquiry['subject'] ?? 'No Subject');
            
            // Email body
            $body = $this->getAdminNotificationTemplate($inquiry);
            
            // Plain text alternative
            $altBody = $this->getPlainTextBody($inquiry);

            $replyToEmail = !empty($inquiry['email']) ? $inquiry['email'] : null;
            $replyToName = !empty($inquiry['name']) ? $inquiry['name'] : null;

            $result = $this->sendSmtpEmail(
                $adminEmail,
                'Admin',
                $subject,
                $body,
                $altBody,
                $replyToEmail,
                $replyToName
            );
            
            return $result;
            
        } catch (Exception $e) {
            error_log("Failed to send admin notification: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Send reply email to customer
     * 
     * @param string $toEmail Customer email
     * @param string $toName Customer name
     * @param string $subject Email subject
     * @param string $replyMessage Reply message
     * @param array $originalInquiry Original inquiry data for context
     * @return bool Success status
     */
    public function sendReplyEmail($toEmail, $toName, $subject, $replyMessage, $originalInquiry = []) {
        try {
            $body = $this->getReplyTemplate($toName, $replyMessage, $originalInquiry);
            
            // Plain text alternative
            $altBody = strip_tags($replyMessage);

            $result = $this->sendSmtpEmail(
                $toEmail,
                $toName,
                'Re: ' . $subject,
                $body,
                $altBody
            );
            
            return $result;
            
        } catch (Exception $e) {
            error_log("Failed to send reply email: " . $e->getMessage());
            throw new Exception("Failed to send email: " . $e->getMessage());
        }
    }

    /**
     * Send an email via SMTP without external dependencies
     */
    private function sendSmtpEmail($toEmail, $toName, $subject, $htmlBody, $textBody, $replyToEmail = null, $replyToName = null) {
        $host = $this->config['SMTP_HOST'];
        $port = (int)$this->config['SMTP_PORT'];
        $encryption = strtolower($this->config['SMTP_ENCRYPTION']);
        $username = $this->config['SMTP_USERNAME'];
        $password = $this->config['SMTP_PASSWORD'];
        $fromEmail = $this->config['SMTP_FROM_EMAIL'];
        $fromName = $this->config['SMTP_FROM_NAME'];

        error_log('SMTP Connection attempt: ' . $host . ':' . $port . ' with encryption: ' . $encryption);

        $socketHost = $host;
        if ($encryption === 'ssl') {
            $socketHost = 'ssl://' . $host;
        }

        $fp = @stream_socket_client($socketHost . ':' . $port, $errno, $errstr, 20);
        if (!$fp) {
            error_log('SMTP Connection failed: ' . $errstr . ' (' . $errno . ')');
            // Try fallback to port 587 with TLS if SSL failed
            if ($encryption === 'ssl' && $port === 465) {
                error_log('Trying fallback: TLS on port 587');
                $fp = @stream_socket_client($host . ':587', $errno, $errstr, 20);
                if ($fp) {
                    $encryption = 'tls';
                    $port = 587;
                } else {
                    throw new Exception("SMTP connection failed on both 465 and 587: $errstr ($errno)");
                }
            } else {
                throw new Exception("SMTP connection failed: $errstr ($errno)");
            }
        }

        $this->expectResponse($fp, 220);
        $this->sendCommand($fp, 'EHLO ' . $this->getServerName());
        $this->expectResponse($fp, 250);

        if ($encryption === 'tls' || $encryption === 'starttls') {
            $this->sendCommand($fp, 'STARTTLS');
            $this->expectResponse($fp, 220);
            if (!stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                throw new Exception('Failed to enable TLS encryption');
            }
            $this->sendCommand($fp, 'EHLO ' . $this->getServerName());
            $this->expectResponse($fp, 250);
        }

        error_log('SMTP Authenticating as: ' . $username);
        $this->sendCommand($fp, 'AUTH LOGIN');
        $this->expectResponse($fp, 334);
        $this->sendCommand($fp, base64_encode($username));
        $this->expectResponse($fp, 334);
        $this->sendCommand($fp, base64_encode($password));
        try {
            $this->expectResponse($fp, 235);
            error_log('SMTP Authentication successful');
        } catch (Exception $e) {
            error_log('SMTP Authentication failed: ' . $e->getMessage());
            throw $e;
        }

        $this->sendCommand($fp, 'MAIL FROM:<' . $fromEmail . '>');
        $this->expectResponse($fp, 250);
        $this->sendCommand($fp, 'RCPT TO:<' . $toEmail . '>');
        $this->expectResponse($fp, 250);

        $this->sendCommand($fp, 'DATA');
        $this->expectResponse($fp, 354);

        $message = $this->buildMimeMessage($toEmail, $toName, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $replyToEmail, $replyToName);
        $this->sendCommand($fp, $message . "\r\n.");
        $this->expectResponse($fp, 250);

        $this->sendCommand($fp, 'QUIT');
        fclose($fp);

        error_log('Email sent successfully to: ' . $toEmail);
        return true;
    }

    private function buildMimeMessage($toEmail, $toName, $subject, $htmlBody, $textBody, $fromEmail, $fromName, $replyToEmail, $replyToName) {
        $boundary = 'bnd_' . md5(uniqid((string)mt_rand(), true));
        $encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';

        $fromHeader = $this->formatAddress($fromEmail, $fromName);
        $toHeader = $this->formatAddress($toEmail, $toName);

        $headers = [];
        $headers[] = 'From: ' . $fromHeader;
        $headers[] = 'To: ' . $toHeader;
        if ($replyToEmail) {
            $headers[] = 'Reply-To: ' . $this->formatAddress($replyToEmail, $replyToName);
        }
        $headers[] = 'MIME-Version: 1.0';
        $headers[] = 'Content-Type: multipart/alternative; boundary="' . $boundary . '"';
        $headers[] = 'Content-Transfer-Encoding: 8bit';

        $body = [];
        $body[] = '--' . $boundary;
        $body[] = 'Content-Type: text/plain; charset=UTF-8';
        $body[] = 'Content-Transfer-Encoding: 8bit';
        $body[] = '';
        $body[] = $textBody;
        $body[] = '';
        $body[] = '--' . $boundary;
        $body[] = 'Content-Type: text/html; charset=UTF-8';
        $body[] = 'Content-Transfer-Encoding: 8bit';
        $body[] = '';
        $body[] = $htmlBody;
        $body[] = '';
        $body[] = '--' . $boundary . '--';

        return 'Subject: ' . $encodedSubject . "\r\n" . implode("\r\n", $headers) . "\r\n\r\n" . implode("\r\n", $body);
    }

    private function formatAddress($email, $name = null) {
        $email = trim($email);
        if ($name) {
            $name = trim($name);
            $encodedName = '=?UTF-8?B?' . base64_encode($name) . '?=';
            return $encodedName . ' <' . $email . '>';
        }
        return $email;
    }

    private function sendCommand($fp, $command) {
        fwrite($fp, $command . "\r\n");
    }

    private function expectResponse($fp, $expectedCode) {
        $response = '';
        while ($line = fgets($fp, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] === ' ') {
                break;
            }
        }

        $code = (int)substr($response, 0, 3);
        if ($code !== $expectedCode && (int)floor($expectedCode / 100) !== (int)floor($code / 100)) {
            throw new Exception('SMTP error: ' . trim($response));
        }
    }

    private function getServerName() {
        $host = $_SERVER['SERVER_NAME'] ?? 'localhost';
        return $host;
    }

    /**
     * Get admin notification email template
     * 
     * @param array $inquiry Contact inquiry data
     * @return string HTML email body
     */
    private function getAdminNotificationTemplate($inquiry) {
        $name = htmlspecialchars($inquiry['name'] ?? 'N/A');
        $email = htmlspecialchars($inquiry['email'] ?? 'N/A');
        $phone = htmlspecialchars($inquiry['phone'] ?? 'N/A');
        $subject = htmlspecialchars($inquiry['subject'] ?? 'N/A');
        $message = nl2br(htmlspecialchars($inquiry['message'] ?? 'N/A'));
        $createdAt = $inquiry['created_at'] ?? date('Y-m-d H:i:s');
        $inquiryId = $inquiry['id'] ?? 'N/A';
        $baseUrl = rtrim($this->config['BASE_URL'] ?? '', '/');
        $adminLink = $baseUrl ? $baseUrl . '/adminPanel/index.html' : '';
        $adminLinkBlock = $adminLink
            ? '<div style="text-align: center;"><a href="' . htmlspecialchars($adminLink) . '" class="button">View in Admin Panel</a></div>'
            : '';

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .field { margin-bottom: 15px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; margin-top: 5px; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
        .button { display: inline-block; padding: 10px 20px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>🔔 New Contact Inquiry</h2>
        </div>
        <div class="content">
            <p style="color: #667eea; font-weight: bold;">You have received a new contact inquiry from your website.</p>
            
            <div class="field">
                <div class="label">📝 Inquiry ID:</div>
                <div class="value">#$inquiryId</div>
            </div>
            
            <div class="field">
                <div class="label">👤 Name:</div>
                <div class="value">$name</div>
            </div>
            
            <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:$email">$email</a></div>
            </div>
            
            <div class="field">
                <div class="label">📱 Phone:</div>
                <div class="value">$phone</div>
            </div>
            
            <div class="field">
                <div class="label">📋 Subject:</div>
                <div class="value">$subject</div>
            </div>
            
            <div class="field">
                <div class="label">💬 Message:</div>
                <div class="value" style="background: white; padding: 15px; border-left: 4px solid #667eea; border-radius: 3px;">$message</div>
            </div>
            
            <div class="field">
                <div class="label">🕐 Received At:</div>
                <div class="value">$createdAt</div>
            </div>
            $adminLinkBlock

        </div>
        <div class="footer">
            <p>This is an automated notification from Honesty Engineering website.</p>
            <p>© 2026 Honesty Engineering. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Get reply email template
     * 
     * @param string $name Customer name
     * @param string $replyMessage Reply message
     * @param array $originalInquiry Original inquiry for context
     * @return string HTML email body
     */
    private function getReplyTemplate($name, $replyMessage, $originalInquiry) {
        $name = htmlspecialchars($name);
        $message = nl2br(htmlspecialchars($replyMessage));
        
        $originalContext = '';
        if (!empty($originalInquiry['message'])) {
            $originalMsg = nl2br(htmlspecialchars($originalInquiry['message']));
            $originalSubject = htmlspecialchars($originalInquiry['subject'] ?? 'Your Inquiry');
            $originalContext = <<<HTML
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #ddd;">
                <p style="color: #888; font-size: 12px; font-weight: bold;">ORIGINAL MESSAGE:</p>
                <div style="color: #666; font-size: 12px;">
                    <p><strong>Subject:</strong> $originalSubject</p>
                    <p>$originalMsg</p>
                </div>
            </div>
HTML;
        }

        return <<<HTML
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #66eaa8 0%, #316e39 100%); color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
        .footer { background: #333; color: white; padding: 15px; text-align: center; font-size: 12px; border-radius: 0 0 5px 5px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h2>Honesty Engineering</h2>
        </div>
        <div class="content">
            <p>Dear $name,</p>
            
            <p>Thank you for contacting Honesty Engineering. We have received your inquiry and here is our response:</p>
            
            <div style="background: white; padding: 15px; border-left: 4px solid #667eea; border-radius: 3px; margin: 20px 0;">
                $message
            </div>
            
            <p>If you have any further questions, please don't hesitate to reach out to us.</p>
            
            <p>Best regards,<br>
            <strong>Honesty Engineering Team</strong></p>
            
            $originalContext
        </div>
        <div class="footer">
            <p><strong>Honesty Engineering</strong></p>
            <p>📧 info@honestyengineeringbd.com | 📱 Contact us for more information</p>
            <p>© 2026 Honesty Engineering. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
HTML;
    }

    /**
     * Get plain text version of admin notification
     * 
     * @param array $inquiry Contact inquiry data
     * @return string Plain text email body
     */
    private function getPlainTextBody($inquiry) {
        $name = $inquiry['name'] ?? 'N/A';
        $email = $inquiry['email'] ?? 'N/A';
        $phone = $inquiry['phone'] ?? 'N/A';
        $subject = $inquiry['subject'] ?? 'N/A';
        $message = $inquiry['message'] ?? 'N/A';
        $createdAt = $inquiry['created_at'] ?? date('Y-m-d H:i:s');

        return <<<TEXT
NEW CONTACT INQUIRY

Name: $name
Email: $email
Phone: $phone
Subject: $subject

Message:
$message

Received At: $createdAt

---
This is an automated notification from Honesty Engineering website.
TEXT;
    }
}
