<?php
require __DIR__ . '/config.php';
requireAdminLogin();

$sql = 'SELECT id, loan_amount, first_name, last_name, date_of_birth, phone, email, bank_name, created_at FROM loan_applications ORDER BY created_at DESC';
$result = $conn->query($sql);
$rows = $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USA Lendings Admin</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            background: #f5f7fb;
            color: #1d2a38;
        }
        .wrap {
            max-width: 1200px;
            margin: 40px auto;
            padding: 20px;
        }
        .topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #fff;
            padding: 18px 24px;
            border-radius: 12px;
            box-shadow: 0 6px 20px rgba(0,0,0,0.06);
            margin-bottom: 20px;
        }
        h1 {
            margin: 0;
            font-size: 28px;
        }
        .btn {
            display: inline-block;
            background: #1f6feb;
            color: #fff;
            text-decoration: none;
            padding: 10px 16px;
            border-radius: 10px;
            font-weight: 600;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            background: #fff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0,0,0,0.04);
        }
        th, td {
            padding: 12px 10px;
            text-align: left;
            border-bottom: 1px solid #e9eef6;
            vertical-align: top;
            font-size: 14px;
        }
        th {
            background: #eef4ff;
        }
        .count {
            margin: 0 0 18px;
            font-weight: 600;
            color: #36506c;
        }
        @media (max-width: 768px) {
            table {
                display: block;
                overflow-x: auto;
            }
        }
    </style>
</head>
<body>
    <div class="wrap">
        <div class="topbar">
            <h1>USA Lendings Admin</h1>
            <div style="display:flex; gap:10px; align-items:center;">
                <a class="btn" href="export.php">Export to Excel</a>
                <a class="btn" href="logout.php" style="background:#223;">Logout</a>
            </div>
        </div>

        <p class="count">Total applications: <?php echo count($rows); ?></p>

        <?php if (empty($rows)): ?>
            <p>No applications have been submitted yet.</p>
        <?php else: ?>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Loan Amount</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Date of Birth</th>
                        <th>Phone</th>
                        <th>Email</th>
                        <th>Bank Name</th>
                        <th>Submitted At</th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($rows as $row): ?>
                        <tr>
                            <td><?php echo htmlspecialchars($row['id']); ?></td>
                            <td>$<?php echo number_format((float) $row['loan_amount'], 2); ?></td>
                            <td><?php echo htmlspecialchars($row['first_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['last_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['date_of_birth']); ?></td>
                            <td><?php echo htmlspecialchars($row['phone']); ?></td>
                            <td><?php echo htmlspecialchars($row['email']); ?></td>
                            <td><?php echo htmlspecialchars($row['bank_name']); ?></td>
                            <td><?php echo htmlspecialchars($row['created_at']); ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php endif; ?>
    </div>
</body>
</html>
<?php $conn->close(); ?>
