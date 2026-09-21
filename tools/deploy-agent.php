<?php
/**
 * One-time deploy agent (template). deploy_synergy.ps1 fills in the token and
 * the zip name, uploads it next to the zip with a random name, and calls:
 *
 *   ?step=extract   unzip into a staging folder, back up every file that will
 *                   be replaced, then move the new files into place
 *   ?step=rollback  restore the backed-up files (used if the site check fails)
 *   ?step=finalize  remove files from older deploys and the previous site's
 *                   leftovers, then delete the zip and this script
 *
 * It never touches data/ (content, backups) or uploads/ (editor files).
 */
$TOKEN = '__TOKEN__';
$ZIP = __DIR__ . '/__ZIP__';
$ROOT = __DIR__;
$RB = $ROOT . '/app/_rollback';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Robots-Tag: noindex');

function out($data, $code = 200)
{
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_SLASHES);
    exit;
}

if (!hash_equals($TOKEN, (string) ($_GET['token'] ?? ''))) out(['ok' => false, 'error' => 'forbidden'], 403);
if (filemtime(__FILE__) < time() - 3600) {
    @unlink($ZIP);
    @unlink(__FILE__);
    out(['ok' => false, 'error' => 'expired'], 410);
}
@set_time_limit(300);

function safe_rel($p)
{
    $p = str_replace('\\', '/', (string) $p);
    if ($p === '' || $p[0] === '/' || strpos($p, '..') !== false || strpos($p, ':') !== false) return null;
    if (preg_match('#^(data|uploads)(/|$)#', $p)) return null;
    return $p;
}

function rrmdir($dir)
{
    if (!is_dir($dir)) return;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS), RecursiveIteratorIterator::CHILD_FIRST);
    foreach ($it as $f) $f->isDir() ? @rmdir($f->getPathname()) : @unlink($f->getPathname());
    @rmdir($dir);
}

function files_under($dir)
{
    $list = [];
    if (!is_dir($dir)) return $list;
    $it = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($dir, FilesystemIterator::SKIP_DOTS));
    foreach ($it as $f) if ($f->isFile()) $list[] = $f->getPathname();
    return $list;
}

function read_list($file)
{
    if (!is_file($file)) return null;
    $d = json_decode((string) file_get_contents($file), true);
    return is_array($d) ? $d : null;
}

$step = (string) ($_GET['step'] ?? '');

/* ------------------------------------------------------------ extract */
if ($step === 'extract') {
    $stage = $ROOT . '/app/_staging';
    rrmdir($stage);
    rrmdir($RB);
    @mkdir($stage, 0755, true);
    @mkdir($RB . '/files', 0755, true);

    $entries = [];
    $put = function ($name, $data) use ($stage, &$entries) {
        $rel = safe_rel($name);
        if ($rel === null) return;
        if ($data === false) out(['ok' => false, 'error' => 'zip-read-failed', 'file' => $rel], 500);
        @mkdir(dirname("$stage/$rel"), 0755, true);
        if (file_put_contents("$stage/$rel", $data) === false) out(['ok' => false, 'error' => 'stage-write-failed', 'file' => $rel], 500);
        $entries[] = $rel;
    };
    if (class_exists('ZipArchive')) {
        $zip = new ZipArchive();
        if ($zip->open($ZIP) !== true) out(['ok' => false, 'error' => 'zip-open-failed'], 500);
        for ($i = 0; $i < $zip->numFiles; $i++) {
            $name = $zip->getNameIndex($i);
            if (substr($name, -1) !== '/') $put($name, $zip->getFromIndex($i));
        }
        $zip->close();
    } elseif (class_exists('PharData')) {
        // Hosts without the zip extension can still read the archive with Phar.
        try {
            $phar = new PharData($ZIP);
            $prefix = 'phar://' . str_replace('\\', '/', $ZIP) . '/';
            foreach (new RecursiveIteratorIterator($phar) as $file) {
                $path = str_replace('\\', '/', $file->getPathname());
                $name = strpos($path, $prefix) === 0 ? substr($path, strlen($prefix)) : $file->getFilename();
                $put($name, file_get_contents($file->getPathname()));
            }
        } catch (Exception $e) {
            out(['ok' => false, 'error' => 'zip-open-failed', 'detail' => $e->getMessage()], 500);
        }
    } else {
        out(['ok' => false, 'error' => 'php-zip-missing'], 500);
    }
    if (!in_array('index.html', $entries, true) || !in_array('index.php', $entries, true)) out(['ok' => false, 'error' => 'incomplete-build'], 500);

    // Old content file: keep a copy so a rollback can put it back.
    if (is_file("$ROOT/content.json")) @copy("$ROOT/content.json", "$RB/legacy-content.json");

    $created = [];
    $failed = [];
    // .htaccess last, so the site switches over in one step at the end.
    usort($entries, function ($a, $b) { return ($a === '.htaccess') - ($b === '.htaccess'); });
    foreach ($entries as $rel) {
        $dst = "$ROOT/$rel";
        if (is_file($dst)) {
            @mkdir(dirname("$RB/files/$rel"), 0755, true);
            @copy($dst, "$RB/files/$rel");
        } else {
            $created[] = $rel;
        }
        @mkdir(dirname($dst), 0755, true);
        if (!@rename("$stage/$rel", $dst) && !@copy("$stage/$rel", $dst)) $failed[] = $rel;
    }
    file_put_contents("$RB/created.json", json_encode($created));
    rrmdir($stage);
    if ($failed) out(['ok' => false, 'error' => 'write-failed', 'files' => array_slice($failed, 0, 20)], 500);
    out(['ok' => true, 'files' => count($entries), 'new' => count($created)]);
}

/* ----------------------------------------------------------- rollback */
if ($step === 'rollback') {
    $restored = 0;
    foreach (files_under("$RB/files") as $backup) {
        $rel = substr(str_replace('\\', '/', $backup), strlen(str_replace('\\', '/', "$RB/files/")));
        if (safe_rel($rel) === null) continue;
        if (@copy($backup, "$ROOT/$rel")) $restored++;
    }
    foreach (read_list("$RB/created.json") ?: [] as $rel) {
        if (safe_rel($rel) !== null) @unlink("$ROOT/$rel");
    }
    if (!is_file("$ROOT/content.json") && is_file("$RB/legacy-content.json")) @copy("$RB/legacy-content.json", "$ROOT/content.json");
    rrmdir($RB);
    @unlink($ZIP);
    @unlink(__FILE__);
    out(['ok' => true, 'restored' => $restored]);
}

/* ----------------------------------------------------------- finalize */
if ($step === 'finalize') {
    $new = read_list("$ROOT/app/deploy-manifest.new.json");
    if (!$new) out(['ok' => false, 'error' => 'manifest-missing'], 500);
    $newSet = array_flip($new);
    $current = read_list("$ROOT/app/deploy-manifest.json");
    $older = read_list("$ROOT/app/deploy-manifest.prev.json");
    $deleted = [];
    $del = function ($rel) use ($ROOT, &$deleted) {
        if (safe_rel($rel) === null || !is_file("$ROOT/$rel")) return;
        if (@unlink("$ROOT/$rel")) $deleted[] = $rel;
    };

    if ($current === null) {
        // First deploy of this version: remove the previous site's leftovers.
        foreach (['info.php', 'config.php', 'config.example.php', 'generate_hash.php', 'icons.svg', 'favicon.svg', 'favicon.png', 'unzip.php', 'deploy.zip'] as $f) $del($f);
        foreach (['advantage', 'brand', 'gallery', 'hero', 'members', 'partners', 'portfolio', 'services', 'team', 'textures'] as $dir) {
            foreach (files_under("$ROOT/$dir") as $file) {
                $rel = substr(str_replace('\\', '/', $file), strlen(str_replace('\\', '/', "$ROOT/")));
                $del($rel);
            }
            rrmdir("$ROOT/$dir");
        }
        // Files created by an old Windows zip, with backslashes in their names.
        foreach (scandir($ROOT) ?: [] as $name) {
            if (strpos($name, '\\') !== false && is_file("$ROOT/$name")) {
                if (@unlink("$ROOT/$name")) $deleted[] = $name;
            }
        }
        // Old hashed bundles: nothing of the previous build is needed any more.
        foreach (glob("$ROOT/assets/*") ?: [] as $file) {
            $rel = 'assets/' . basename($file);
            if (!isset($newSet[$rel])) $del($rel);
        }
    } elseif ($older !== null) {
        // Keep the previous build's files one more cycle (open pages may still
        // request them); delete what only the build before that used.
        $keep = $newSet + array_flip($current);
        foreach ($older as $rel) if (!isset($keep[$rel])) $del($rel);
    }

    if ($current !== null) @file_put_contents("$ROOT/app/deploy-manifest.prev.json", json_encode($current));
    @rename("$ROOT/app/deploy-manifest.new.json", "$ROOT/app/deploy-manifest.json");
    rrmdir($RB);
    @unlink($ZIP);
    @unlink(__FILE__);
    out(['ok' => true, 'deleted' => count($deleted), 'sample' => array_slice($deleted, 0, 15)]);
}

out(['ok' => false, 'error' => 'unknown-step'], 400);
