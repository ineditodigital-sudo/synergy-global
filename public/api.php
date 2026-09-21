<?php
/**
 * Synergy Global — content API.
 *
 *  GET  /api.php                          public: published content (JSON)
 *  POST /api.php?action=login             { password } -> { token, expires }
 *  GET  /api.php?action=session           (auth) renews the session token
 *  POST /api.php?action=save              (auth) { content, baseVersion, force? }
 *  POST /api.php?action=upload            (auth) multipart: files[] (+ widths[])
 *  GET  /api.php?action=media             (auth) uploaded files
 *  POST /api.php?action=delete-media      (auth) { url }
 *  GET  /api.php?action=history           (auth) saved versions
 *  GET  /api.php?action=version&id=...    (auth) one saved version
 *
 * Every save keeps a backup of the previous version (last 60 kept), and a
 * save based on an outdated version is refused so two editors can never
 * silently overwrite each other.
 */
require_once __DIR__ . '/app/bootstrap.php';

header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = isset($_GET['action']) ? (string) $_GET['action'] : '';

if ($method === 'OPTIONS') {
    http_response_code(204);
    exit;
}

function sg_body()
{
    $raw = file_get_contents('php://input');
    if ($raw === false || $raw === '') return [];
    if (strlen($raw) > 4 * 1024 * 1024) sg_fail(413, 'too-large');
    $data = json_decode($raw, true);
    if (!is_array($data)) sg_fail(400, 'invalid-json');
    return $data;
}

function sg_ini_bytes($value)
{
    $value = trim((string) $value);
    if ($value === '') return 0;
    $n = (float) $value;
    switch (strtolower(substr($value, -1))) {
        case 'g': $n *= 1024;
        // no break
        case 'm': $n *= 1024;
        // no break
        case 'k': $n *= 1024;
    }
    return (int) $n;
}

function sg_upload_limit()
{
    $limits = array_filter([sg_ini_bytes(ini_get('upload_max_filesize')), sg_ini_bytes(ini_get('post_max_size')), 40 * 1024 * 1024]);
    return $limits ? min($limits) : 8 * 1024 * 1024;
}

/* ------------------------------------------------------------ login */

function sg_attempts_file()
{
    return DATA_DIR . '/login-attempts.json';
}

function sg_client_key()
{
    return hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . '|' . AUTH_SECRET);
}

function sg_attempts_read()
{
    $all = sg_read_json(sg_attempts_file()) ?: [];
    $now = time();
    foreach ($all as $k => $list) {
        $all[$k] = array_values(array_filter((array) $list, function ($t) use ($now) { return $t > $now - 900; }));
        if (!$all[$k]) unset($all[$k]);
    }
    return $all;
}

if ($method === 'POST' && $action === 'login') {
    if (ADMIN_PASSWORD_HASH === '' || AUTH_SECRET === '') sg_fail(503, 'auth-not-configured');
    sg_ensure_data_dirs();
    $key = sg_client_key();
    $attempts = sg_attempts_read();
    $mine = $attempts[$key] ?? [];
    if (count($mine) >= 8) {
        sg_fail(429, 'too-many-attempts', ['retryAfter' => max(60, 900 - (time() - min($mine)))]);
    }
    $body = sg_body();
    $pass = isset($body['password']) && is_string($body['password']) ? $body['password'] : '';
    usleep(350000); // slows down guessing
    if ($pass !== '' && password_verify($pass, ADMIN_PASSWORD_HASH)) {
        unset($attempts[$key]);
        sg_write_json_atomic(sg_attempts_file(), $attempts);
        sg_json_response(['ok' => true] + sg_issue_token());
    }
    $attempts[$key] = array_merge($mine, [time()]);
    sg_write_json_atomic(sg_attempts_file(), $attempts);
    sg_fail(401, 'wrong-password', ['remaining' => max(0, 8 - count($attempts[$key]))]);
}

/* ------------------------------------------------------- public read */

if ($method === 'GET' && $action === '') {
    $content = sg_load_content();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($content ?: new stdClass(), JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

/* ------------------------------------------------ everything else: auth */

sg_require_auth();

if ($method === 'GET' && $action === 'session') {
    sg_json_response(['ok' => true, 'uploadLimit' => sg_upload_limit()] + sg_issue_token());
}

if ($method === 'POST' && $action === 'save') {
    $body = sg_body();
    $content = $body['content'] ?? null;
    if (!is_array($content) || !isset($content['home']) || !is_array($content['home']) || !isset($content['settings'])) {
        sg_fail(400, 'invalid-content');
    }
    if (!sg_ensure_data_dirs()) sg_fail(500, 'data-folder-not-writable');

    $lock = fopen(DATA_DIR . '/.save.lock', 'c');
    if ($lock) flock($lock, LOCK_EX);

    $current = sg_read_json(SG_CONTENT_FILE) ?: sg_load_content();
    $currentVersion = sg_content_version($current);
    $base = isset($body['baseVersion']) ? (int) $body['baseVersion'] : -1;
    if (empty($body['force']) && $base !== $currentVersion) {
        if ($lock) flock($lock, LOCK_UN);
        sg_fail(409, 'version-conflict', ['currentVersion' => $currentVersion, 'updatedAt' => sg_str($current, '_meta.updatedAt')]);
    }

    $reason = isset($body['reason']) && in_array($body['reason'], ['publish', 'before-restore'], true) ? $body['reason'] : 'publish';
    sg_backup_current($reason);
    $content['_meta'] = [
        'schema' => (int) sg_get($content, '_meta.schema', 3),
        'version' => $currentVersion + 1,
        'updatedAt' => gmdate('c'),
    ];
    $ok = sg_write_json_atomic(SG_CONTENT_FILE, $content);
    if ($lock) flock($lock, LOCK_UN);
    if (!$ok) sg_fail(500, 'write-failed');
    sg_json_response(['ok' => true, 'version' => $content['_meta']['version'], 'updatedAt' => $content['_meta']['updatedAt']]);
}

if ($method === 'POST' && $action === 'upload') {
    if (empty($_FILES)) {
        // PHP drops the whole request when it exceeds post_max_size.
        sg_fail(413, 'file-too-large', ['limit' => sg_upload_limit()]);
    }
    if (!sg_ensure_dir(SG_UPLOAD_DIR)) sg_fail(500, 'upload-folder-not-writable');
    $ht = SG_UPLOAD_DIR . '/.htaccess';
    if (!is_file($ht)) {
        @file_put_contents($ht, "Options -Indexes -ExecCGI\n<FilesMatch \"\\.(php[0-9]?|phtml|phps|phar|pht|cgi|pl|py|sh|htaccess)$\">\n  Require all denied\n</FilesMatch>\n");
    }

    $files = [];
    if (isset($_FILES['files']) && is_array($_FILES['files']['name'])) {
        foreach ($_FILES['files']['name'] as $i => $n) {
            $files[] = ['name' => $n, 'tmp' => $_FILES['files']['tmp_name'][$i], 'size' => $_FILES['files']['size'][$i], 'error' => $_FILES['files']['error'][$i]];
        }
    } elseif (isset($_FILES['file'])) {
        $f = $_FILES['file'];
        $files[] = ['name' => $f['name'], 'tmp' => $f['tmp_name'], 'size' => $f['size'], 'error' => $f['error']];
    }
    if (!$files) sg_fail(400, 'no-file');
    $widths = isset($_POST['widths']) && is_array($_POST['widths']) ? array_map('intval', $_POST['widths']) : [];
    $label = isset($_POST['name']) ? (string) $_POST['name'] : $files[0]['name'];

    $allowed = [
        'webp' => ['image/webp'],
        'jpg' => ['image/jpeg'], 'jpeg' => ['image/jpeg'], 'png' => ['image/png'], 'gif' => ['image/gif'],
        'mp4' => ['video/mp4', 'application/mp4'], 'webm' => ['video/webm'], 'mov' => ['video/quicktime'],
        'pdf' => ['application/pdf'],
    ];
    $finfo = function_exists('finfo_open') ? finfo_open(FILEINFO_MIME_TYPE) : null;
    $base = preg_replace('/[^a-z0-9]+/', '-', strtolower(pathinfo($label, PATHINFO_FILENAME)));
    $base = trim(substr($base, 0, 50), '-') ?: 'file';
    $base = gmdate('Ymd') . '-' . bin2hex(random_bytes(3)) . '-' . $base;

    $saved = [];
    foreach ($files as $i => $f) {
        if ($f['error'] !== UPLOAD_ERR_OK) {
            $code = in_array($f['error'], [UPLOAD_ERR_INI_SIZE, UPLOAD_ERR_FORM_SIZE], true) ? 'file-too-large' : 'upload-error';
            sg_fail(400, $code, ['limit' => sg_upload_limit()]);
        }
        $ext = strtolower(pathinfo($f['name'], PATHINFO_EXTENSION));
        if (!isset($allowed[$ext])) sg_fail(415, 'file-type-not-allowed');
        if ($finfo) {
            $mime = finfo_file($finfo, $f['tmp']);
            if ($mime && !in_array($mime, $allowed[$ext], true) && $mime !== 'application/octet-stream') sg_fail(415, 'file-type-not-allowed');
        }
        $width = 0;
        if (in_array($ext, ['webp', 'jpg', 'jpeg', 'png', 'gif'], true)) {
            $info = @getimagesize($f['tmp']);
            if (!$info) sg_fail(415, 'not-an-image');
            $width = (int) $info[0];
        }
        if ($ext === 'webp' && $width > 0 && isset($widths[$i])) {
            $name = $base . '.w' . $width . '.webp';
        } else {
            $name = $base . ($i > 0 ? '-' . $i : '') . '.' . $ext;
        }
        if (!move_uploaded_file($f['tmp'], SG_UPLOAD_DIR . '/' . $name)) sg_fail(500, 'could-not-save');
        @chmod(SG_UPLOAD_DIR . '/' . $name, 0644);
        $saved[] = ['url' => '/uploads/' . $name, 'width' => $width];
    }
    usort($saved, function ($a, $b) { return $b['width'] - $a['width']; });
    sg_json_response(['ok' => true, 'url' => $saved[0]['url'], 'files' => $saved]);
}

if ($method === 'GET' && $action === 'media') {
    $items = [];
    foreach (glob(SG_UPLOAD_DIR . '/*') ?: [] as $file) {
        if (!is_file($file)) continue;
        $name = basename($file);
        if ($name[0] === '.') continue;
        $group = preg_replace('/\.w\d+\.webp$/i', '', $name);
        $w = preg_match('/\.w(\d+)\.webp$/i', $name, $m) ? (int) $m[1] : 0;
        if (!isset($items[$group])) $items[$group] = ['url' => '/uploads/' . $name, 'width' => $w, 'size' => 0, 'date' => filemtime($file), 'name' => $name];
        $items[$group]['size'] += filesize($file);
        if ($w > $items[$group]['width']) {
            $items[$group]['url'] = '/uploads/' . $name;
            $items[$group]['width'] = $w;
        }
    }
    $list = array_values($items);
    usort($list, function ($a, $b) { return $b['date'] - $a['date']; });
    sg_json_response(['ok' => true, 'items' => $list, 'uploadLimit' => sg_upload_limit()]);
}

if ($method === 'POST' && $action === 'delete-media') {
    $body = sg_body();
    $url = isset($body['url']) ? (string) $body['url'] : '';
    if (!preg_match('#^/uploads/([A-Za-z0-9._ -]+)$#', $url, $m) || strpos($m[1], '..') !== false) sg_fail(400, 'invalid-file');
    $group = preg_replace('/\.w\d+\.webp$/i', '', $m[1]);
    $deleted = 0;
    foreach (glob(SG_UPLOAD_DIR . '/*') ?: [] as $file) {
        $name = basename($file);
        if ($name === $m[1] || preg_replace('/\.w\d+\.webp$/i', '', $name) === $group && preg_match('/\.w\d+\.webp$/i', $name)) {
            if (@unlink($file)) $deleted++;
        }
    }
    sg_json_response(['ok' => true, 'deleted' => $deleted]);
}

if ($method === 'GET' && $action === 'history') {
    $out = [];
    foreach (sg_list_backups() as $file) {
        $name = basename($file);
        preg_match('/content-(\d{8})-(\d{6})(?:-v(\d+))?(?:-([a-z0-9-]+))?\.json$/', $name, $m);
        $out[] = [
            'id' => $name,
            'date' => isset($m[1]) ? gmdate('c', strtotime($m[1] . 'T' . $m[2] . 'Z')) : gmdate('c', filemtime($file)),
            'version' => isset($m[3]) && $m[3] !== '' ? (int) $m[3] : null,
            'reason' => $m[4] ?? '',
            'size' => filesize($file),
        ];
    }
    $current = sg_load_content();
    sg_json_response(['ok' => true, 'items' => $out, 'current' => ['version' => sg_content_version($current), 'updatedAt' => sg_str($current, '_meta.updatedAt')]]);
}

function sg_backup_path($id)
{
    if (!preg_match('/^content-[A-Za-z0-9-]+\.json$/', (string) $id)) sg_fail(400, 'invalid-version');
    $file = SG_BACKUP_DIR . '/' . $id;
    if (!is_file($file)) sg_fail(404, 'version-not-found');
    return $file;
}

if ($method === 'GET' && $action === 'version') {
    $data = sg_read_json(sg_backup_path($_GET['id'] ?? ''));
    if (!$data) sg_fail(422, 'version-unreadable');
    sg_json_response(['ok' => true, 'content' => $data]);
}

// Old CMS builds posted raw content without an action: refuse politely.
sg_fail(400, 'unknown-action');
