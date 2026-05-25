<?php
// backend/config/database.php

class Database {
    // Database credentials
    private $host = "localhost";
    private $db_name = "electromart_db";
    private $username = "root";
    private $password = ""; // Default XAMPP password is empty
    public $conn;

    // Get database connection
    public function getConnection() {
        $this->conn = null;

        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password
            );
            // Set PDO error mode to exception
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            // Return associative arrays by default
            $this->conn->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch(PDOException $exception) {
            // In a production environment, this should be logged instead of displayed
            error_log("Connection error: " . $exception->getMessage());
            die(json_encode([
                "success" => false,
                "message" => "Database connection failed."
            ]));
        }

        return $this->conn;
    }
}
?>
