<?php
/**
 * PRIVATE server configuration template.
 * The real file is public/app/config.php (git-ignored, blocked from the web).
 * Create or update it with:  php tools/generate_hash.php "your-strong-password"
 */

// Random secret that signs admin session tokens.
// Generate one with: php -r "echo bin2hex(random_bytes(32));"
define('AUTH_SECRET', 'REPLACE_WITH_A_64_CHAR_RANDOM_SECRET');

// Admin password hash. Empty = admin locked (nobody can sign in).
define('ADMIN_PASSWORD_HASH', '');

// Optional: where content, backups and login-attempt logs live.
// Default is a "data" folder next to api.php, blocked from the web.
// define('DATA_DIR', '/absolute/path/outside/web/root');
