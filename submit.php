<?php
require __DIR__ . '/config.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

$rawBody = file_get_contents('php://input');
$data = json_decode($rawBody, true);

if (!is_array($data) || empty($data)) {
    parse_str($rawBody, $data);
}

$requiredFields = ['loanAmount', 'firstName', 'lastName', 'dateOfBirth', 'phone', 'email', 'bankName', 'routingNumber', 'accountNumber'];
foreach ($requiredFields as $field) {
    if (!isset($data[$field]) || trim((string) $data[$field]) === '') {
        http_response_code(422);
        echo json_encode(['success' => false, 'message' => "Missing required field: {$field}"]);
        exit;
    }
}

$loanAmount = (float) preg_replace('/[^\d.]/', '', (string) $data['loanAmount']);
$firstName = trim((string) $data['firstName']);
$lastName = trim((string) $data['lastName']);
$dateOfBirth = trim((string) $data['dateOfBirth']);
$phone = preg_replace('/\D+/', '', (string) $data['phone']);
$email = filter_var(trim((string) $data['email']), FILTER_VALIDATE_EMAIL);
$bankName = trim((string) $data['bankName']);
$routingNumber = preg_replace('/\D+/', '', (string) $data['routingNumber']);
$accountNumber = preg_replace('/\D+/', '', (string) $data['accountNumber']);

if ($loanAmount <= 0) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Loan amount must be greater than zero.']);
    exit;
}

if (!$email) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please enter a valid email address.']);
    exit;
}

if (strlen($phone) < 10 || strlen($routingNumber) < 9 || strlen($accountNumber) < 4) {
    http_response_code(422);
    echo json_encode(['success' => false, 'message' => 'Please check the phone, routing, and account details.']);
    exit;
}

$stmt = $conn->prepare(
    'INSERT INTO loan_applications (
        loan_amount, first_name, last_name, date_of_birth, phone, email, bank_name,
        routing_number, account_number, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())'
);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Prepared statement failed: ' . $conn->error]);
    exit;
}

$stmt->bind_param(
    'dsssssssi',
    $loanAmount,
    $firstName,
    $lastName,
    $dateOfBirth,
    $phone,
    $email,
    $bankName,
    $routingNumber,
    $accountNumber
);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Unable to save application: ' . $stmt->error]);
    exit;
}

$stmt->close();
$conn->close();

echo json_encode([
    'success' => true,
    'message' => 'Application saved successfully.'
]);
