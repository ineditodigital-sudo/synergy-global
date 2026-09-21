<?php
/**
 * Server-side SEO: per-URL <head> tags, JSON-LD structured data and a
 * no-JavaScript fallback body. Mirrors src/content/site.js (resolveRoute and
 * pageSeo) so crawlers and social networks see the same titles as visitors.
 */
require_once __DIR__ . '/bootstrap.php';

function sg_clip($text, $max = 160)
{
    $t = trim(preg_replace('/\s+/u', ' ', (string) $text));
    if (!function_exists('mb_strlen')) {
        return strlen($t) <= $max ? $t : rtrim(substr($t, 0, $max - 3)) . '...';
    }
    if (mb_strlen($t, 'UTF-8') <= $max) return $t;
    $cut = mb_substr($t, 0, $max - 1, 'UTF-8');
    $space = mb_strrpos($cut, ' ', 0, 'UTF-8');
    if ($space !== false && $space > $max - 20) $cut = mb_substr($cut, 0, $space, 'UTF-8');
    return rtrim($cut, " ,;:.–—-") . '…';
}

function sg_slug_of($item, $textKey)
{
    $slug = sg_str($item, 'slug');
    if ($slug !== '') return $slug;
    $s = strtolower(trim(preg_replace('/[^A-Za-z0-9]+/', '-', sg_str($item, $textKey)), '-'));
    return $s !== '' ? $s : 'item';
}

function sg_property_place($p)
{
    return implode(', ', array_filter([sg_str($p, 'neighborhood'), sg_str($p, 'city'), sg_str($p, 'state')], 'strlen'));
}

function sg_visible($item)
{
    return sg_get($item, 'visible', true) !== false;
}

/** What does this path show? Mirrors resolveRoute() in site.js. */
function sg_resolve($content, $path)
{
    $path = strtolower(rtrim($path, '/'));
    if ($path === '') $path = '/';
    $simple = [
        '/' => 'home', '/portfolio' => 'portfolio', '/mission' => 'mission', '/about' => 'about',
        '/team' => 'about', '/services' => 'services', '/partnerships' => 'partnerships',
        '/legal' => 'legal', '/contact' => 'contact',
    ];
    if (isset($simple[$path])) {
        return ['type' => $simple[$path], 'canonical' => $path === '/team' ? '/about' : $path];
    }
    if (preg_match('#^/portfolio/([^/]+)$#', $path, $m)) {
        foreach (sg_list($content, 'portfolio.items') as $p) {
            $slug = sg_slug_of($p, 'title');
            if (sg_visible($p) && ($slug === $m[1] || sg_str($p, 'id') === $m[1])) {
                return ['type' => 'property', 'item' => $p, 'canonical' => '/portfolio/' . $slug];
            }
        }
    } elseif (preg_match('#^/services/([^/]+)$#', $path, $m)) {
        foreach (sg_list($content, 'services.items') as $s) {
            $slug = sg_slug_of($s, 'title');
            if (sg_visible($s) && sg_get($s, 'hasPage', true) !== false && $slug === $m[1]) {
                return ['type' => 'service', 'item' => $s, 'canonical' => '/services/' . $slug];
            }
        }
    } elseif (preg_match('#^/team/([^/]+)$#', $path, $m)) {
        foreach (sg_list($content, 'about.team') as $t) {
            $slug = sg_slug_of($t, 'name');
            if (sg_visible($t) && ($slug === $m[1] || sg_str($t, 'id') === $m[1])) {
                return ['type' => 'member', 'item' => $t, 'canonical' => '/team/' . $slug];
            }
        }
    }
    return ['type' => 'notfound', 'canonical' => ''];
}

/** Title (without suffix), description, image, noindex. Mirrors pageSeo(). */
function sg_page_seo($content, $route)
{
    $shareImage = sg_str($content, 'settings.shareImage');
    $base = ['image' => $shareImage, 'noindex' => !sg_allow_indexing($content)];
    $type = $route['type'];
    $pages = ['home', 'portfolio', 'mission', 'about', 'services', 'partnerships', 'legal', 'contact'];
    if (in_array($type, $pages, true)) {
        $seo = $base + [
            'title' => sg_str($content, $type . '.seo.title'),
            'description' => sg_str($content, $type . '.seo.description'),
        ];
        if ($type === 'home' && sg_str($content, 'home.seo.image') !== '') $seo['image'] = sg_str($content, 'home.seo.image');
        return $seo;
    }
    if ($type === 'property') {
        $p = $route['item'];
        $place = sg_property_place($p);
        $phrases = ['For Sale' => 'for sale', 'Coming Soon' => 'coming soon', 'Pending' => 'pending sale', 'Sold' => 'sold', 'Off-Market' => 'available off-market', 'For Lease' => 'for lease'];
        $status = $phrases[sg_str($p, 'status')] ?? '';
        $auto = trim(preg_replace('/\s+/', ' ', (sg_str($p, 'type') ?: 'Property') . ' ' . $status . ' in ' . ($place ?: 'San Francisco, CA') . '.'));
        $auto = implode(' ', array_filter([$auto, sg_str($p, 'summary'), sg_str($p, 'price')], 'strlen'));
        $images = sg_list($p, 'images');
        return [
            'title' => sg_str($p, 'seo.title') ?: sg_str($p, 'title') . ($place ? ', ' . $place : ''),
            'description' => sg_clip(sg_str($p, 'seo.description') ?: $auto),
            'image' => $images ? sg_str($images[0], 'src') : $shareImage,
        ] + $base;
    }
    if ($type === 'service') {
        $s = $route['item'];
        return [
            'title' => sg_str($s, 'detail.seo.title') ?: sg_str($s, 'title'),
            'description' => sg_clip(sg_str($s, 'detail.seo.description') ?: (sg_str($s, 'summary') ?: sg_str($content, 'settings.defaultDescription'))),
            'image' => sg_str($s, 'detail.heroImage') ?: (sg_str($s, 'image') ?: $shareImage),
        ] + $base;
    }
    if ($type === 'member') {
        $m = $route['item'];
        $role = sg_str($m, 'role');
        return [
            'title' => sg_str($m, 'name') . ($role ? ', ' . $role : ''),
            'description' => sg_clip(sg_str($m, 'bio') ?: sg_str($m, 'name') . ', ' . $role),
            'image' => sg_str($m, 'image') ?: $shareImage,
        ] + $base;
    }
    return ['title' => 'Page Not Found', 'description' => sg_str($content, 'settings.defaultDescription'), 'image' => $shareImage, 'noindex' => true];
}

function sg_full_title($title, $suffix)
{
    $title = trim($title);
    $suffix = trim($suffix);
    if ($suffix === '') return $title;
    if ($title === '') return $suffix;
    return stripos($title, $suffix) !== false ? $title : $title . ' | ' . $suffix;
}

function sg_price_number($price)
{
    if (!preg_match('/\$\s*([\d,]+(?:\.\d+)?)\s*([mk])?/i', (string) $price, $m)) return null;
    $n = (float) str_replace(',', '', $m[1]);
    if (!empty($m[2])) $n *= strtolower($m[2]) === 'm' ? 1000000 : 1000;
    return $n > 0 ? $n : null;
}

/** schema.org data for search engines (JSON-LD). */
function sg_json_ld($content, $route, $seo, $siteUrl)
{
    $s = sg_get($content, 'settings', []);
    $name = sg_str($content, 'settings.legalName') ?: 'Synergy Global Development & Investments, Inc.';
    $address = array_filter([
        '@type' => 'PostalAddress',
        'streetAddress' => sg_str($s, 'streetAddress'),
        'addressLocality' => sg_str($s, 'city'),
        'addressRegion' => sg_str($s, 'state'),
        'postalCode' => sg_str($s, 'postalCode'),
        'addressCountry' => sg_str($s, 'country') === 'United States' ? 'US' : sg_str($s, 'country'),
    ]);
    $sameAs = array_values(array_filter((array) sg_get($s, 'social', []), function ($u) {
        return is_string($u) && preg_match('#^https?://#i', $u);
    }));
    $org = array_filter([
        '@type' => sg_str($s, 'licenseNumber') !== '' ? ['Organization', 'RealEstateAgent'] : 'Organization',
        '@id' => $siteUrl . '/#organization',
        'name' => $name,
        'alternateName' => sg_str($s, 'siteName'),
        'url' => $siteUrl . '/',
        'logo' => sg_absolute($siteUrl, sg_str($content, 'style.logo')),
        'image' => sg_absolute($siteUrl, sg_str($s, 'shareImage')),
        'description' => sg_str($s, 'defaultDescription'),
        'email' => sg_str($s, 'email'),
        'telephone' => sg_str($s, 'phone'),
        'address' => count($address) > 1 ? $address : null,
        'areaServed' => sg_str($s, 'areaServed') ? ['@type' => 'Place', 'name' => sg_str($s, 'areaServed')] : null,
        'sameAs' => $sameAs ?: null,
    ]);

    $site = [
        '@type' => 'WebSite',
        '@id' => $siteUrl . '/#website',
        'url' => $siteUrl . '/',
        'name' => sg_str($s, 'siteName') ?: 'Synergy Global',
        'publisher' => ['@id' => $siteUrl . '/#organization'],
        'inLanguage' => 'en-US',
    ];
    $global = ['@context' => 'https://schema.org', '@graph' => [$org, $site]];

    $url = $siteUrl . ($route['canonical'] === '/' ? '/' : $route['canonical']);
    $crumbs = [['Home', $siteUrl . '/']];
    $page = null;

    if ($route['type'] === 'property') {
        $p = $route['item'];
        $crumbs[] = ['Properties', $siteUrl . '/portfolio'];
        $crumbs[] = [sg_str($p, 'title'), $url];
        $images = array_map(function ($i) use ($siteUrl) { return sg_absolute($siteUrl, sg_str($i, 'src')); }, sg_list($p, 'images'));
        $typeMap = ['Single-Family Home' => 'SingleFamilyResidence', 'Townhome' => 'SingleFamilyResidence', 'Condominium' => 'Apartment', 'Multi-Family' => 'ApartmentComplex'];
        $residence = array_filter([
            '@type' => $typeMap[sg_str($p, 'type')] ?? 'Accommodation',
            'name' => sg_str($p, 'title'),
            'address' => array_filter([
                '@type' => 'PostalAddress',
                'streetAddress' => preg_match('/^\d/', sg_str($p, 'title')) ? sg_str($p, 'title') : null,
                'addressLocality' => sg_str($p, 'city'),
                'addressRegion' => sg_str($p, 'state'),
                'postalCode' => sg_str($p, 'postalCode'),
                'addressCountry' => 'US',
            ]),
            'numberOfBedrooms' => is_numeric(sg_str($p, 'beds')) ? (float) sg_str($p, 'beds') : null,
            'numberOfBathroomsTotal' => is_numeric(sg_str($p, 'baths')) ? (float) sg_str($p, 'baths') : null,
            'floorSize' => is_numeric(str_replace(',', '', sg_str($p, 'sqft')))
                ? ['@type' => 'QuantitativeValue', 'value' => (float) str_replace(',', '', sg_str($p, 'sqft')), 'unitCode' => 'FTK'] : null,
            'yearBuilt' => is_numeric(sg_str($p, 'yearBuilt')) ? (int) sg_str($p, 'yearBuilt') : null,
        ]);
        $price = sg_price_number(sg_str($p, 'price'));
        $availability = ['For Sale' => 'https://schema.org/InStock', 'Coming Soon' => 'https://schema.org/PreOrder', 'Pending' => 'https://schema.org/LimitedAvailability', 'Sold' => 'https://schema.org/SoldOut', 'For Lease' => 'https://schema.org/InStock'];
        $page = array_filter([
            '@type' => 'RealEstateListing',
            '@id' => $url . '#listing',
            'url' => $url,
            'name' => sg_str($p, 'title'),
            'description' => $seo['description'],
            'image' => $images ?: null,
            'about' => $residence,
            'offers' => array_filter([
                '@type' => 'Offer',
                'price' => $price,
                'priceCurrency' => $price ? 'USD' : null,
                'availability' => $availability[sg_str($p, 'status')] ?? null,
                'seller' => ['@id' => $siteUrl . '/#organization'],
            ]),
        ]);
    } elseif ($route['type'] === 'member') {
        $m = $route['item'];
        $crumbs[] = ['Leadership', $siteUrl . '/about'];
        $crumbs[] = [sg_str($m, 'name'), $url];
        $page = array_filter([
            '@type' => 'Person',
            '@id' => $url . '#person',
            'name' => sg_str($m, 'name'),
            'jobTitle' => sg_str($m, 'role'),
            'image' => sg_absolute($siteUrl, sg_str($m, 'image')),
            'email' => sg_str($m, 'email') ? 'mailto:' . sg_str($m, 'email') : null,
            'worksFor' => ['@id' => $siteUrl . '/#organization'],
            'url' => $url,
            'sameAs' => preg_match('#^https?://#i', sg_str($m, 'linkedin')) ? [sg_str($m, 'linkedin')] : null,
            'knowsAbout' => array_values(array_filter((array) sg_get($m, 'specialties', []), 'is_string')) ?: null,
        ]);
    } elseif ($route['type'] === 'service') {
        $sv = $route['item'];
        $crumbs[] = ['Services', $siteUrl . '/services'];
        $crumbs[] = [sg_str($sv, 'title'), $url];
        $page = array_filter([
            '@type' => 'Service',
            '@id' => $url . '#service',
            'name' => sg_str($sv, 'title'),
            'description' => $seo['description'],
            'provider' => ['@id' => $siteUrl . '/#organization'],
            'areaServed' => sg_str($s, 'areaServed') ?: null,
            'url' => $url,
        ]);
    }

    $graph = [];
    if ($page) $graph[] = $page;
    if (count($crumbs) > 1) {
        $items = [];
        foreach ($crumbs as $i => $c) $items[] = ['@type' => 'ListItem', 'position' => $i + 1, 'name' => $c[0], 'item' => $c[1]];
        $graph[] = ['@type' => 'BreadcrumbList', 'itemListElement' => $items];
    }
    $flags = JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP;
    $out = '<script type="application/ld+json">' . json_encode($global, $flags) . '</script>';
    if ($graph) {
        $out .= "\n    " . '<script type="application/ld+json" id="synergy-jsonld-page">'
            . json_encode(['@context' => 'https://schema.org', '@graph' => $graph], $flags) . '</script>';
    }
    return $out;
}

/** Everything that goes between <!--seo:start--> and <!--seo:end-->. */
function sg_head_html($content, $route, $seo)
{
    $siteUrl = sg_site_url($content);
    $title = sg_full_title($seo['title'], sg_str($content, 'settings.titleSuffix'));
    $desc = $seo['description'];
    $image = sg_absolute($siteUrl, $seo['image']);
    $canonical = $route['canonical'] !== '' ? $siteUrl . ($route['canonical'] === '/' ? '/' : $route['canonical']) : '';
    $robots = $seo['noindex'] ? 'noindex, nofollow' : 'index, follow, max-image-preview:large';
    $type = $route['type'] === 'property' ? 'product' : ($route['type'] === 'member' ? 'profile' : 'website');

    $lines = [
        '<title>' . sg_e($title) . '</title>',
        '<meta name="description" content="' . sg_e($desc) . '" />',
        '<meta name="robots" content="' . $robots . '" />',
    ];
    if ($canonical) $lines[] = '<link rel="canonical" href="' . sg_e($canonical) . '" />';
    $lines[] = '<meta property="og:site_name" content="' . sg_e(sg_str($content, 'settings.siteName') ?: 'Synergy Global') . '" />';
    $lines[] = '<meta property="og:locale" content="en_US" />';
    $lines[] = '<meta property="og:type" content="' . $type . '" />';
    $lines[] = '<meta property="og:title" content="' . sg_e($title) . '" />';
    $lines[] = '<meta property="og:description" content="' . sg_e($desc) . '" />';
    if ($canonical) $lines[] = '<meta property="og:url" content="' . sg_e($canonical) . '" />';
    if ($image) {
        $lines[] = '<meta property="og:image" content="' . sg_e($image) . '" />';
        $lines[] = '<meta name="twitter:image" content="' . sg_e($image) . '" />';
    }
    $lines[] = '<meta name="twitter:card" content="summary_large_image" />';
    $lines[] = '<meta name="twitter:title" content="' . sg_e($title) . '" />';
    $lines[] = '<meta name="twitter:description" content="' . sg_e($desc) . '" />';
    if ($route['type'] !== 'notfound') $lines[] = sg_json_ld($content, $route, $seo, $siteUrl);
    return implode("\n    ", $lines);
}

/** Readable fallback for crawlers and browsers without JavaScript. */
function sg_noscript_html($content, $route, $seo)
{
    $h = [];
    $h[] = '<div style="max-width:960px;margin:0 auto;padding:120px 24px;font-family:sans-serif;color:#2C3E35">';
    $h[] = '<h1>' . sg_e($seo['title']) . '</h1>';
    if ($seo['description']) $h[] = '<p>' . sg_e($seo['description']) . '</p>';

    if ($route['type'] === 'property') {
        $p = $route['item'];
        $h[] = '<p>' . sg_e(implode(' · ', array_filter([sg_property_place($p), sg_str($p, 'status'), sg_str($p, 'price')], 'strlen'))) . '</p>';
        foreach (preg_split('/\n\s*\n/', sg_str($p, 'description')) as $para) if (trim($para) !== '') $h[] = '<p>' . sg_e(trim($para)) . '</p>';
        $features = array_filter((array) sg_get($p, 'features', []), 'is_string');
        if ($features) $h[] = '<ul><li>' . implode('</li><li>', array_map('sg_e', $features)) . '</li></ul>';
    } elseif ($route['type'] === 'member') {
        foreach (preg_split('/\n\s*\n/', sg_str($route['item'], 'bio')) as $para) if (trim($para) !== '') $h[] = '<p>' . sg_e(trim($para)) . '</p>';
    } elseif ($route['type'] === 'service') {
        $h[] = '<p>' . sg_e(sg_str($route['item'], 'detail.introText')) . '</p>';
    }

    $props = array_filter(sg_list($content, 'portfolio.items'), 'sg_visible');
    if ($props) {
        $h[] = '<h2>Properties</h2><ul>';
        foreach ($props as $p) {
            $h[] = '<li><a href="/portfolio/' . sg_e(sg_slug_of($p, 'title')) . '">' . sg_e(sg_str($p, 'title')) . '</a> – '
                . sg_e(implode(' · ', array_filter([sg_property_place($p), sg_str($p, 'status'), sg_str($p, 'price')], 'strlen'))) . '</li>';
        }
        $h[] = '</ul>';
    }
    $h[] = '<nav><ul>';
    foreach (sg_list($content, 'navigation.mainMenu') as $item) {
        if (!sg_visible($item)) continue;
        $path = sg_str($item, 'path', '/');
        if (!preg_match('#^/#', $path)) continue;
        $h[] = '<li><a href="' . sg_e($path) . '">' . sg_e(sg_str($item, 'label')) . '</a></li>';
    }
    $h[] = '</ul></nav>';
    $email = sg_str($content, 'settings.email');
    if ($email) $h[] = '<p>Contact: <a href="mailto:' . sg_e($email) . '">' . sg_e($email) . '</a></p>';
    $h[] = '</div>';
    return implode('', $h);
}

/** Published content embedded in the page so it renders without a second request. */
function sg_content_script($content)
{
    $json = json_encode($content, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP | JSON_HEX_APOS | JSON_HEX_QUOT);
    if ($json === false) return '';
    return '<script id="synergy-content" type="application/json">' . $json . '</script>';
}
