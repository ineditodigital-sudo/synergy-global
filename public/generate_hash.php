<?php
/**
 * CLI helper to set the admin password.
 * Usage:  php generate_hash.php "tu-contrasena-fuerte"
 *
 * It computes a secure bcrypt hash and writes it into config.php automatically.
 * Web access is blocked — this only runs from a terminal.
 */
if (php_sapi_name() !== 'cli') {
    http_response_code(403);
    header('Content-Type: text/plain');
    exit("Solo disponible por linea de comandos (CLI).\n");
}

$pw = $argv[1] ?? '';
if ($pw === '') {
    fwrite(STDERR, "Uso: php generate_hash.php \"tu-contrasena-fuerte\"\n");
    exit(1);
}
if (strlen($pw) < 8) {
    fwrite(STDERR, "La contrasena debe tener al menos 8 caracteres.\n");
    exit(1);
}

$hash = password_hash($pw, PASSWORD_DEFAULT);

$candidates = [__DIR__ . '/config.php', __DIR__ . '/public/config.php', getcwd() . '/config.php'];
foreach ($candidates as $cfg) {
    if (is_file($cfg)) {
        $contents = file_get_contents($cfg);
        $updated  = preg_replace(
            "/define\\(\\s*'ADMIN_PASSWORD_HASH'\\s*,\\s*'[^']*'\\s*\\);/",
            "define('ADMIN_PASSWORD_HASH', '$hash');",
            $contents, 1, $count
        );
        if ($count > 0 && file_put_contents($cfg, $updated) !== false) {
            echo "OK: contrasena guardada en $cfg\n";
            echo "Ya puedes iniciar sesion en /admin.\n";
            exit(0);
        }
    }
}

echo "No encontre config.php. Pega esta linea manualmente en tu config.php:\n\n";
echo "define('ADMIN_PASSWORD_HASH', '$hash');\n";
