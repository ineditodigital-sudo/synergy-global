<?php
/**
 * Synergy Global — Content & Upload API (hardened)
 * ------------------------------------------------
 *  GET  /api.php                 -> public read of content.json
 *  POST /api.php?action=login    -> verify password, return signed token
 *  POST /api.php  (Bearer token) -> save content.json  OR  upload a file
 *
 *  Auth is a stateless HMAC token. Secret + password hash live in config.php
 *  (git-ignored, never bundled into the frontend).
 */

// ---- Load private config (secret + password hash). Safe defaults if absent. ----
$__cfg = __DIR__ . '/config.php';
if (is_file($__cfg)) { require_once $__cfg; }
if (!defined('AUTH_SECRET'))         define('AUTH_SECRET', '');
if (!defined('ADMIN_PASSWORD_HASH')) define('ADMIN_PASSWORD_HASH', '');
if (!defined('ALLOWED_ORIGINS'))     define('ALLOWED_ORIGINS', 'https://synergy.inedito.digital');

// ---- CORS: reflect only allow-listed origins (no wildcard on writes) ----
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
$allow  = array_map('trim', explode(',', ALLOWED_ORIGINS));
if ($origin !== '' && in_array($origin, $allow, true)) {
    header("Access-Control-Allow-Origin: $origin");
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

// ---------------------------------------------------------------------------
// Token helpers (stateless: payload = "<expiry>.<hmac(expiry)>")
// ---------------------------------------------------------------------------
function b64url_encode($s) { return rtrim(strtr(base64_encode($s), '+/', '-_'), '='); }
function b64url_decode($s) { return base64_decode(strtr($s, '-_', '+/')); }

function issue_token($ttl = 43200) { // 12 hours
    $exp = time() + $ttl;
    $sig = hash_hmac('sha256', (string)$exp, AUTH_SECRET);
    return b64url_encode($exp . '.' . $sig);
}
function valid_token($token) {
    if (!$token || AUTH_SECRET === '') return false;
    $parts = explode('.', b64url_decode($token), 2);
    if (count($parts) !== 2) return false;
    list($exp, $sig) = $parts;
    if (!ctype_digit($exp)) return false;
    $expected = hash_hmac('sha256', $exp, AUTH_SECRET);
    return hash_equals($expected, $sig) && (int)$exp > time();
}
function bearer_token() {
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    return (stripos($h, 'Bearer ') === 0) ? trim(substr($h, 7)) : '';
}
function require_auth() {
    if (!valid_token(bearer_token())) {
        http_response_code(401);
        echo json_encode(['status' => 'error', 'message' => 'No autorizado']);
        exit;
    }
}
function fail($code, $msg) {
    http_response_code($code);
    echo json_encode(['status' => 'error', 'message' => $msg]);
    exit;
}

$file      = __DIR__ . '/content.json';
$uploadDir = __DIR__ . '/uploads/';
$action    = $_GET['action'] ?? '';

// ---------------------------------------------------------------------------
// LOGIN
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST' && $action === 'login') {
    if (ADMIN_PASSWORD_HASH === '' || AUTH_SECRET === '') {
        fail(503, 'Autenticacion no configurada en el servidor. Ejecuta generate_hash.php.');
    }
    $body = json_decode(file_get_contents('php://input'), true);
    $pass = (is_array($body) && isset($body['password'])) ? $body['password'] : '';
    usleep(300000); // ~0.3s throttle against brute force
    if (is_string($pass) && $pass !== '' && password_verify($pass, ADMIN_PASSWORD_HASH)) {
        echo json_encode(['status' => 'success', 'token' => issue_token()]);
    } else {
        fail(401, 'Contrasena incorrecta');
    }
    exit;
}

// ---------------------------------------------------------------------------
// GET — public content
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (is_file($file)) { echo file_get_contents($file); }
    else { echo json_encode((object)[]); }
    exit;
}

// ---------------------------------------------------------------------------
// POST — protected (save JSON or upload file)
// ---------------------------------------------------------------------------
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    require_auth();

    // ---- File upload ----
    if (isset($_FILES['file'])) {
        if (!is_dir($uploadDir)) { mkdir($uploadDir, 0755, true); }
        // Defense-in-depth: never execute anything inside /uploads
        $ht = $uploadDir . '.htaccess';
        if (!is_file($ht)) {
            @file_put_contents($ht,
                "<FilesMatch \"\\.(php|phtml|php3|php4|php5|php7|phps|pht|cgi|pl|py|sh)$\">\n" .
                "  Require all denied\n</FilesMatch>\nOptions -ExecCGI\n");
        }

        $up = $_FILES['file'];
        if ($up['error'] !== UPLOAD_ERR_OK) fail(400, 'Error en la subida del archivo');
        if ($up['size'] > 25 * 1024 * 1024) fail(413, 'Archivo demasiado grande (max. 25MB)');

        $allowedExt = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'svg', 'mp4', 'webm', 'pdf'];
        $ext = strtolower(pathinfo($up['name'], PATHINFO_EXTENSION));
        if (!in_array($ext, $allowedExt, true)) fail(415, 'Tipo de archivo no permitido');

        // Safe, non-guessable filename; strip anything odd from the base name
        $base = preg_replace('/[^A-Za-z0-9_-]/', '-', pathinfo($up['name'], PATHINFO_FILENAME));
        $base = substr($base, 0, 60);
        $fileName = time() . '_' . bin2hex(random_bytes(4)) . '_' . $base . '.' . $ext;
        $target   = $uploadDir . $fileName;

        if (move_uploaded_file($up['tmp_name'], $target)) {
            $protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
            $host      = $_SERVER['HTTP_HOST'];
            $scriptDir = rtrim(dirname($_SERVER['SCRIPT_NAME']), '/\\');
            $url       = $protocol . '://' . $host . $scriptDir . '/uploads/' . rawurlencode($fileName);
            echo json_encode(['status' => 'success', 'message' => 'Archivo subido', 'url' => $url]);
        } else {
            fail(500, 'No se pudo guardar el archivo');
        }
        exit;
    }

    // ---- JSON save ----
    $json = file_get_contents('php://input');
    if (!$json) fail(400, 'No se recibieron datos');
    $data = json_decode($json);
    if (json_last_error() !== JSON_ERROR_NONE) fail(400, 'JSON invalido');

    $pretty = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if (file_put_contents($file, $pretty) !== false) {
        echo json_encode(['status' => 'success', 'message' => 'Contenido guardado correctamente']);
    } else {
        fail(500, 'Error al escribir en el servidor (permisos de carpeta)');
    }
    exit;
}

fail(405, 'Metodo no permitido');
