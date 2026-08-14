<?php
require __DIR__ . '/config.php';

$loginError = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim((string) ($_POST['username'] ?? ''));
    $password = (string) ($_POST['password'] ?? '');

    if ($username === $adminUsername && $password === $adminPassword) {
        $_SESSION['admin_logged_in'] = true;
        header('Location: admin.php');
        exit;
    }

    $loginError = 'Invalid username or password.';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>USA Lendings Admin Login</title>
    <style>
        body {
            margin: 0;
            min-height: 100vh;
            display: grid;
            place-items: center;
            background: linear-gradient(135deg, #eef4ff, #f8fafc);
            font-family: Arial, sans-serif;
        }

        .login-box {
            width: min(420px, 92vw);
            background: #fff;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
            padding: 32px 28px;
        }

        h1 {
            margin: 0 0 8px;
            font-size: 28px;
            text-align: center;
        }

        .subtitle {
            text-align: center;
            color: #516074;
            margin-bottom: 24px;
        }

        label {
            display: block;
            font-weight: 600;
            margin-bottom: 8px;
        }

        input {
            width: 100%;
            box-sizing: border-box;
            padding: 12px 14px;
            border-radius: 10px;
            border: 1px solid #dfe9f5;
            margin-bottom: 18px;
            font-size: 15px;
        }

        button {
            width: 100%;
            background: #1f6feb;
            color: white;
            border: none;
            border-radius: 10px;
            padding: 12px 16px;
            font-size: 16px;
            font-weight: 700;
            cursor: pointer;
        }

        .error {
            color: #c62828;
            text-align: center;
            margin-bottom: 14px;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="login-box">
        <h1>USA Lendings</h1>
        <div class="subtitle">Admin Login</div>

        <?php if ($loginError !== ''): ?>
            <div class="error"><?php echo htmlspecialchars($loginError); ?></div>
        <?php endif; ?>

        <form method="POST">
            <label for="username">Username</label>
            <input id="username" name="username" type="text" placeholder="admin" required>

            <label for="password">Password</label>
            <input id="password" name="password" type="password" placeholder="admin123" required>

            <button type="submit">Login</button>
        </form>
    </div>
</body>
</html>
