<?php
/**
 * Template for config.php. Copy it and fill in the values:
 *   cp config.example.php config.php
 * config.php is git-ignored and must NEVER be committed or exposed.
 */

// Unique random secret. Generate one with:
//   php -r "echo bin2hex(random_bytes(32));"
define('AUTH_SECRET', 'REEMPLAZA_CON_UN_SECRETO_ALEATORIO_DE_64_CHARS');

// Admin password hash. Set with:  php generate_hash.php "tu-contrasena-fuerte"
define('ADMIN_PASSWORD_HASH', '');

// Comma-separated origins allowed to call the API (CORS).
define('ALLOWED_ORIGINS', 'https://synergy.inedito.digital');
