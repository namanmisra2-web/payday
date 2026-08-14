CREATE DATABASE IF NOT EXISTS usa_lendings_db;
USE usa_lendings_db;

CREATE TABLE IF NOT EXISTS loan_applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_amount DECIMAL(10,2) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(150) NOT NULL,
    bank_name VARCHAR(150) NOT NULL,
    routing_number VARCHAR(20) NOT NULL,
    account_number VARCHAR(40) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loan_applications_created_at ON loan_applications(created_at DESC);
