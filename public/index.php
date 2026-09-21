<?php
/**
 * Synergy Global — front controller for every page of the site.
 *
 * Serves the built index.html with the right <title>, description, canonical
 * URL, social tags and structured data for the requested URL, plus the
 * published content embedded so the page renders without a second request.
 * If anything goes wrong it falls back to the plain index.html, so the site
 * never goes down because of SEO.
 */

$sgTemplateFile = __DIR__ . '/index.html';

function sg_plain_fallback($file)
{
    if (!headers_sent()) header('Content-Type: text/html; charset=utf-8');
    if (is_file($file)) {
        readfile($file);
    } else {
        http_response_code(503);
        echo '<!doctype html><title>Synergy Global</title><p style="font-family:sans-serif;padding:40px">The site is being updated. Please try again in a minute.</p>';
    }
    exit;
}

try {
    require_once __DIR__ . '/app/bootstrap.php';
    require_once __DIR__ . '/app/seo.php';

    $template = @file_get_contents($sgTemplateFile);
    if ($template === false) sg_plain_fallback($sgTemplateFile);

    $uri = $_SERVER['REQUEST_URI'] ?? '/';
    $path = rawurldecode((string) parse_url($uri, PHP_URL_PATH));
    if ($path === '' || $path === '/index.php' || $path === '/index.html') $path = '/';
    $query = (string) parse_url($uri, PHP_URL_QUERY);

    header('Content-Type: text/html; charset=utf-8');
    header('Cache-Control: no-cache, must-revalidate');
    header('X-Content-Type-Options: nosniff');

    // Admin panel: never indexed, no public content needed.
    if (preg_match('#^/admin(/|$)#i', $path)) {
        header('X-Robots-Tag: noindex, nofollow');
        $head = '<title>Synergy Global · CMS</title>' . "\n    " . '<meta name="robots" content="noindex, nofollow" />';
        echo preg_replace('/<!--seo:start-->.*?<!--seo:end-->/s', $head, $template, 1);
        exit;
    }

    // One address per page: drop trailing slashes (301).
    if ($path !== '/' && substr($path, -1) === '/') {
        $clean = rtrim($path, '/');
        header('Location: ' . ($clean === '' ? '/' : $clean) . ($query !== '' ? '?' . $query : ''), true, 301);
        exit;
    }

    $content = sg_load_content();
    $route = sg_resolve($content, $path);

    // Old numeric links (/team/1, /portfolio/2) move permanently to the named address.
    if (in_array($route['type'], ['property', 'member'], true) && strtolower($path) !== $route['canonical']) {
        header('Location: ' . $route['canonical'] . ($query !== '' ? '?' . $query : ''), true, 301);
        exit;
    }

    $seo = sg_page_seo($content, $route);
    if ($route['type'] === 'notfound') http_response_code(404);
    if ($seo['noindex']) header('X-Robots-Tag: noindex, nofollow');

    $html = preg_replace_callback('/<!--seo:start-->.*?<!--seo:end-->/s', function () use ($content, $route, $seo) {
        return sg_head_html($content, $route, $seo);
    }, $template, 1);
    $html = str_replace('<!--seo:body-->', sg_noscript_html($content, $route, $seo), $html);
    $html = str_replace('<!--seo:data-->', sg_content_script($content), $html);
    if (!is_string($html) || $html === '') sg_plain_fallback($sgTemplateFile);
    echo $html;
} catch (Throwable $e) {
    error_log('[synergy index.php] ' . $e->getMessage());
    sg_plain_fallback($sgTemplateFile);
}
