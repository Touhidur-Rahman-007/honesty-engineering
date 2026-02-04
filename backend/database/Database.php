<?php
/**
 * Database Connection Class
 * Handles all database operations using PDO
 */

class Database {
    private $host;
    private $db_name;
    private $username;
    private $password;
    private $charset;
    private $conn;

    public function __construct() {
        // Load configuration
        define('DB_CONFIG_ACCESS', true);
        $config = require_once __DIR__ . '/../config/dbConn.php';
        
        $this->host = $config['host'];
        $this->db_name = $config['database'];
        $this->username = $config['username'];
        $this->password = $config['password'];
        $this->charset = $config['charset'];
    }

    /**
     * Get database connection
     * @return PDO|null
     */
    public function getConnection() {
        $this->conn = null;

        try {
            $dsn = "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=" . $this->charset;
            
            $this->conn = new PDO($dsn, $this->username, $this->password);
            
            // Set PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            
            // Set default fetch mode
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            
            // Disable emulated prepared statements
            $this->conn->setAttribute(PDO::ATTR_EMULATE_PREPARES, false);
            
        } catch(PDOException $e) {
            error_log("Connection Error: " . $e->getMessage());
            return null;
        }

        return $this->conn;
    }

    /**
     * Execute a query and return results
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return array|false
     */
    public function query($query, $params = []) {
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return $stmt->fetchAll();
        } catch(PDOException $e) {
            error_log("Query Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Execute a query and return single row
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return array|false
     */
    public function queryOne($query, $params = []) {
        try {
            $stmt = $this->conn->prepare($query);
            $stmt->execute($params);
            return $stmt->fetch();
        } catch(PDOException $e) {
            error_log("Query Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Execute an INSERT, UPDATE, or DELETE query
     * @param string $query SQL query
     * @param array $params Parameters for prepared statement
     * @return int|false Last insert ID or number of affected rows
     */
    public function execute($query, $params = []) {
        try {
            $stmt = $this->conn->prepare($query);
            $result = $stmt->execute($params);
            
            if ($result) {
                // Return last insert ID for INSERT queries
                if (stripos($query, 'INSERT') === 0) {
                    return $this->conn->lastInsertId();
                }
                // Return affected rows for UPDATE/DELETE
                return $stmt->rowCount();
            }
            
            return false;
        } catch(PDOException $e) {
            error_log("Execute Error: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Begin transaction
     */
    public function beginTransaction() {
        return $this->conn->beginTransaction();
    }

    /**
     * Commit transaction
     */
    public function commit() {
        return $this->conn->commit();
    }

    /**
     * Rollback transaction
     */
    public function rollback() {
        return $this->conn->rollBack();
    }

    /**
     * Close connection
     */
    public function close() {
        $this->conn = null;
    }
}
