<?php
/**
 * Set (or change) the admin password for the Synergy Global CMS.
 *
 *   php tools/generate_hash.php "your-strong-password"
 *
 * Writes a bcrypt hash into public/app/config.php (creating the file from
 * config.example.php if needed, with a fresh random AUTH_SECRET).
 * Then run `npm run build` and deploy so the server gets the new hash.
 *
 * Changing the password also signs every open admin session out.
 * This script is NOT deployed to the web server.
 */
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    exit("CLI only.\n");
}

$pw = $argv[1] ?? '';
if ($pw === '') {
    fwrite(STDERR, "Usage: php tools/generate_hash.php \"your-strong-password\"\n");
    exit(1);
}
if (strlen($pw) < 10) {
    fwrite(STDERR, "The password must be at least 10 characters long.\n");
    exit(1);
}

$root    = dirname(__DIR__);
$cfg     = $root . '/public/app/config.php';
$example = $root . '/public/app/config.example.php';

if (!is_file($cfg)) {
    if (!is_file($example)) {
        fwrite(STDERR, "Missing public/app/config.example.php\n");
        exit(1);
    }
    $tpl = file_get_contents($example);
    $secret = bin2hex(random_bytes(32));
    $tpl = preg_replace_callback(
        "/define\\(\\s*'AUTH_SECRET'\\s*,\\s*'[^']*'\\s*\\);/",
        function () use ($secret) { return "define('AUTH_SECRET', '" . $secret . "');"; },
        $tpl, 1
    );
    file_put_contents($cfg, $tpl);
    echo "Created public/app/config.php with a new AUTH_SECRET.\n";
}

$hash     = password_hash($pw, PASSWORD_DEFAULT);
$contents = file_get_contents($cfg);
// preg_replace_callback: a bcrypt hash contains "$2y$10$", which a plain
// replacement string would treat as back-references and corrupt.
$updated  = preg_replace_callback(
    "/define\\(\\s*'ADMIN_PASSWORD_HASH'\\s*,\\s*'[^']*'\\s*\\);/",
    function () use ($hash) { return "define('ADMIN_PASSWORD_HASH', '" . $hash . "');"; },
    $contents, 1, $count
);

if ($count === 0 || file_put_contents($cfg, $updated) === false) {
    fwrite(STDERR, "Could not update public/app/config.php. Add this line manually:\n");
    fwrite(STDERR, "define('ADMIN_PASSWORD_HASH', '" . $hash . "');\n");
    exit(1);
}

// Sanity check: the stored hash must verify the password we were given.
require $cfg;
if (!password_verify($pw, ADMIN_PASSWORD_HASH)) {
    fwrite(STDERR, "Verification failed. The config file was not updated correctly.\n");
    exit(1);
}

echo "OK: admin password saved to public/app/config.php\n";
echo "Next: npm run build, then deploy.\n";
