<?php
/**
 * /robots.txt — follows the "Allow search engines" switch in the CMS.
 * While indexing is off, crawlers may still visit (so they can read the
 * noindex tags and drop any old staging pages), but nothing gets indexed.
 */
require_once __DIR__ . '/app/bootstrap.php';

$content = sg_load_content();
header('Content-Type: text/plain; charset=utf-8');
header('Cache-Control: public, max-age=3600');

echo "User-agent: *\n";
echo "Disallow: /admin\n";
echo "Disallow: /api.php\n";
if (sg_allow_indexing($content)) {
    echo "\nSitemap: " . sg_site_url($content) . "/sitemap.xml\n";
}
