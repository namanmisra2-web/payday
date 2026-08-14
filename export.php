<?php
require __DIR__ . '/config.php';
requireAdminLogin();

header('Content-Type: application/vnd.ms-excel; charset=utf-8');
header('Content-Disposition: attachment; filename="usa_lendings_applications.csv"');

$result = $conn->query('SELECT id, loan_amount, first_name, last_name, date_of_birth, phone, email, bank_name, routing_number, account_number, created_at FROM loan_applications ORDER BY created_at DESC');

$fh = fopen('php://output', 'w');

fwrite($fh, "\xEF\xBB\xBF");

fputcsv($fh, ['ID', 'Loan Amount', 'First Name', 'Last Name', 'Date of Birth', 'Phone', 'Email', 'Bank Name', 'Routing Number', 'Account Number', 'Submitted At']);

if ($result && $result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        fputcsv($fh, [
            $row['id'],
            $row['loan_amount'],
            $row['first_name'],
            $row['last_name'],
            $row['date_of_birth'],
            $row['phone'],
            $row['email'],
            $row['bank_name'],
            $row['routing_number'],
            $row['account_number'],
            $row['created_at']
        ]);
    }
}

fclose($fh);
$conn->close();
