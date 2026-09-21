<?php
/** /sitemap.xml — every public page, generated from the published content. */
require_once __DIR__ . '/app/bootstrap.php';
require_once __DIR__ . '/app/seo.php';

$content = sg_load_content();
$base = sg_site_url($content);
$updated = sg_str($content, '_meta.updatedAt');
$lastmod = $updated !== '' ? substr($updated, 0, 10) : gmdate('Y-m-d');

$urls = [
    ['/', '1.0'], ['/portfolio', '0.9'], ['/services', '0.7'], ['/about', '0.7'],
    ['/mission', '0.5'], ['/partnerships', '0.5'], ['/contact', '0.6'], ['/legal', '0.3'],
];
foreach (sg_list($content, 'portfolio.items') as $p) {
    if (sg_visible($p)) $urls[] = ['/portfolio/' . sg_slug_of($p, 'title'), '0.9'];
}
foreach (sg_list($content, 'services.items') as $s) {
    if (sg_visible($s) && sg_get($s, 'hasPage', true) !== false) $urls[] = ['/services/' . sg_slug_of($s, 'title'), '0.6'];
}
foreach (sg_list($content, 'about.team') as $t) {
    if (sg_visible($t)) $urls[] = ['/team/' . sg_slug_of($t, 'name'), '0.5'];
}

header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
if (!sg_allow_indexing($content)) header('X-Robots-Tag: noindex');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach ($urls as $u) {
    echo '  <url><loc>' . sg_e($base . ($u[0] === '/' ? '/' : $u[0])) . '</loc><lastmod>' . $lastmod . '</lastmod><priority>' . $u[1] . "</priority></url>\n";
}
echo "</urlset>\n";
