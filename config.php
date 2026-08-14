<?php
session_start();

// Change these credentials after setup if you want a custom admin login.
$adminUsername = 'admin';
$adminPassword = 'admin123';

// Update these values if your MySQL credentials are different.
// Create the database manually first, then adjust the name below if needed.
$dbHost = 'localhost';
$dbUser = 'root';
$dbPass = '';
$dbName = 'usa_lendings_db';

$conn = new mysqli($dbHost, $dbUser, $dbPass, $dbName);

if ($conn->connect_error) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed. Create the database named "usa_lendings_db" or update the credentials in config.php.'
    ]);
    exit;
}

$conn->set_charset('utf8mb4');

function requireAdminLogin(): void
{
    if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
        header('Location: login.php');
        exit;
    }
}
