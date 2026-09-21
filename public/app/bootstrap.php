<?php
/**
 * Synergy Global — shared server bootstrap (PHP 7.2+).
 * Loaded by api.php, index.php, sitemap.php and robots.php.
 * This folder is blocked from the web (see app/.htaccess).
 */

if (defined('SG_BOOTSTRAPPED')) return;
define('SG_BOOTSTRAPPED', true);

$sgConfig = __DIR__ . '/config.php';
if (is_file($sgConfig)) require_once $sgConfig;
if (!defined('AUTH_SECRET')) define('AUTH_SECRET', '');
if (!defined('ADMIN_PASSWORD_HASH')) define('ADMIN_PASSWORD_HASH', '');

define('SG_WEB_ROOT', dirname(__DIR__));
if (!defined('DATA_DIR')) {
    $env = getenv('SYNERGY_DATA_DIR');
    define('DATA_DIR', $env ? rtrim($env, '/\\') : SG_WEB_ROOT . '/data');
}
define('SG_CONTENT_FILE', DATA_DIR . '/content.json');
define('SG_BACKUP_DIR', DATA_DIR . '/backups');
define('SG_UPLOAD_DIR', SG_WEB_ROOT . '/uploads');
define('SG_SEED_FILE', __DIR__ . '/seed-content.json');
define('SG_LEGACY_CONTENT', SG_WEB_ROOT . '/content.json');
define('SG_MAX_BACKUPS', 60);
define('SG_TOKEN_TTL', 12 * 3600);

/* ------------------------------------------------------------ helpers */

function sg_get($arr, $path, $default = '')
{
    $cur = $arr;
    foreach (explode('.', $path) as $key) {
        if (!is_array($cur) || !array_key_exists($key, $cur)) return $default;
        $cur = $cur[$key];
    }
    return $cur === null ? $default : $cur;
}

function sg_str($arr, $path, $default = '')
{
    $v = sg_get($arr, $path, $default);
    return is_string($v) || is_numeric($v) ? (string) $v : $default;
}

function sg_list($arr, $path)
{
    $v = sg_get($arr, $path, []);
    return is_array($v) ? array_values(array_filter($v, 'is_array')) : [];
}

function sg_e($text)
{
    return htmlspecialchars((string) $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

function sg_json_response($data, $code = 200)
{
    http_response_code($code);
    header('Content-Type: application/json; charset=utf-8');
    header('Cache-Control: no-store');
    header('X-Content-Type-Options: nosniff');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function sg_fail($code, $message, $extra = [])
{
    sg_json_response(array_merge(['ok' => false, 'error' => $message], $extra), $code);
}

/* --------------------------------------------------------------- files */

function sg_ensure_dir($dir, $deny = false)
{
    if (!is_dir($dir)) @mkdir($dir, 0755, true);
    if ($deny && is_dir($dir) && !is_file($dir . '/.htaccess')) {
        @file_put_contents($dir . '/.htaccess', "Require all denied\n");
    }
    return is_dir($dir) && is_writable($dir);
}

function sg_ensure_data_dirs()
{
    return sg_ensure_dir(DATA_DIR, true) && sg_ensure_dir(SG_BACKUP_DIR, true);
}

function sg_read_json($file)
{
    if (!is_file($file)) return null;
    $raw = @file_get_contents($file);
    if ($raw === false || $raw === '') return null;
    $data = json_decode($raw, true);
    return is_array($data) ? $data : null;
}

/** Write via a temp file + rename so readers never see a half-written file. */
function sg_write_json_atomic($file, $data)
{
    $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    if ($json === false) return false;
    $tmp = $file . '.tmp-' . bin2hex(random_bytes(4));
    if (@file_put_contents($tmp, $json, LOCK_EX) === false) return false;
    if (!@rename($tmp, $file)) {
        @unlink($tmp);
        return false;
    }
    return true;
}

/* ------------------------------------------------------------- content */

/**
 * Current published content. On the very first run after the upgrade it
 * keeps a backup of the old content.json and starts from the seed that ships
 * with the build (which already contains everything the old site showed).
 */
function sg_load_content()
{
    static $cache = null;
    if ($cache !== null) return $cache;

    $data = sg_read_json(SG_CONTENT_FILE);
    if (is_array($data) && $data) return $cache = $data;

    $seed = sg_read_json(SG_SEED_FILE);
    $legacy = sg_read_json(SG_LEGACY_CONTENT);

    if (sg_ensure_data_dirs()) {
        if (is_file(SG_LEGACY_CONTENT)) {
            $dest = SG_BACKUP_DIR . '/content-' . gmdate('Ymd-His') . '-legacy-v2.json';
            if (@copy(SG_LEGACY_CONTENT, $dest)) @unlink(SG_LEGACY_CONTENT);
        }
        $initial = $seed ?: $legacy;
        if (is_array($initial)) {
            if (!isset($initial['_meta']) || !is_array($initial['_meta'])) $initial['_meta'] = [];
            $initial['_meta']['version'] = (int) sg_get($initial, '_meta.version', 0) + 1;
            $initial['_meta']['updatedAt'] = gmdate('c');
            sg_write_json_atomic(SG_CONTENT_FILE, $initial);
            return $cache = $initial;
        }
    }
    return $cache = ($seed ?: ($legacy ?: []));
}

function sg_content_version($content)
{
    return (int) sg_get($content, '_meta.version', 0);
}

function sg_backup_current($reason = 'save')
{
    if (!is_file(SG_CONTENT_FILE)) return true;
    sg_ensure_data_dirs();
    $current = sg_read_json(SG_CONTENT_FILE);
    $v = $current ? sg_content_version($current) : 0;
    $reason = preg_replace('/[^a-z0-9-]/', '', strtolower($reason));
    $dest = SG_BACKUP_DIR . '/content-' . gmdate('Ymd-His') . '-v' . $v . '-' . $reason . '.json';
    $ok = @copy(SG_CONTENT_FILE, $dest);
    sg_prune_backups();
    return $ok;
}

function sg_list_backups()
{
    $files = glob(SG_BACKUP_DIR . '/content-*.json') ?: [];
    rsort($files, SORT_STRING);
    return $files;
}

function sg_prune_backups()
{
    $files = sg_list_backups();
    foreach (array_slice($files, SG_MAX_BACKUPS) as $old) @unlink($old);
}

/* ---------------------------------------------------------------- auth */

function sg_b64url($s)
{
    return rtrim(strtr(base64_encode($s), '+/', '-_'), '=');
}

function sg_b64url_decode($s)
{
    return base64_decode(strtr($s, '-_', '+/'));
}

/** Changing the password invalidates every token signed with the old one. */
function sg_token_key()
{
    return AUTH_SECRET . '|' . substr(ADMIN_PASSWORD_HASH, -16);
}

function sg_issue_token()
{
    $exp = time() + SG_TOKEN_TTL;
    $sig = hash_hmac('sha256', 'admin|' . $exp, sg_token_key());
    return ['token' => sg_b64url($exp . '.' . $sig), 'expires' => $exp];
}

function sg_valid_token($token)
{
    if (!$token || AUTH_SECRET === '' || ADMIN_PASSWORD_HASH === '') return false;
    $parts = explode('.', (string) sg_b64url_decode($token), 2);
    if (count($parts) !== 2 || !ctype_digit($parts[0])) return false;
    $expected = hash_hmac('sha256', 'admin|' . $parts[0], sg_token_key());
    return hash_equals($expected, $parts[1]) && (int) $parts[0] > time();
}

function sg_bearer()
{
    $h = $_SERVER['HTTP_AUTHORIZATION'] ?? ($_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? '');
    if (!$h && function_exists('apache_request_headers')) {
        $all = apache_request_headers();
        foreach ($all as $k => $v) if (strtolower($k) === 'authorization') $h = $v;
    }
    return stripos($h, 'Bearer ') === 0 ? trim(substr($h, 7)) : '';
}

function sg_require_auth()
{
    if (!sg_valid_token(sg_bearer())) sg_fail(401, 'session-expired');
}

/* --------------------------------------------------------- site helpers */

function sg_site_url($content)
{
    $url = rtrim(sg_str($content, 'settings.siteUrl'), '/');
    if (preg_match('#^https?://[^/\s]+$#i', $url)) return $url;
    $https = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') || (($_SERVER['HTTP_X_FORWARDED_PROTO'] ?? '') === 'https');
    return ($https ? 'https' : 'http') . '://' . ($_SERVER['HTTP_HOST'] ?? 'localhost');
}

function sg_absolute($base, $url)
{
    $url = (string) $url;
    if ($url === '') return '';
    if (preg_match('#^https?://#i', $url)) return $url;
    return $base . '/' . ltrim($url, '/');
}

function sg_allow_indexing($content)
{
    return sg_get($content, 'settings.allowIndexing', false) === true;
}
