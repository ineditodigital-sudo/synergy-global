<?php
/**
 * Router for PHP's built-in server, emulating public/.htaccess locally.
 *
 *   npm run serve        (production build in dist/, http://127.0.0.1:8787)
 *   npm run dev:api      (API for `npm run dev`, serves public/)
 *
 * Content and backups go to .local-data/ (never inside public/ or dist/).
 */
if (!getenv('SYNERGY_DATA_DIR')) putenv('SYNERGY_DATA_DIR=' . dirname(__DIR__) . '/.local-data');
$docroot = $_SERVER['DOCUMENT_ROOT'];
$path = rawurldecode(parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?: '/');

if (preg_match('#^/(app|data)(/|$)#', $path) || preg_match('#/\.(?!well-known/)#', $path)) {
    http_response_code(403);
    echo 'Forbidden';
    return true;
}
if ($path === '/robots.txt') { require $docroot . '/robots.php'; return true; }
if ($path === '/sitemap.xml') { require $docroot . '/sitemap.php'; return true; }

$file = realpath($docroot . $path);
if ($file && strpos($file, realpath($docroot)) === 0 && is_file($file)) {
    if (substr($file, -4) === '.php') {
        $_SERVER['SCRIPT_NAME'] = $path;
        require $file;
        return true;
    }
    return false; // let the built-in server send the static file
}
if (preg_match('/\.(js|mjs|css|map|png|jpe?g|webp|avif|gif|svg|ico|mp4|webm|mov|woff2?|ttf|otf|pdf|json|txt|zip)$/i', $path)) {
    http_response_code(404);
    echo 'Not found';
    return true;
}
require $docroot . '/index.php';
return true;
