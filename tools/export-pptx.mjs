/**
 * Export the public website to an editable PowerPoint for client review.
 *
 * Every page becomes a run of 16:9 slides that look like the site on a laptop
 * (1440 × 810, one slide per screen, in scroll order). The design is a flat
 * picture in the slide background; every text on top of it is a real text box
 * and every photo, logo and icon is its own picture. The client can retype
 * copy, swap a photo (right-click › Change Picture), delete things, draw and
 * leave comments, then send the file back. Nothing reads the deck back into
 * the site: it is a reference for making the changes in the CMS.
 *
 *   npm run export:pptx
 *   npm run export:pptx -- --url http://127.0.0.1:8787 --lang es
 *
 * Options
 *   --url   site to capture (default: the live site)
 *   --out   output file (default: exports/<name> <date>.pptx)
 *   --lang  en | es, language of the guide slides and forms (default: en)
 *   --only  /path,/path to capture just those pages (for testing)
 *   --debug folder to also save the reference screenshot of every slide
 *
 * Needs Chrome or Edge. Set CHROME_PATH if it is not in the usual place.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';
import PptxGenJS from 'pptxgenjs';
import { STATIC_PAGES, propertyPath, memberPath, servicePath, resolveRoute, pageSeo, fullTitle } from '../src/content/site.js';
import { PROPERTY_TEMPLATE, PROPERTY_STATUSES, PROPERTY_TYPES } from '../src/content/schema.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

const W = 1440; // capture width in CSS px = slide width
const H = 810; // one slide = one 16:9 screen
const DPR = 2; // screenshot density
const PX = 1 / 96; // inches per CSS px, so 16px text becomes 12pt
const PT = 0.75; // points per CSS px
const BG_SCALE = 1.5; // resolution of slide backgrounds and photos
const PASTEBOARD = '#E4E1DC'; // fills the rest of a slide when a page ends mid-screen

// The site's web fonts are not installed on the client's computer, so the
// deck uses fonts that ship with Office. Sizes are adjusted per text box so
// the lines break where they break on the site.
const FONT_MAP = { alata: 'Century Gothic', montserrat: 'Century Gothic', 'myriad pro': 'Calibri' };
const FALLBACK_FONT = 'Arial';
const UI_FONT = 'Century Gothic';
const BRAND = { sage: '2C3E35', sand: 'C6B7A0', bone: 'FBF9F6', charcoal: '1A1A1A', beige: 'D9D2C5', ink: '3A3A3A' };

// With "exactly" line spacing PowerPoint puts the first baseline at 3/4 of
// the line height below the top of the box (measured; the same for every
// font). Text boxes are placed so that baseline lands on the site's baseline.
const BASELINE = 0.75;

const TEXT = {
  en: {
    pages: {
      home: 'Home',
      portfolio: 'Properties',
      mission: 'Mission & Vision',
      about: 'About Us',
      services: 'Services',
      partnerships: 'Partnerships',
      legal: 'Legal Services',
      contact: 'Contact',
      property: 'Property',
      member: 'Team',
      service: 'Service',
    },
    coverTitle: 'Website review',
    coverNote: 'This is the site as it looks today. Mark your changes and send this file back.',
    howTitle: 'How to mark your changes',
    steps: [
      ['Change the text', 'Click any text and type over it, like in any presentation.'],
      ['Change the photos', 'Right-click a photo › Change Picture. You can also delete it or paste another one.'],
      ['Fill in the forms', 'Some slides are forms (properties, menu, company details). Type in the white column. To add a property, duplicate the “New property” slide.'],
      ['Ask for anything', 'Leave a comment (Review › New Comment), draw arrows or circles, or write in the notes below each slide. Delete what you don’t want; add slides with new ideas.'],
      ['Send the file back', 'Save the presentation and send it. It’s fine if it ends up messy: we keep the original to compare.'],
    ],
    howNote:
      'First come the parts that appear on every page (menu, footer, company details, logos). Then each page of the site, in the order you see it when scrolling down, with a form for every property. At the end: all photos, all partners and how the site shows up on Google. Fonts are approximate; the site keeps its own.',
    pageOf: (i, n) => `PAGE ${i} OF ${n}`,
    extraPage: 'EXTRA PAGE',
    slides: (n) => (n === 1 ? '1 slide' : `${n} slides`),
    screen: (i, n) => `Screen ${i} of ${n}`,
    notesPrompt: 'Your comments on this part:',
    continues: 'The page continues on the next slide',
    pageEnd: 'End of page',
    continued: '(continued)',
    endTitle: 'General comments',
    endHint: 'Write any general comment, idea or new page you would like to add.',
    date: (d) => d.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    file: 'Website review',
    yes: 'Yes',
    no: 'No',
    yesNo: 'Write Yes or No',
    onePerLine: 'One per line',
    videoBadge: '▶  On the website, this background is a video',
    siteWide: 'Header, footer & company',
    siteWideLabel: 'ON EVERY PAGE',
    siteWideItems: ['Menu at the top', 'Footer', 'Company details & social media', 'Logos, colors & fonts'],
    more: 'Photos, partners & Google',
    moreLabel: 'EVERYTHING ELSE',
    moreItems: ['All gallery photos', 'All partners', 'How the site shows up on Google', 'Page not found', 'What is hidden on the website'],
    cols: { item: 'Item', text: 'Text', goesTo: 'Goes to', shown: 'Shown', field: 'Field', value: 'Value', note: 'Notes', column: 'Column', link: 'Link' },
    header: {
      title: 'Menu at the top of every page',
      hint: 'Change the words directly above or in this table. “Goes to” is the page each link opens; write Yes or No to show or hide a link.',
      topBar: 'Top bar',
      topBarLink: 'Top bar link',
      menu: (i) => `Menu ${i}`,
      button: 'Button',
    },
    footer: {
      title: 'Footer links',
      hint: 'The footer is the same on every page. Change the words directly above or in this table.',
      bottom: 'Bottom line',
    },
    company: {
      title: 'Company details',
      hint: 'Used in the footer, on the contact page and by Google. Leave a value empty to hide it.',
      rows: {
        siteName: 'Short name',
        legalName: 'Legal name',
        email: 'Main email',
        phone: 'Main phone',
        streetAddress: 'Street address',
        city: 'City',
        state: 'State',
        postalCode: 'ZIP code',
        country: 'Country',
        areaServed: 'Area served',
        licenseNumber: 'Real estate license (DRE #)',
        showEqualHousing: 'Equal Housing Opportunity logo',
      },
      notes: { licenseNumber: 'Shown in the footer', areaServed: 'For Google', showEqualHousing: 'Write Yes or No' },
      social: { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', x: 'X (Twitter)' },
      socialNote: 'Paste the link to the profile',
    },
    brand: {
      title: 'Logos, colors & fonts',
      hint: 'To change a logo, right-click it › Change Picture. Colors and fonts are here for reference: tell us if you want a change.',
      logos: { logo: 'Logo on light backgrounds', logoOnDark: 'Logo on dark backgrounds', footerLogo: 'Footer logo' },
      colors: { accent: 'Accent', primary: 'Primary', background: 'Background', dark: 'Dark' },
      fonts: 'Fonts',
      fontRoles: { heading: 'Titles', body: 'Text', small: 'Small labels' },
    },
    property: {
      hint: 'Type over any value. Photo 1 is the main photo: right-click a photo › Change Picture, or paste new ones into the empty boxes.',
      hidden: 'Hidden — not on the website yet',
      hiddenHint: 'This listing is saved but hidden. Fill it in, add photos and write Yes in “Shown on the website” to publish it.',
      newTitle: 'New property',
      newHint: 'To add a property, duplicate this slide (right-click it in the list on the left › Duplicate Slide) and fill it in.',
      photos: 'Photos',
      photo: (n) => (n === 1 ? 'Photo 1 (main)' : `Photo ${n}`),
      paste: 'Paste a photo here',
      rows: {
        title: 'Property name',
        status: 'Status',
        type: 'Type',
        price: 'Price',
        neighborhood: 'Neighborhood',
        city: 'City, state & ZIP',
        beds: 'Bedrooms',
        baths: 'Bathrooms',
        sqft: 'Interior sq. ft.',
        lotSize: 'Lot size',
        yearBuilt: 'Year built',
        parking: 'Parking',
        summary: 'Short line under the name',
        description: 'Description',
        features: 'Features',
        visible: 'Shown on the website',
        featured: 'Featured on the home page',
      },
      notes: { price: 'e.g. $2,450,000 or Price Upon Request', summary: 'e.g. 3 BD · 2 BA · 1,800 sq. ft.', options: 'Options on the right' },
      statusOptions: 'Status options',
      typeOptions: 'Type options',
    },
    team: {
      title: 'Team — contact details',
      hint: 'Bios and photos are on each person’s page. Write Yes or No in the “Show” columns. Add a row for a new person.',
      cols: ['Name', 'Title', 'Email', 'Phone', 'Show phone', 'LinkedIn', 'Shown'],
    },
    contactSheet: {
      title: 'Contact form & messages',
      hint: 'What visitors see when they write to you, and where their messages should go.',
      rows: {
        formTitle: 'Form title',
        inquiryTypes: '“Inquiry type” options',
        submitLabel: 'Button',
        successTitle: 'After sending: title',
        successText: 'After sending: message',
        emails: 'Emails shown on the page',
        phone: 'Phone shown on the page',
        showMap: 'Show the map',
        mapQuery: 'Map location',
        sendTo: 'Send form messages to',
      },
      notes: { sendTo: 'Email address(es) that should receive the messages', mapQuery: 'An address or a place name' },
    },
    gallery: {
      title: 'All gallery photos',
      hint: 'These photos rotate in “Gallery” (Home) and “Press & Media” (About Us), in this order. Replace, delete or reorder them.',
      hidden: 'Hidden',
    },
    partners: {
      title: 'All partners',
      hint: 'The logos that rotate on the Partnerships page. Change a logo (right-click › Change Picture), a name or a website.',
      noLogo: 'No logo yet — paste one here',
      website: 'Website',
    },
    google: {
      title: 'How the site shows up on Google',
      hint: 'Each page as it can appear in Google results. Change the blue title (under 60 characters) or the gray description (under 160).',
    },
    preview: {
      title: 'When someone shares the website link',
      hint: 'The picture, title and text shown when the link is sent by text message, WhatsApp or social media.',
    },
    notFound: 'Page not found',
    notFoundSub: 'Shown when someone opens a broken or old link',
    hidden: {
      title: 'Hidden on the website',
      hint: 'These parts exist but are not shown right now. Write Yes to show one.',
      cols: ['What', 'Where', 'Show it?'],
      sections: {
        'navigation.topBar.visible': ['Top bar above the menu', 'Every page'],
        'navigation.showCta': ['Button in the menu', 'Every page'],
        'home.metrics.visible': ['Numbers (continents, projects…)', 'Home'],
        'home.featured.visible': ['Featured properties', 'Home'],
        'home.manifesto.visible': ['Our Purpose', 'Home'],
        'home.gallery.visible': ['Gallery', 'Home'],
        'home.team.visible': ['Leadership', 'Home'],
        'about.teamSection.visible': ['Leadership', 'About Us'],
        'about.gallery.visible': ['Press & Media', 'About Us'],
        'contact.info.showMap': ['Map', 'Contact'],
        'settings.showEqualHousing': ['Equal Housing Opportunity logo', 'Footer'],
      },
      menuItem: (l) => `Menu link “${l}”`,
      galleryPhoto: (n) => `Gallery photo ${n}`,
      menu: 'Menu',
      team: 'Team',
      gallery: 'Gallery',
    },
    untitled: 'Untitled',
  },
  es: {
    pages: {
      home: 'Inicio',
      portfolio: 'Propiedades',
      mission: 'Misión y visión',
      about: 'Nosotros',
      services: 'Servicios',
      partnerships: 'Alianzas',
      legal: 'Servicios legales',
      contact: 'Contacto',
      property: 'Propiedad',
      member: 'Equipo',
      service: 'Servicio',
    },
    coverTitle: 'Revisión del sitio web',
    coverNote: 'Así se ve hoy el sitio. Corrige, anota y devuélvenos este archivo.',
    howTitle: 'Cómo marcar tus cambios',
    steps: [
      ['Cambia los textos', 'Haz clic en cualquier texto y escribe encima, como en cualquier presentación.'],
      ['Cambia las fotos', 'Clic derecho sobre la foto › Cambiar imagen. También puedes borrarla o pegar otra.'],
      ['Llena las fichas', 'Algunas diapositivas son fichas (propiedades, menú, datos de la empresa). Escribe en la columna blanca. Para agregar una propiedad, duplica la diapositiva «Nueva propiedad».'],
      ['Pide lo que quieras', 'Deja un comentario (Revisar › Nuevo comentario), dibuja flechas o círculos, o escribe en las notas debajo de cada diapositiva. Borra lo que no quieras; agrega diapositivas con ideas.'],
      ['Devuélvenos el archivo', 'Guarda la presentación y envíala. No importa si queda desordenada: guardamos el original para comparar.'],
    ],
    howNote:
      'Primero va lo que aparece en todas las páginas (menú, pie de página, datos de la empresa, logos). Luego cada página del sitio, en el orden en que se ve al bajar, con una ficha por propiedad. Al final: todas las fotos, todos los aliados y cómo se ve el sitio en Google. Las tipografías son aproximadas; el sitio conserva las suyas.',
    pageOf: (i, n) => `PÁGINA ${i} DE ${n}`,
    extraPage: 'PÁGINA EXTRA',
    slides: (n) => (n === 1 ? '1 diapositiva' : `${n} diapositivas`),
    screen: (i, n) => `Pantalla ${i} de ${n}`,
    notesPrompt: 'Tus comentarios sobre esta parte:',
    continues: 'La página continúa en la siguiente diapositiva',
    pageEnd: 'Fin de la página',
    continued: '(continuación)',
    endTitle: 'Comentarios generales',
    endHint: 'Escribe aquí cualquier comentario general, idea o página nueva que quieras agregar.',
    date: (d) => d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
    file: 'Revisión del sitio',
    yes: 'Sí',
    no: 'No',
    yesNo: 'Escribe Sí o No',
    onePerLine: 'Uno por renglón',
    videoBadge: '▶  En el sitio, este fondo es un video',
    siteWide: 'Menú, pie de página y empresa',
    siteWideLabel: 'EN TODAS LAS PÁGINAS',
    siteWideItems: ['Menú superior', 'Pie de página', 'Datos de la empresa y redes sociales', 'Logos, colores y tipografías'],
    more: 'Fotos, aliados y Google',
    moreLabel: 'TODO LO DEMÁS',
    moreItems: ['Todas las fotos de la galería', 'Todos los aliados', 'Cómo se ve el sitio en Google', 'Página no encontrada', 'Lo que está oculto en el sitio'],
    cols: { item: 'Elemento', text: 'Texto', goesTo: 'Lleva a', shown: 'Visible', field: 'Campo', value: 'Valor', note: 'Notas', column: 'Columna', link: 'Enlace' },
    header: {
      title: 'Menú superior de todas las páginas',
      hint: 'Cambia las palabras directamente arriba o en esta tabla. «Lleva a» es la página que abre cada enlace; escribe Sí o No para mostrarlo u ocultarlo.',
      topBar: 'Barra superior',
      topBarLink: 'Enlace de la barra superior',
      menu: (i) => `Menú ${i}`,
      button: 'Botón',
    },
    footer: {
      title: 'Enlaces del pie de página',
      hint: 'El pie de página es igual en todas las páginas. Cambia las palabras directamente arriba o en esta tabla.',
      bottom: 'Línea inferior',
    },
    company: {
      title: 'Datos de la empresa',
      hint: 'Se usan en el pie de página, en la página de contacto y en Google. Deja un valor vacío para ocultarlo.',
      rows: {
        siteName: 'Nombre corto',
        legalName: 'Razón social',
        email: 'Correo principal',
        phone: 'Teléfono principal',
        streetAddress: 'Calle y número',
        city: 'Ciudad',
        state: 'Estado',
        postalCode: 'Código postal',
        country: 'País',
        areaServed: 'Zona que atienden',
        licenseNumber: 'Licencia inmobiliaria (DRE #)',
        showEqualHousing: 'Logo de Equal Housing Opportunity',
      },
      notes: { licenseNumber: 'Aparece en el pie de página', areaServed: 'Para Google', showEqualHousing: 'Escribe Sí o No' },
      social: { linkedin: 'LinkedIn', instagram: 'Instagram', facebook: 'Facebook', youtube: 'YouTube', x: 'X (Twitter)' },
      socialNote: 'Pega el enlace del perfil',
    },
    brand: {
      title: 'Logos, colores y tipografías',
      hint: 'Para cambiar un logo: clic derecho › Cambiar imagen. Los colores y tipografías son de referencia: dinos si quieres un cambio.',
      logos: { logo: 'Logo sobre fondos claros', logoOnDark: 'Logo sobre fondos oscuros', footerLogo: 'Logo del pie de página' },
      colors: { accent: 'Acento', primary: 'Principal', background: 'Fondo', dark: 'Oscuro' },
      fonts: 'Tipografías',
      fontRoles: { heading: 'Títulos', body: 'Texto', small: 'Etiquetas pequeñas' },
    },
    property: {
      hint: 'Escribe encima de cualquier valor. La foto 1 es la principal: clic derecho › Cambiar imagen, o pega fotos nuevas en los recuadros vacíos.',
      hidden: 'Oculta: todavía no está en el sitio',
      hiddenHint: 'Esta propiedad está guardada pero oculta. Llénala, agrega fotos y escribe Sí en «Visible en el sitio» para publicarla.',
      newTitle: 'Nueva propiedad',
      newHint: 'Para agregar una propiedad, duplica esta diapositiva (clic derecho en la lista de la izquierda › Duplicar diapositiva) y llénala.',
      photos: 'Fotos',
      photo: (n) => (n === 1 ? 'Foto 1 (principal)' : `Foto ${n}`),
      paste: 'Pega una foto aquí',
      rows: {
        title: 'Nombre de la propiedad',
        status: 'Estado',
        type: 'Tipo',
        price: 'Precio',
        neighborhood: 'Colonia / barrio',
        city: 'Ciudad, estado y C.P.',
        beds: 'Recámaras',
        baths: 'Baños',
        sqft: 'Pies² interiores',
        lotSize: 'Terreno',
        yearBuilt: 'Año de construcción',
        parking: 'Estacionamiento',
        summary: 'Línea corta bajo el nombre',
        description: 'Descripción',
        features: 'Características',
        visible: 'Visible en el sitio',
        featured: 'Destacada en Inicio',
      },
      notes: { price: 'p. ej. $2,450,000 o Price Upon Request', summary: 'p. ej. 3 BD · 2 BA · 1,800 sq. ft.', options: 'Opciones a la derecha' },
      statusOptions: 'Opciones de estado',
      typeOptions: 'Opciones de tipo',
    },
    team: {
      title: 'Equipo: datos de contacto',
      hint: 'La biografía y la foto están en la página de cada persona. Escribe Sí o No en las columnas «Mostrar». Agrega un renglón para una persona nueva.',
      cols: ['Nombre', 'Cargo', 'Correo', 'Teléfono', 'Mostrar teléfono', 'LinkedIn', 'Visible'],
    },
    contactSheet: {
      title: 'Formulario de contacto y mensajes',
      hint: 'Lo que ven los visitantes cuando te escriben, y a dónde deben llegar sus mensajes.',
      rows: {
        formTitle: 'Título del formulario',
        inquiryTypes: 'Opciones de «Inquiry type»',
        submitLabel: 'Botón',
        successTitle: 'Al enviar: título',
        successText: 'Al enviar: mensaje',
        emails: 'Correos en la página',
        phone: 'Teléfono en la página',
        showMap: 'Mostrar el mapa',
        mapQuery: 'Ubicación del mapa',
        sendTo: 'Enviar los mensajes a',
      },
      notes: { sendTo: 'Correo(s) que deben recibir los mensajes', mapQuery: 'Una dirección o un lugar' },
    },
    gallery: {
      title: 'Todas las fotos de la galería',
      hint: 'Estas fotos rotan en «Gallery» (Inicio) y «Press & Media» (Nosotros), en este orden. Reemplázalas, bórralas o cambia el orden.',
      hidden: 'Oculta',
    },
    partners: {
      title: 'Todos los aliados',
      hint: 'Los logos que rotan en la página de Alianzas. Cambia un logo (clic derecho › Cambiar imagen), un nombre o un sitio web.',
      noLogo: 'Sin logo: pega uno aquí',
      website: 'Sitio web',
    },
    google: {
      title: 'Cómo se ve el sitio en Google',
      hint: 'Cada página como puede aparecer en Google. Cambia el título azul (menos de 60 letras) o la descripción gris (menos de 160).',
    },
    preview: {
      title: 'Cuando alguien comparte el enlace del sitio',
      hint: 'La imagen, el título y el texto que aparecen al mandar el enlace por mensaje, WhatsApp o redes sociales.',
    },
    notFound: 'Página no encontrada',
    notFoundSub: 'Aparece cuando alguien abre un enlace roto o viejo',
    hidden: {
      title: 'Oculto en el sitio',
      hint: 'Estas partes existen pero hoy no se muestran. Escribe Sí para mostrar alguna.',
      cols: ['Qué', 'Dónde', '¿Mostrar?'],
      sections: {
        'navigation.topBar.visible': ['Barra sobre el menú', 'Todas las páginas'],
        'navigation.showCta': ['Botón del menú', 'Todas las páginas'],
        'home.metrics.visible': ['Cifras (continentes, proyectos…)', 'Inicio'],
        'home.featured.visible': ['Propiedades destacadas', 'Inicio'],
        'home.manifesto.visible': ['Our Purpose', 'Inicio'],
        'home.gallery.visible': ['Galería', 'Inicio'],
        'home.team.visible': ['Liderazgo', 'Inicio'],
        'about.teamSection.visible': ['Liderazgo', 'Nosotros'],
        'about.gallery.visible': ['Press & Media', 'Nosotros'],
        'contact.info.showMap': ['Mapa', 'Contacto'],
        'settings.showEqualHousing': ['Logo de Equal Housing Opportunity', 'Pie de página'],
      },
      menuItem: (l) => `Enlace del menú «${l}»`,
      galleryPhoto: (n) => `Foto ${n} de la galería`,
      menu: 'Menú',
      team: 'Equipo',
      gallery: 'Galería',
    },
    untitled: 'Sin nombre',
  },
};

/* ------------------------------------------------------------ options */

function arg(name, fallback) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 && process.argv[i + 1] && !process.argv[i + 1].startsWith('--') ? process.argv[i + 1] : fallback;
}

const SITE = String(arg('url', 'https://synergy.inedito.digital')).replace(/\/+$/, '');
const LANG = TEXT[arg('lang', 'en')] ? arg('lang', 'en') : 'en';
const T = TEXT[LANG];
const ONLY = arg('only', '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
const DEBUG = arg('debug', '');
const TODAY = new Date();
const OUT = path.resolve(arg('out', path.join(ROOT, 'exports', `Synergy Global - ${T.file} ${TODAY.toISOString().slice(0, 10)}.pptx`)));

function findChrome() {
  const local = process.env.LOCALAPPDATA || '';
  const candidates = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
    local && path.join(local, 'Google/Chrome/Application/chrome.exe'),
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const found = candidates.find((p) => fs.existsSync(p));
  if (!found) throw new Error('Chrome or Edge not found. Set CHROME_PATH to the browser executable.');
  return found;
}

/* ------------------------------------------------ in-page (site) helpers */

/**
 * Installed in every captured page. Everything here runs in the browser, so
 * it must not reference anything outside the function.
 */
function pageLib(fontMap, fallbackFont) {
  if (window.__x) return;
  const X = (window.__x = {});
  const one = document.createElement('canvas');
  one.width = one.height = 1;
  const cx = one.getContext('2d', { willReadFrequently: true });
  const mc = document.createElement('canvas').getContext('2d');

  /** Any CSS color (oklch, color-mix…) → { hex, a } in sRGB, or null if invisible. */
  X.color = (c) => {
    if (!c || c === 'transparent') return null;
    cx.clearRect(0, 0, 1, 1);
    cx.fillStyle = '#000';
    cx.fillStyle = c;
    cx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = cx.getImageData(0, 0, 1, 1).data;
    if (!a) return null;
    return { hex: [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase(), a: a / 255 };
  };
  const family = (s) => s.fontFamily.split(',')[0].replace(/["']/g, '').trim();
  const sub = (f) => fontMap[f.toLowerCase()] || fallbackFont;

  const css = `
    *, *::before, *::after { transition: none !important; animation: none !important; caret-color: transparent !important; }
    html.x-hidetext body *, html.x-hidetext body *::before, html.x-hidetext body *::after {
      color: transparent !important; -webkit-text-fill-color: transparent !important;
      text-shadow: none !important; text-decoration-color: transparent !important; }
    html.x-hidetext body ::placeholder { color: transparent !important; -webkit-text-fill-color: transparent !important; }
    html.x-hidetext body ::marker { color: transparent !important; }
    html.x-hideimg [data-x-img] { visibility: hidden !important; }
    html.x-hideimg [data-x-bg] { background-image: none !important; }
    html.x-hideiso [data-x-img="iso"] { visibility: hidden !important; }
    html.x-onlyiso, html.x-onlyiso body { background: transparent !important; }
    html.x-onlyiso body * { visibility: hidden !important; }
    html.x-onlyiso [data-x-img="iso"], html.x-onlyiso [data-x-img="iso"] * { visibility: visible !important; }
    html.x-solo, html.x-solo body { background: transparent !important; }
    html.x-solo body * { visibility: hidden !important; }
    html.x-solo [data-x-solo] { visibility: visible !important; }
  `;

  /** Load everything, then freeze the layout so it looks the same at any scroll position. */
  X.prepare = async () => {
    window.scrollTo(0, 0);
    document.querySelectorAll('img').forEach((i) => {
      i.loading = 'eager';
    });
    await Promise.all(
      [...document.images].map((i) =>
        i.complete
          ? null
          : new Promise((r) => {
              i.addEventListener('load', r, { once: true });
              i.addEventListener('error', r, { once: true });
              setTimeout(r, 20000);
            }),
      ),
    );
    const wait = (ms) => new Promise((r) => setTimeout(r, ms));
    await Promise.race([Promise.all([...document.images].map((i) => (i.decode ? i.decode().catch(() => null) : null))), wait(10000)]);
    await document.fonts.ready;
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
    await new Promise((r) => setTimeout(r, 300));

    const all = [...document.body.querySelectorAll('*')];
    // Fixed and sticky elements (menu bar, stacked cards) would follow the
    // scroll; pin them where they sit at the top of the page.
    const moves = [];
    for (const el of all) {
      const s = getComputedStyle(el);
      if (s.position === 'fixed') moves.push([el, 'fixed', el.getBoundingClientRect()]);
      else if (s.position === 'sticky') moves.push([el, 'sticky']);
    }
    for (const [el, kind, r] of moves) {
      const set = (p, v) => el.style.setProperty(p, v, 'important');
      if (kind === 'sticky') {
        set('position', 'relative');
        set('top', 'auto');
        set('bottom', 'auto');
        continue;
      }
      let cb = el.parentElement;
      while (cb && cb !== document.body) {
        const s = getComputedStyle(cb);
        if (s.position !== 'static' || s.transform !== 'none' || s.filter !== 'none') break;
        cb = cb.parentElement;
      }
      const base = cb && cb !== document.body ? cb.getBoundingClientRect() : { left: 0, top: 0 };
      const bs = cb && cb !== document.body ? getComputedStyle(cb) : null;
      set('position', 'absolute');
      set('top', `${r.top - base.top - (bs ? parseFloat(bs.borderTopWidth) : 0)}px`);
      set('left', `${r.left - base.left - (bs ? parseFloat(bs.borderLeftWidth) : 0)}px`);
      set('right', 'auto');
      set('bottom', 'auto');
      set('width', `${r.width}px`);
      set('height', `${r.height}px`);
    }
    // Borders, icons and shapes often use the text color; freeze them so
    // hiding the text later leaves them alone.
    for (const el of all) {
      const s = getComputedStyle(el);
      const set = (p, v) => el.style.setProperty(p, v, 'important');
      for (const side of ['top', 'right', 'bottom', 'left']) {
        if (parseFloat(s.getPropertyValue(`border-${side}-width`)) > 0) set(`border-${side}-color`, s.getPropertyValue(`border-${side}-color`));
      }
      if (s.backgroundColor !== 'rgba(0, 0, 0, 0)') set('background-color', s.backgroundColor);
      if (s.outlineStyle !== 'none') set('outline-color', s.outlineColor);
      if (s.boxShadow !== 'none') set('box-shadow', s.boxShadow);
      if (el instanceof SVGElement) {
        set('fill', s.fill);
        set('stroke', s.stroke);
        if (el.tagName.toLowerCase() === 'svg') set('color', s.color);
      }
      // A drop-down's arrow is drawn in its text color; only its text is hidden.
      if (el.tagName === 'SELECT') set('color', s.color);
    }
    window.scrollTo(0, 0);
    await wait(100);
  };

  X.mode = async (m) => {
    const c = document.documentElement.classList;
    c.remove('x-hidetext', 'x-hideimg', 'x-hideiso', 'x-onlyiso', 'x-solo');
    if (m === 'background') c.add('x-hidetext', 'x-hideimg');
    if (m === 'photos') c.add('x-hidetext', 'x-hideiso');
    if (m === 'icons') c.add('x-onlyiso');
    if (m === 'solo') c.add('x-solo');
    await new Promise((r) => setTimeout(r, 60));
  };

  /** Measure every text, picture and section on the page (page coordinates). */
  X.collect = ({ region, screenH }) => {
    window.scrollTo(0, 0);
    const vw = document.documentElement.clientWidth;
    const docH = Math.ceil(document.documentElement.scrollHeight);
    // 'page' is everything above the footer; 'header' and 'footer' are just those.
    const foot = document.querySelector('footer');
    const footTop = foot ? Math.round(foot.getBoundingClientRect().top) : docH;
    const head = document.querySelector('header');
    let start = 0;
    let end = footTop;
    if (region === 'footer') {
      start = footTop;
      end = docH;
    } else if (region === 'header') {
      end = head ? Math.round(head.getBoundingClientRect().bottom) : 0;
    }

    const opacity = (el) => {
      let o = 1;
      for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
      return o;
    };
    const clipOf = (el) => {
      const c = { l: 0, t: -1e9, r: vw, b: 1e9 };
      for (let e = el.parentElement; e && e !== document.body; e = e.parentElement) {
        const s = getComputedStyle(e);
        const cp = s.clipPath !== 'none';
        const ox = s.overflowX !== 'visible' || cp;
        const oy = s.overflowY !== 'visible' || cp;
        if (!ox && !oy) continue;
        const b = e.getBoundingClientRect();
        if (ox) {
          c.l = Math.max(c.l, b.left);
          c.r = Math.min(c.r, b.right);
        }
        if (oy) {
          c.t = Math.max(c.t, b.top);
          c.b = Math.min(c.b, b.bottom);
        }
      }
      return c;
    };
    const inter = (r, c) => {
      const o = { l: Math.max(r.l ?? r.left, c.l), t: Math.max(r.t ?? r.top, c.t), r: Math.min(r.r ?? r.right, c.r), b: Math.min(r.b ?? r.bottom, c.b) };
      return o.r - o.l > 0.5 && o.b - o.t > 0.5 ? o : null;
    };
    const inPage = (t, b) => b > start && t < end;

    /* pictures */
    const alphaOf = (img) => {
      try {
        const c = document.createElement('canvas');
        c.width = c.height = 24;
        const k = c.getContext('2d', { willReadFrequently: true });
        k.drawImage(img, 0, 0, 24, 24);
        const d = k.getImageData(0, 0, 24, 24).data;
        for (let i = 3; i < d.length; i += 4) if (d[i] < 245) return true;
      } catch {
        /* cross-origin picture: treat it as a photo */
      }
      return false;
    };
    const images = [];
    for (const el of document.body.querySelectorAll('*')) {
      const tag = el.tagName.toLowerCase();
      const media = ['img', 'svg', 'video', 'iframe', 'canvas', 'object', 'embed'].includes(tag) && !el.parentElement?.closest('svg');
      if (!media && el instanceof SVGElement) continue;
      const s = getComputedStyle(el);
      const bgUrl = !media && /url\(/.test(s.backgroundImage);
      if (!media && !bgUrl) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 3 || r.height < 3 || s.visibility !== 'visible' || opacity(el) < 0.03) continue;
      const v = inter(r, clipOf(el));
      if (!v || v.r - v.l < 3 || v.b - v.t < 3 || !inPage(v.t, v.b)) continue;
      const kind = tag === 'svg' || (tag === 'img' && alphaOf(el)) ? 'iso' : 'photo';
      if (media) el.setAttribute('data-x-img', kind);
      else el.setAttribute('data-x-bg', '1');
      el.setAttribute('data-x-n', images.length);
      images.push({ n: images.length, kind, x: v.l, y: v.t, w: v.r - v.l, h: v.b - v.t, alt: el.getAttribute('alt') || el.getAttribute('aria-label') || '' });
    }

    /* texts: one text box per block that holds text */
    // Inline-block spans with no box of their own (animated words, for
    // example) belong to the surrounding paragraph.
    const inlineLike = (el) => {
      const s = getComputedStyle(el);
      if (s.display === 'inline' || s.display === 'contents') return true;
      if (s.display !== 'inline-block') return false;
      const flat = ['Top', 'Right', 'Bottom', 'Left'].every((k) => !parseFloat(s[`padding${k}`]) && !parseFloat(s[`border${k}Width`]));
      return (
        flat &&
        s.backgroundImage === 'none' &&
        !X.color(s.backgroundColor) &&
        [...el.children].every((c) => c.tagName === 'BR' || ['inline', 'contents'].includes(getComputedStyle(c).display))
      );
    };
    const ascent = (r) => {
      mc.font = `${r.italic ? 'italic ' : ''}${r.weight} ${r.px}px "${r.family}"`;
      const m = mc.measureText('H');
      return { up: m.fontBoundingBoxAscent, down: m.fontBoundingBoxDescent };
    };
    const blockOf = (el) => {
      while (el && el !== document.body && inlineLike(el)) el = el.parentElement;
      return el;
    };
    const SKIP = 'script, style, noscript, template, select, textarea, svg, img, video, iframe';
    const boxes = new Set();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode()); ) {
      if (!n.data.trim() || !n.parentElement || n.parentElement.closest(SKIP)) continue;
      boxes.add(blockOf(n.parentElement));
    }

    const underlined = (el, box) => {
      for (let e = el; e; e = e.parentElement) {
        if (/underline/.test(getComputedStyle(e).textDecorationLine)) return true;
        if (e === box) break;
      }
      return false;
    };
    const texts = [];
    const pushText = (t) => {
      // Size the fallback font so each line is as wide as on the site.
      let wo = 0;
      let ws = 0;
      for (const r of t.runs) {
        if (r.br) continue;
        const it = r.italic ? 'italic ' : '';
        mc.font = `${it}${r.weight} ${r.px}px "${r.family}"`;
        wo += mc.measureText(r.text).width;
        mc.font = `${it}${r.weight >= 600 ? 700 : 400} ${r.px}px "${sub(r.family)}"`;
        ws += mc.measureText(r.text).width;
      }
      const ratio = ws > 0 ? Math.min(1.25, Math.max(0.75, wo / ws)) : 1;
      t.runs = t.runs.map((r) =>
        r.br
          ? r
          : {
              text: r.text,
              font: sub(r.family),
              px: r.px * ratio,
              sizePx: r.px,
              bold: r.weight >= 600,
              italic: r.italic,
              underline: r.underline,
              spacing: r.spacing,
              color: r.color,
              alpha: r.alpha,
            },
      );
      texts.push(t);
    };

    for (const box of boxes) {
      const raw = [];
      let wordBoxes = false;
      const walk = (node) => {
        for (const ch of node.childNodes) {
          if (ch.nodeType === 3) {
            const p = ch.parentElement;
            const s = getComputedStyle(p);
            if (s.visibility !== 'visible') continue;
            const col = X.color(s.color);
            if (!col) continue;
            const alpha = opacity(p) * col.a;
            if (alpha < 0.03) continue;
            // A trailing no-break space only separates words (see inlineLike).
            let text = /^pre/.test(s.whiteSpace) ? ch.data : ch.data.replace(/[ \t\n\r\f]+/g, ' ').replace(/\u00a0+$/, ' ');
            const rg = document.createRange();
            rg.selectNodeContents(ch);
            const rs = [...rg.getClientRects()].filter((r) => r.width > 0.5 && r.height > 0.5);
            if (!rs.length || !text) continue;
            if (s.textTransform === 'uppercase') text = text.toUpperCase();
            else if (s.textTransform === 'lowercase') text = text.toLowerCase();
            else if (s.textTransform === 'capitalize') text = text.replace(/(^|\s)(\p{L})/gu, (m, a, b) => a + b.toUpperCase());
            const run = {
              text,
              family: family(s),
              px: parseFloat(s.fontSize),
              weight: parseInt(s.fontWeight, 10) || 400,
              italic: /italic|oblique/.test(s.fontStyle),
              underline: underlined(p, box),
              spacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) || 0,
              color: col.hex,
              alpha,
              lh: parseFloat(s.lineHeight),
            };
            run.rects = text.trim() ? rs.map((q) => ({ left: q.left, top: q.top, right: q.right, bottom: q.bottom })) : [];
            raw.push(run);
          } else if (ch.nodeType === 1) {
            if (ch.tagName === 'BR') raw.push({ br: true });
            else if (!ch.matches(SKIP) && inlineLike(ch)) {
              if (getComputedStyle(ch).display === 'inline-block') wordBoxes = true;
              walk(ch);
            }
          }
        }
      };
      walk(box);
      if (!raw.some((r) => r.rects?.length)) continue;

      // Collapse spaces across runs and trim them at line edges.
      const runs = [];
      for (const r of raw) {
        const prev = runs[runs.length - 1];
        if (r.br) {
          if (prev && !prev.br) prev.text = prev.text.replace(/ +$/, '');
          if (runs.length) runs.push(r);
          continue;
        }
        let text = r.text;
        if (!prev || prev.br || / $/.test(prev.text)) text = text.replace(/^ +/, '');
        if (text) runs.push({ ...r, text });
      }
      while (runs.length && (runs[runs.length - 1].br || !runs[runs.length - 1].text.trim())) {
        const last = runs.pop();
        if (!last.br && runs.length && !runs[runs.length - 1].br) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/ +$/, '');
      }
      if (!runs.length) continue;
      if (!runs[runs.length - 1].br) runs[runs.length - 1].text = runs[runs.length - 1].text.replace(/ +$/, '');

      const bs = getComputedStyle(box);
      const br = box.getBoundingClientRect();
      const content = {
        l: br.left + parseFloat(bs.paddingLeft) + parseFloat(bs.borderLeftWidth),
        r: br.right - parseFloat(bs.paddingRight) - parseFloat(bs.borderRightWidth),
      };
      const ta = bs.textAlign;
      const align = /center/.test(ta) ? 'center' : /right|end/.test(ta) ? 'right' : /justify/.test(ta) ? 'justify' : 'left';
      // Words wrapped in inline-blocks keep their trailing space inside the
      // line on the site; PowerPoint lets it hang, so give it one space less.
      if (wordBoxes) content.r -= (runs.find((r) => !r.br)?.px || 16) * 0.3;
      const clip = clipOf(box.firstChild || box);

      // Lines after a line break that start somewhere else (an indented second
      // line of a title, say) get their own text box.
      const pieces = [[]];
      for (const r of runs) {
        if (r.br) pieces.push([]);
        pieces[pieces.length - 1].push(r);
      }
      const leftOf = (piece) => Math.min(...piece.flatMap((r) => (r.rects || []).map((q) => q.left)));
      const lefts = pieces.map(leftOf).filter(Number.isFinite);
      const split = align === 'left' && lefts.some((l) => Math.abs(l - lefts[0]) > 3);
      for (const piece of split ? pieces : [runs]) {
        const own = piece[0]?.br ? piece.slice(1) : piece;
        const rects = own.flatMap((r) => r.rects || []);
        if (!rects.length) continue;
        const bb = rects.reduce(
          (a, r) => ({ l: Math.min(a.l, r.left), t: Math.min(a.t, r.top), r: Math.max(a.r, r.right), b: Math.max(a.b, r.bottom) }),
          { l: 1e9, t: 1e9, r: -1e9, b: -1e9 },
        );
        const seen = inter(bb, clip);
        if (!seen || ((seen.r - seen.l) * (seen.b - seen.t)) / ((bb.r - bb.l) * (bb.b - bb.t)) < 0.6) continue;
        if (!inPage(bb.t, bb.b)) continue;

        const lines = [];
        for (const r of rects.slice().sort((a, b) => a.top - b.top)) {
          const cy = (r.top + r.bottom) / 2;
          const line = lines.find((l) => cy > l.t && cy < l.b);
          if (line) {
            line.t = Math.min(line.t, r.top);
            line.b = Math.max(line.b, r.bottom);
          } else lines.push({ t: r.top, b: r.bottom });
        }
        const first = own.find((r) => r.rects?.length);
        const lh = lines.length > 1 ? (lines[lines.length - 1].t - lines[0].t) / (lines.length - 1) : first.lh || lines[0].b - lines[0].t;
        const room = (bb.r - bb.l) * 1.06 + 6;
        let x;
        let w;
        if (align === 'left') {
          x = bb.l;
          w = Math.min(Math.max(content.r - bb.l, room), vw - x);
        } else if (align === 'right') {
          w = Math.min(Math.max(bb.r - content.l, room), bb.r);
          x = bb.r - w;
        } else if (align === 'center') {
          const c = (bb.l + bb.r) / 2;
          const half = Math.min(Math.max(Math.min(c - content.l, content.r - c), room / 2), c, vw - c);
          x = c - half;
          w = half * 2;
        } else {
          x = Math.min(content.l, bb.l);
          w = Math.max(content.r, bb.r) - x;
        }
        pushText({
          x,
          baseline: first.rects[0].top + ascent(first).up,
          w,
          h: lh * lines.length,
          top: bb.t,
          bottom: bb.b,
          align,
          lh,
          lines: lines.length,
          runs: own,
        });
      }
    }

    /* form fields: placeholder or chosen value */
    for (const el of document.body.querySelectorAll('input, textarea, select')) {
      const s = getComputedStyle(el);
      if (s.visibility !== 'visible' || opacity(el) < 0.03) continue;
      const type = (el.getAttribute('type') || 'text').toLowerCase();
      if (el.tagName === 'INPUT' && ['hidden', 'checkbox', 'radio', 'file', 'range', 'color', 'image'].includes(type)) continue;
      let text;
      let color = s.color;
      if (el.tagName === 'SELECT') text = el.options[el.selectedIndex]?.text || '';
      else if (el.value) text = el.value;
      else {
        text = el.getAttribute('placeholder') || '';
        color = getComputedStyle(el, '::placeholder').color;
      }
      const col = X.color(color);
      if (!text.trim() || !col) continue;
      if (s.textTransform === 'uppercase') text = text.toUpperCase();
      const r = el.getBoundingClientRect();
      const box = {
        l: r.left + parseFloat(s.paddingLeft) + parseFloat(s.borderLeftWidth),
        r: r.right - parseFloat(s.paddingRight) - parseFloat(s.borderRightWidth),
        t: r.top + parseFloat(s.paddingTop) + parseFloat(s.borderTopWidth),
        b: r.bottom - parseFloat(s.paddingBottom) - parseFloat(s.borderBottomWidth),
      };
      const px = parseFloat(s.fontSize);
      const lh = parseFloat(s.lineHeight) || px * 1.25;
      const y = el.tagName === 'TEXTAREA' ? box.t : (box.t + box.b) / 2 - lh / 2;
      if (!inPage(y, y + lh)) continue;
      const m = ascent({ italic: /italic/.test(s.fontStyle), weight: parseInt(s.fontWeight, 10) || 400, px, family: family(s) });
      pushText({
        x: box.l,
        baseline: y + (lh - m.up - m.down) / 2 + m.up,
        w: Math.max(box.r - box.l, 20),
        h: lh,
        top: y,
        bottom: y + lh,
        align: /center/.test(s.textAlign) ? 'center' : /right|end/.test(s.textAlign) ? 'right' : 'left',
        lh,
        lines: 1,
        runs: [
          {
            text: text.trim(),
            family: family(s),
            px,
            weight: parseInt(s.fontWeight, 10) || 400,
            italic: /italic/.test(s.fontStyle),
            underline: false,
            spacing: s.letterSpacing === 'normal' ? 0 : parseFloat(s.letterSpacing) || 0,
            color: col.hex,
            alpha: opacity(el) * col.a,
          },
        ],
      });
    }

    /* section edges: the best places to start a new slide */
    const bounds = new Set();
    for (const el of document.body.querySelectorAll('section, header, footer, article, main > *')) {
      const r = el.getBoundingClientRect();
      if (r.height < 40) continue;
      bounds.add(Math.round(r.top));
      bounds.add(Math.round(r.bottom));
    }

    /* cards and buttons: better not cut in two */
    const blocks = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (el instanceof SVGElement) continue;
      const s = getComputedStyle(el);
      const edges = ['Top', 'Right', 'Bottom', 'Left'].filter((k) => parseFloat(s[`border${k}Width`]) > 0).length;
      if (!X.color(s.backgroundColor) && edges < 2 && s.boxShadow === 'none') continue;
      const r = inter(el.getBoundingClientRect(), clipOf(el));
      if (!r || r.b - r.t < 30 || r.b - r.t > screenH * 0.95 || r.r - r.l < 60 || r.r - r.l > vw * 0.8) continue;
      blocks.push({ top: r.t, bottom: r.b });
    }

    return { texts, images, bounds: [...bounds], blocks, height: docH, start, end };
  };
}

/* ---------------------------------------- in-page (helper tab) pictures */

/** Cut the three screenshots of one screen into the slide background and pictures. */
async function cutScreen({ b, a, i, solo, top, h, dpr, scale, pasteboard, photos, isos, cover, width, height }) {
  const bitmap = async (s) => (s ? createImageBitmap(await (await fetch(`data:image/png;base64,${s}`)).blob()) : null);
  const [B, A, I, S] = await Promise.all([bitmap(b), bitmap(a), bitmap(i), bitmap(solo)]);
  const canvas = (w, hh) => Object.assign(document.createElement('canvas'), { width: Math.max(1, Math.round(w)), height: Math.max(1, Math.round(hh)) });
  const data = (c, type, q) => c.toDataURL(type, q).split(',')[1];

  const bg = canvas(width * scale, height * scale);
  const g = bg.getContext('2d');
  g.fillStyle = pasteboard;
  g.fillRect(0, 0, bg.width, bg.height);
  g.imageSmoothingQuality = 'high';
  g.drawImage(B, 0, 0, B.width, B.height, 0, 0, bg.width, Math.round(h * scale));

  const cut = (src, r, outScale, type, q) => {
    const sx = r.x * dpr;
    const sy = (r.y - top) * dpr;
    const c = canvas(r.w * outScale, r.h * outScale);
    const k = c.getContext('2d', { willReadFrequently: type === 'image/png' });
    k.imageSmoothingQuality = 'high';
    k.drawImage(src, sx, sy, r.w * dpr, r.h * dpr, 0, 0, c.width, c.height);
    if (type === 'image/png') {
      const d = k.getImageData(0, 0, c.width, c.height).data;
      let seen = false;
      for (let j = 3; j < d.length; j += 4) {
        if (d[j] > 8) {
          seen = true;
          break;
        }
      }
      if (!seen) return null;
    }
    return data(c, type, q);
  };
  return {
    bg: data(bg, 'image/jpeg', 0.86),
    photos: photos.map((p) => ({ ...p, data: A ? cut(A, p, scale, 'image/jpeg', 0.86) : null })).filter((p) => p.data),
    isos: isos.map((p) => ({ ...p, data: I ? cut(I, p, dpr, 'image/png') : null })).filter((p) => p.data),
    cover: S && cover ? cut(S, cover, scale, 'image/jpeg', 0.86) : null,
  };
}

async function shrink({ img, width, q }) {
  const bmp = await createImageBitmap(await (await fetch(`data:image/png;base64,${img}`)).blob());
  const c = Object.assign(document.createElement('canvas'), { width, height: Math.round((bmp.height * width) / bmp.width) });
  const k = c.getContext('2d');
  k.imageSmoothingQuality = 'high';
  k.drawImage(bmp, 0, 0, c.width, c.height);
  return c.toDataURL('image/jpeg', q).split(',')[1];
}

/* ------------------------------------------------------------- capture */

/** Split a region into screens no taller than one slide, never through a text. */
function planScreens({ start, end, texts, images, bounds, blocks }) {
  const screens = [];
  let top = start;
  while (end - top > 2) {
    if (end - top <= H) {
      screens.push([top, end]);
      break;
    }
    // Prefer long slides that end where a section ends; avoid cutting a
    // picture, card or button in two; never cut through a line of text.
    let best = null;
    for (let y = top + H; y >= top + Math.round(H * 0.25); y--) {
      if (texts.some((t) => t.top < y - 1 && t.bottom > y + 1)) continue;
      let score = (y - top) / H;
      if (bounds.includes(y)) score += 0.35;
      if (images.some((i) => i.y < y - 0.25 && i.y + i.h > y + 0.25)) score -= 0.65;
      if (blocks.some((b) => b.top < y - 0.25 && b.bottom > y + 0.25)) score -= 0.3;
      if (!best || score > best.score) best = { y, score };
    }
    const y = best ? best.y : top + H;
    screens.push([top, y]);
    top = y;
  }
  return screens;
}

const clipTo = (r, top, bottom) => {
  const y = Math.max(r.y, top);
  const b = Math.min(r.y + r.h, bottom);
  return b - y > 1 ? { ...r, y, h: b - y } : null;
};

/**
 * Capture a page as screens. `region` is 'page' (everything above the
 * footer), 'header' or 'footer'. `cover` also keeps the page's main photo
 * alone, for the cover slide.
 */
async function capturePage(page, helper, url, { region = 'page', cover = false } = {}) {
  await page.bringToFront();
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 90000 });
  await page.evaluate(pageLib, FONT_MAP, FALLBACK_FONT);
  await page.evaluate(() => window.__x.prepare());
  const info = await page.evaluate((o) => window.__x.collect(o), { region, screenH: H });

  let thumb = null;
  if (region === 'page') {
    const firstH = Math.min(H, info.end);
    const preview = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: firstH }, encoding: 'base64', captureBeyondViewport: false });
    thumb = { data: await helper.evaluate(shrink, { img: preview, width: 960, q: 0.82 }), ratio: firstH / W };
  }

  const screens = [];
  for (const [top, bottom] of planScreens(info)) {
    const h = bottom - top;
    await page.evaluate((y) => window.scrollTo(0, y), Math.max(0, Math.min(top, info.height - H)));
    const photos = info.images.filter((i) => i.kind === 'photo').map((i) => clipTo(i, top, bottom)).filter(Boolean);
    const isos = info.images.filter((i) => i.kind === 'iso').map((i) => clipTo(i, top, bottom)).filter(Boolean);
    const shot = async (mode, extra = {}) => {
      await page.evaluate((m) => window.__x.mode(m), mode);
      return page.screenshot({ type: 'png', clip: { x: 0, y: top, width: W, height: h }, encoding: 'base64', captureBeyondViewport: false, ...extra });
    };
    let reference = null;
    if (DEBUG) reference = await shot('normal');
    const b = await shot('background');
    const a = photos.length ? await shot('photos') : null;
    const i = isos.length ? await shot('icons', { omitBackground: true }) : null;
    const main = cover && top === info.start ? photos.slice().sort((p, q) => q.w * q.h - p.w * p.h)[0] : null;
    let solo = null;
    if (main && main.w * main.h > W * H * 0.4) {
      await page.evaluate((n) => document.querySelector(`[data-x-n="${n}"]`)?.setAttribute('data-x-solo', ''), main.n);
      solo = await shot('solo');
    }
    await page.evaluate(() => window.__x.mode('normal'));
    const cut = await helper.evaluate(cutScreen, {
      b,
      a,
      i,
      solo,
      cover: main,
      top,
      h,
      dpr: DPR,
      scale: BG_SCALE,
      pasteboard: PASTEBOARD,
      photos,
      isos,
      width: W,
      height: H,
    });
    const mid = (t) => (t.top + t.bottom) / 2;
    screens.push({ top, h, ...cut, reference, texts: info.texts.filter((t) => mid(t) >= top && mid(t) < bottom) });
  }
  return { screens, thumb };
}

/**
 * Runs in a page of the site: turns content pictures (WebP, other hosts…)
 * into JPEG or PNG that PowerPoint can show. 'cover' fills the box, 'contain'
 * keeps the whole picture and returns its own proportions.
 */
async function loadPictures(specs) {
  const out = {};
  for (const s of specs) {
    try {
      const img = new Image();
      const url = new URL(s.src, location.href);
      if (url.origin !== location.origin) img.crossOrigin = 'anonymous';
      img.src = url.href;
      await img.decode();
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;
      const c = document.createElement('canvas');
      const k = c.getContext('2d');
      k.imageSmoothingQuality = 'high';
      if (s.fit === 'cover') {
        c.width = s.w;
        c.height = s.h;
        k.fillStyle = '#FFFFFF';
        k.fillRect(0, 0, s.w, s.h);
        const sc = Math.max(s.w / iw, s.h / ih);
        k.drawImage(img, (s.w - iw * sc) / 2, (s.h - ih * sc) / 2, iw * sc, ih * sc);
        out[s.key] = { data: c.toDataURL('image/jpeg', 0.86).split(',')[1], type: 'jpeg', ratio: s.h / s.w };
      } else {
        const sc = Math.min(s.w / iw, s.h / ih, 1.5);
        c.width = Math.max(1, Math.round(iw * sc));
        c.height = Math.max(1, Math.round(ih * sc));
        k.drawImage(img, 0, 0, c.width, c.height);
        out[s.key] = { data: c.toDataURL('image/png').split(',')[1], type: 'png', ratio: c.height / c.width };
      }
    } catch {
      out[s.key] = null;
    }
  }
  return out;
}

/* -------------------------------------------------------------- slides */

const r1 = (n) => Math.round(n * 10) / 10;
const r2 = (n) => Math.round(n * 100) / 100;

let slideCount = 0;
const references = [];

function newSlide(pres, section) {
  slideCount += 1;
  return pres.addSlide({ sectionTitle: section });
}

const picture = (p) => `image/${p.type === 'png' ? 'png' : 'jpeg'};base64,${p.data}`;

function addScreenSlide(pres, section, screen, notes, { last = false, label = true, badge = '' } = {}) {
  const slide = newSlide(pres, section);
  if (screen.reference) references.push({ no: slideCount, data: screen.reference });
  slide.background = { data: `image/jpeg;base64,${screen.bg}`, path: 'background.jpg' };
  for (const p of screen.photos) {
    slide.addImage({ data: `image/jpeg;base64,${p.data}`, x: p.x * PX, y: (p.y - screen.top) * PX, w: p.w * PX, h: p.h * PX, altText: p.alt || undefined });
  }
  for (const p of screen.isos) {
    slide.addImage({ data: `image/png;base64,${p.data}`, x: p.x * PX, y: (p.y - screen.top) * PX, w: p.w * PX, h: p.h * PX, altText: p.alt || undefined });
  }
  for (const t of screen.texts) {
    const lineSpacing = r1(t.lh * PT);
    const runs = [];
    for (const r of t.runs) {
      const prev = runs[runs.length - 1];
      if (r.br) {
        if (prev && !prev.options.breakLine) prev.options.breakLine = true;
        else if (prev) runs.push({ text: ' ', options: { ...prev.options, breakLine: true } });
        continue;
      }
      runs.push({
        text: r.text,
        options: {
          fontFace: r.font,
          fontSize: r1(r.px * PT),
          bold: r.bold,
          italic: r.italic,
          underline: r.underline ? { style: 'sng' } : undefined,
          color: r.color,
          transparency: r.alpha < 0.99 ? Math.round((1 - r.alpha) * 100) : undefined,
          charSpacing: r.spacing ? r2(r.spacing * PT) : undefined,
          align: t.align,
          lineSpacing,
        },
      });
    }
    if (!runs.length) continue;
    slide.addText(runs, {
      x: t.x * PX,
      y: (t.baseline - BASELINE * t.lh - screen.top) * PX,
      w: Math.max(t.w, 4) * PX,
      h: Math.max(t.h, 4) * PX,
      margin: 0,
      valign: 'top',
      align: t.align,
      lineSpacing,
      paraSpaceBefore: 0,
      paraSpaceAfter: 0,
      fit: 'resize',
      isTextBox: true,
    });
  }
  // A note-like tag for things a still picture cannot show (a video).
  if (badge) {
    slide.addText(badge, {
      x: 0.35,
      y: Math.min(screen.h, H) * PX - 0.75,
      w: 4.6,
      h: 0.4,
      fontFace: UI_FONT,
      fontSize: 11,
      color: '3D3A30',
      fill: { color: 'FFF1B8' },
      align: 'center',
      valign: 'middle',
      margin: 0,
      isTextBox: true,
    });
  }
  // Say what the grey area under a short screen is.
  if (label && H - screen.h > 60) {
    slide.addText(last ? T.pageEnd : T.continues, {
      x: 0,
      y: (screen.h + (H - screen.h) / 2 - 12) * PX,
      w: W * PX,
      h: 24 * PX,
      fontFace: UI_FONT,
      fontSize: 11,
      color: '9A958C',
      align: 'center',
      valign: 'middle',
      margin: 0,
      isTextBox: true,
    });
  }
  slide.addNotes(notes);
  return slide;
}

function addCover(pres, photo, logo, host) {
  const slide = newSlide(pres, T.coverTitle);
  slide.background = { color: BRAND.sage };
  if (photo) {
    slide.addImage({ data: `image/jpeg;base64,${photo}`, x: 0, y: 0, w: W * PX, h: H * PX });
    slide.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W * PX, h: H * PX, fill: { color: BRAND.charcoal, transparency: 45 }, line: { type: 'none' } });
  }
  if (logo) slide.addImage({ data: `image/png;base64,${logo.data}`, x: 0.9, y: 0.8, w: logo.w * PX * 1.4, h: logo.h * PX * 1.4 });
  slide.addText(T.coverTitle, { x: 0.9, y: 4.6, w: 11, h: 1.1, fontFace: UI_FONT, fontSize: 48, color: BRAND.bone, margin: 0, valign: 'bottom', isTextBox: true });
  slide.addText(`SYNERGY GLOBAL  ·  ${host.toUpperCase()}`, { x: 0.9, y: 5.85, w: 11, h: 0.4, fontFace: UI_FONT, fontSize: 13, color: BRAND.sand, charSpacing: 3, margin: 0, isTextBox: true });
  slide.addText(`${T.coverNote}\n${T.date(TODAY)}`, { x: 0.9, y: 6.5, w: 11, h: 0.9, fontFace: UI_FONT, fontSize: 14, color: BRAND.bone, transparency: 15, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true });
}

function addGuide(pres) {
  const slide = newSlide(pres, T.coverTitle);
  slide.background = { color: BRAND.bone };
  slide.addText(T.howTitle, { x: 0.9, y: 0.6, w: 13, h: 0.9, fontFace: UI_FONT, fontSize: 34, color: BRAND.sage, margin: 0, isTextBox: true });
  const top = 1.8;
  const rowH = 1.18;
  T.steps.forEach(([title, body], i) => {
    const y = top + i * rowH;
    slide.addShape(pres.ShapeType.ellipse, { x: 0.9, y, w: 0.56, h: 0.56, fill: { color: BRAND.sage }, line: { type: 'none' } });
    slide.addText(String(i + 1), { x: 0.9, y, w: 0.56, h: 0.56, fontFace: UI_FONT, fontSize: 16, bold: true, color: BRAND.sand, align: 'center', valign: 'middle', margin: 0, isTextBox: true });
    slide.addText(
      [
        { text: title, options: { bold: true, fontSize: 16, color: BRAND.sage, breakLine: true } },
        { text: body, options: { fontSize: 13, color: BRAND.ink } },
      ],
      { x: 1.75, y: y - 0.04, w: 7.8, h: 1.05, fontFace: UI_FONT, margin: 0, valign: 'top', paraSpaceAfter: 2, isTextBox: true },
    );
  });
  slide.addShape(pres.ShapeType.roundRect, { x: 10.0, y: 1.8, w: 4.1, h: 5.6, fill: { color: BRAND.sage }, line: { type: 'none' }, rectRadius: 0.12 });
  slide.addText(T.howNote, { x: 10.35, y: 2.1, w: 3.4, h: 5.0, fontFace: UI_FONT, fontSize: 14, color: BRAND.bone, margin: 0, valign: 'top', lineSpacingMultiple: 1.2, isTextBox: true });
}

function addDivider(pres, section, { label, name, sub, url, count, thumb }) {
  const slide = newSlide(pres, section);
  slide.background = { color: BRAND.sage };
  slide.addText(label, { x: 0.9, y: 2.3, w: 6, h: 0.4, fontFace: UI_FONT, fontSize: 12, color: BRAND.sand, charSpacing: 4, margin: 0, isTextBox: true });
  slide.addText(name, { x: 0.9, y: 2.85, w: 6.2, h: 1.7, fontFace: UI_FONT, fontSize: 40, color: BRAND.bone, margin: 0, valign: 'top', fit: 'shrink', isTextBox: true });
  const lines = [];
  if (sub) lines.push({ text: sub, options: { fontSize: 16, color: BRAND.sand, breakLine: true } });
  if (url) lines.push({ text: url, options: { fontSize: 12, color: BRAND.bone, transparency: 30, breakLine: true } });
  if (count) lines.push({ text: T.slides(count), options: { fontSize: 12, color: BRAND.bone, transparency: 30 } });
  if (lines.length) slide.addText(lines, { x: 0.9, y: 4.75, w: 6.2, h: 1.4, fontFace: UI_FONT, margin: 0, valign: 'top', paraSpaceAfter: 6, isTextBox: true });
  if (thumb) {
    const w = 6.4;
    const h = w * thumb.ratio;
    slide.addImage({ data: `image/jpeg;base64,${thumb.data}`, x: 7.7, y: (H * PX - h) / 2, w, h, shadow: { type: 'outer', blur: 12, offset: 4, angle: 90, color: '000000', opacity: 0.35 } });
  }
}

/** Divider for the parts that are not a single page, with a list of what follows. */
function addSectionDivider(pres, section, label, items) {
  const slide = newSlide(pres, section);
  slide.background = { color: BRAND.sage };
  slide.addText(label, { x: 0.9, y: 2.3, w: 6, h: 0.4, fontFace: UI_FONT, fontSize: 12, color: BRAND.sand, charSpacing: 4, margin: 0, isTextBox: true });
  slide.addText(section, { x: 0.9, y: 2.85, w: 6.2, h: 1.9, fontFace: UI_FONT, fontSize: 40, color: BRAND.bone, margin: 0, valign: 'top', fit: 'shrink', isTextBox: true });
  slide.addText(
    items.map((t, i) => ({ text: t, options: { bullet: { indent: 18 }, breakLine: i < items.length - 1 } })),
    { x: 7.9, y: 2.3, w: 6.2, h: 3.8, fontFace: UI_FONT, fontSize: 18, color: BRAND.bone, margin: 0, valign: 'top', paraSpaceAfter: 10, isTextBox: true },
  );
}

function addClosing(pres) {
  const slide = newSlide(pres, T.endTitle);
  slide.background = { color: BRAND.bone };
  slide.addText(T.endTitle, { x: 0.9, y: 0.7, w: 13, h: 0.9, fontFace: UI_FONT, fontSize: 34, color: BRAND.sage, margin: 0, isTextBox: true });
  slide.addShape(pres.ShapeType.roundRect, { x: 0.9, y: 1.9, w: 13.2, h: 5.6, fill: { color: 'FFFFFF' }, line: { color: BRAND.beige, width: 1.25 }, rectRadius: 0.1 });
  slide.addText(T.endHint, { x: 1.3, y: 2.25, w: 12.4, h: 4.9, fontFace: UI_FONT, fontSize: 16, color: '8A8A8A', margin: 0, valign: 'top', isTextBox: true });
}

/* --------------------------------------------------------------- forms */

// "Form" slides: editable tables and pictures for content that has no single
// place on a page (menu links, company details, all photos…) or that is
// easier to correct field by field (properties).

const SHEET = { x: 0.6, top: 1.6, bottom: H * PX - 0.4, w: W * PX - 1.2 };
const FS = { head: 10, label: 10, value: 10.5, note: 9 };
const yesNo = (v) => (v ? T.yes : T.no);

function addSheet(pres, section, title, hint) {
  const slide = newSlide(pres, section);
  slide.background = { color: BRAND.bone };
  slide.addText(title, { x: SHEET.x, y: 0.42, w: SHEET.w, h: 0.62, fontFace: UI_FONT, fontSize: 26, color: BRAND.sage, margin: 0, valign: 'middle', isTextBox: true });
  if (hint) slide.addText(hint, { x: SHEET.x, y: 1.07, w: SHEET.w, h: 0.4, fontFace: UI_FONT, fontSize: 12, color: '6F6A62', margin: 0, valign: 'top', isTextBox: true });
  return slide;
}

function linesOf(text, width, pt) {
  const perLine = Math.max(1, Math.floor((width - 0.18) / ((pt * 0.57) / 72)));
  return String(text ?? '')
    .split('\n')
    .reduce((n, line) => n + Math.max(1, Math.ceil(line.length / perLine)), 0);
}
const rowHeight = (cells, cols) => Math.max(...cells.map((c, i) => (linesOf(c, cols[i].w, FS[cols[i].role]) * FS[cols[i].role] * 1.2) / 72)) + 0.09;

function drawTable(slide, cols, rows, x, y) {
  const cell = (text, role) => {
    const base = { fontSize: FS[role], valign: 'top' };
    if (role === 'label') return { text, options: { ...base, bold: true, color: BRAND.sage, fill: { color: 'F1ECE3' } } };
    if (role === 'note') return { text, options: { ...base, italic: true, color: '8A8580', fill: { color: 'FFFFFF' } } };
    return { text, options: { ...base, color: '1A1A1A', fill: { color: 'FFFFFF' } } };
  };
  const head = cols.map((c) => ({ text: c.title, options: { bold: true, fontSize: FS.head, color: BRAND.bone, fill: { color: BRAND.sage }, valign: 'middle' } }));
  const body = rows.map((r) => r.map((text, i) => cell(String(text ?? ''), cols[i].role)));
  slide.addTable([head, ...body], {
    x,
    y,
    w: cols.reduce((n, c) => n + c.w, 0),
    colW: cols.map((c) => c.w),
    fontFace: UI_FONT,
    border: { type: 'solid', pt: 0.75, color: 'DDD6CA' },
    margin: [0.05, 0.08, 0.05, 0.08],
  });
}

/**
 * Lay a table over as many slides as it needs. The first part can go on an
 * existing slide (`first` = { slide, y }); the rest get new form slides.
 */
function tableFlow(pres, section, title, hint, cols, rows, { first = null, x = SHEET.x } = {}) {
  let slide = first?.slide || addSheet(pres, section, title, hint);
  let y = first?.y ?? SHEET.top;
  let part = [];
  let used = 0.3;
  const flush = () => {
    if (part.length) drawTable(slide, cols, part, x, y);
    part = [];
  };
  for (const r of rows) {
    const h = rowHeight(r, cols);
    if (part.length && y + used + h > SHEET.bottom) {
      flush();
      slide = addSheet(pres, section, `${title} ${T.continued}`, '');
      y = SHEET.top - 0.4;
      used = 0.3;
    }
    part.push(r);
    used += h;
  }
  flush();
  return slide;
}

/** Page names a client recognises, for "Goes to" columns. */
function linkName(target, content) {
  const raw = String(target || '').trim();
  if (!raw) return '—';
  if (/^mailto:/i.test(raw)) return raw.slice(7);
  if (/^(https?:|tel:)/i.test(raw)) return raw;
  const [pathPart, hash] = raw.split('#');
  const p = pathPart.replace(/\/+$/, '') || '/';
  let name = null;
  const stat = STATIC_PAGES.find((s) => s.path === p);
  if (stat) name = T.pages[stat.key];
  const find = (list, prefix) => {
    const m = p.match(new RegExp(`^/${prefix}/([^/]+)$`));
    return m ? list.find((x) => x.slug === m[1] || String(x.id) === m[1]) : null;
  };
  const prop = find(content.portfolio.items, 'portfolio');
  const serv = find(content.services.items, 'services');
  const memb = find(content.about.team, 'team');
  if (prop) name = `${T.pages.property}: ${prop.title}`;
  if (serv) name = `${T.pages.service}: ${serv.title}`;
  if (memb) name = `${T.pages.member}: ${memb.name}`;
  if (!name) return raw;
  return hash ? `${name} › ${hash}` : name;
}

const COLS = (...list) => list.map(([role, title, w]) => ({ role, title, w }));

function addHeaderSlide(pres, section, shot, content) {
  const nav = content.navigation;
  const screen = shot.screens[0];
  if (!screen) return;
  const slide = addScreenSlide(pres, section, screen, `${T.header.title}\n\n${T.notesPrompt}\n`, { label: false });
  const top = screen.h * PX + 0.35;
  slide.addText(T.header.title, { x: SHEET.x, y: top, w: SHEET.w, h: 0.45, fontFace: UI_FONT, fontSize: 20, color: BRAND.sage, margin: 0, isTextBox: true });
  slide.addText(T.header.hint, { x: SHEET.x, y: top + 0.48, w: SHEET.w, h: 0.35, fontFace: UI_FONT, fontSize: 11, color: '6F6A62', margin: 0, isTextBox: true });
  const cols = COLS(['label', T.cols.item, 2.4], ['value', T.cols.text, 4.7], ['value', T.cols.goesTo, 4.9], ['value', `${T.cols.shown} (${T.yes}/${T.no})`, 1.8]);
  const rows = [
    [T.header.topBar, nav.topBar.text, '—', yesNo(nav.topBar.visible)],
    [T.header.topBarLink, nav.topBar.linkLabel, linkName(nav.topBar.linkPath, content), yesNo(nav.topBar.visible)],
    ...nav.mainMenu.map((m, i) => [T.header.menu(i + 1), m.label, linkName(m.path, content), yesNo(m.visible)]),
    [T.header.button, nav.ctaLabel, linkName(nav.ctaPath, content), yesNo(nav.showCta)],
  ];
  tableFlow(pres, section, T.header.title, T.header.hint, cols, rows, { first: { slide, y: top + 0.95 } });
}

function addFooterSlides(pres, section, shot, content) {
  const f = content.footer;
  for (const s of shot.screens) addScreenSlide(pres, section, s, `${T.footer.title}\n\n${T.notesPrompt}\n`, { label: false });
  const cols = COLS(['label', T.cols.column, 2.6], ['value', T.cols.link, 4.4], ['value', T.cols.goesTo, 6.8]);
  const rows = [
    ...f.columns.flatMap((c) => c.links.map((l) => [c.title, l.label, linkName(l.path, content)])),
    ...f.bottomLinks.map((l) => [T.footer.bottom, l.label, linkName(l.path, content)]),
  ];
  tableFlow(pres, section, T.footer.title, T.footer.hint, cols, rows);
}

function addCompanySheet(pres, section, content) {
  const s = content.settings;
  const c = T.company;
  const cols = COLS(['label', T.cols.field, 3.4], ['value', T.cols.value, 7.2], ['note', T.cols.note, 3.2]);
  const rows = Object.entries(c.rows).map(([k, label]) => [label, k === 'showEqualHousing' ? yesNo(s[k]) : s[k] ?? '', c.notes[k] || '']);
  for (const [k, label] of Object.entries(c.social)) rows.push([label, s.social?.[k] || '', c.socialNote]);
  tableFlow(pres, section, c.title, c.hint, cols, rows);
}

function addBrandSheet(pres, section, content, pics) {
  const st = content.style;
  const b = T.brand;
  const slide = addSheet(pres, section, b.title, b.hint);
  // Logos, each on the kind of background it is made for.
  const logos = [
    ['logo', BRAND.bone],
    ['logoOnDark', BRAND.charcoal],
    ['footerLogo', BRAND.charcoal],
  ];
  logos.forEach(([key, bg], i) => {
    const x = SHEET.x + i * 4.65;
    const y = SHEET.top + 0.1;
    slide.addShape(pres.ShapeType.rect, { x, y, w: 4.35, h: 2.3, fill: { color: bg }, line: { color: 'DDD6CA', width: 0.75 } });
    const p = pics[`brand:${key}`];
    if (p) {
      const maxW = 3.6;
      const maxH = 1.5;
      const w = Math.min(maxW, maxH / p.ratio);
      const h = w * p.ratio;
      slide.addImage({ data: picture(p), x: x + (4.35 - w) / 2, y: y + (2.3 - h) / 2, w, h });
    }
    slide.addText(b.logos[key], { x, y: y + 2.38, w: 4.35, h: 0.3, fontFace: UI_FONT, fontSize: 11, color: BRAND.ink, margin: 0, isTextBox: true });
  });
  // Colors.
  const colors = Object.entries(st.colors || {});
  colors.forEach(([key, hex], i) => {
    const x = SHEET.x + i * 2.6;
    const y = 4.75;
    slide.addShape(pres.ShapeType.roundRect, { x, y, w: 0.8, h: 0.8, fill: { color: String(hex).replace('#', '').toUpperCase() }, line: { color: 'DDD6CA', width: 0.75 }, rectRadius: 0.08 });
    slide.addText(
      [
        { text: b.colors[key] || key, options: { bold: true, fontSize: 11, color: BRAND.sage, breakLine: true } },
        { text: String(hex).toUpperCase(), options: { fontSize: 11, color: BRAND.ink } },
      ],
      { x: x + 0.95, y, w: 1.55, h: 0.8, fontFace: UI_FONT, margin: 0, valign: 'middle', isTextBox: true },
    );
  });
  // Fonts.
  const fonts = [
    [b.fontRoles.heading, st.fonts?.heading || 'Alata'],
    [b.fontRoles.body, st.fonts?.body || 'Montserrat'],
    [b.fontRoles.small, 'Myriad Pro'],
  ];
  slide.addText(b.fonts, { x: 11.1, y: 4.55, w: 3.3, h: 0.35, fontFace: UI_FONT, fontSize: 12, bold: true, color: BRAND.sage, margin: 0, isTextBox: true });
  slide.addText(
    fonts.map(([role, name], i) => ({ text: `${role}: ${name}`, options: { breakLine: i < fonts.length - 1 } })),
    { x: 11.1, y: 4.95, w: 3.3, h: 1.1, fontFace: UI_FONT, fontSize: 11, color: BRAND.ink, margin: 0, valign: 'top', paraSpaceAfter: 4, isTextBox: true },
  );
}

/** Photos in a grid, each one replaceable, with empty boxes to paste new ones. */
function photoGrid(pres, slide, items, { x, y, cols, w, gap = 0.2, empty = 0 }) {
  const h = (w * 2) / 3;
  const all = [...items, ...Array.from({ length: empty }, () => null)];
  all.forEach((it, i) => {
    const cx = x + (i % cols) * (w + gap);
    const cy = y + Math.floor(i / cols) * (h + 0.42);
    if (it?.pic) slide.addImage({ data: picture(it.pic), x: cx, y: cy, w, h, altText: it.alt || undefined });
    else {
      slide.addShape(pres.ShapeType.rect, { x: cx, y: cy, w, h, fill: { color: 'FFFFFF' }, line: { color: 'B8AE9C', width: 1, dashType: 'dash' } });
      slide.addText(it ? it.missing || T.property.paste : T.property.paste, { x: cx, y: cy, w, h, fontFace: UI_FONT, fontSize: 10, color: '8A8580', align: 'center', valign: 'middle', margin: 0.1, isTextBox: true });
    }
    if (it?.caption) {
      slide.addText(it.caption, { x: cx, y: cy + h + 0.05, w, h: 0.3, fontFace: UI_FONT, fontSize: 9, color: it.flag ? 'A0522D' : '6F6A62', margin: 0, isTextBox: true });
    }
  });
}

function addPropertySheet(pres, section, p, pics, { hidden = false, template = false } = {}) {
  const t = T.property;
  const title = template ? t.newTitle : `${T.pages.property}: ${p.title || T.untitled}${hidden ? ` — ${t.hidden}` : ''}`;
  const hint = template ? t.newHint : hidden ? t.hiddenHint : t.hint;
  const slide = addSheet(pres, section, title, hint);
  const f = t.rows;
  const rows = [
    [f.title, p.title, ''],
    [f.status, p.status, t.notes.options],
    [f.type, p.type, t.notes.options],
    [f.price, p.price, t.notes.price],
    [f.neighborhood, p.neighborhood, ''],
    [f.city, [p.city, [p.state, p.postalCode].filter(Boolean).join(' ')].filter(Boolean).join(', '), ''],
    [f.beds, p.beds, ''],
    [f.baths, p.baths, ''],
    [f.sqft, p.sqft, ''],
    [f.lotSize, p.lotSize, ''],
    [f.yearBuilt, p.yearBuilt, ''],
    [f.parking, p.parking, ''],
    [f.summary, p.summary, t.notes.summary],
    [f.description, p.description, ''],
    [f.features, (p.features || []).join('\n'), T.onePerLine],
    [f.visible, yesNo(p.visible), T.yesNo],
    [f.featured, yesNo(p.featured), T.yesNo],
  ];
  const cols = COLS(['label', T.cols.field, 2.15], ['value', T.cols.value, 4.75], ['note', T.cols.note, 2.3]);
  tableFlow(pres, section, title, hint, cols, rows, { first: { slide, y: SHEET.top } });

  // Photos on the right of the first slide (more than four go on their own
  // slide), then the choices for status and type.
  const images = (p.images || []).map((img, i) => ({ pic: pics[`prop:${p.id}:${i}`], alt: img.alt, caption: t.photo(i + 1) }));
  const px = 10.25;
  slide.addText(t.photos, { x: px, y: SHEET.top - 0.05, w: 4.15, h: 0.3, fontFace: UI_FONT, fontSize: 12, bold: true, color: BRAND.sage, margin: 0, isTextBox: true });
  const shown = images.slice(0, 4);
  photoGrid(pres, slide, shown, { x: px, y: SHEET.top + 0.35, cols: 2, w: 1.98, gap: 0.19, empty: Math.max(0, (template || hidden ? 4 : 2) - shown.length) });
  const rows2 = Math.ceil(Math.max(shown.length, template || hidden ? 4 : 2) / 2);
  slide.addText(
    [
      { text: t.statusOptions, options: { bold: true, color: BRAND.sage, breakLine: true } },
      { text: PROPERTY_STATUSES.join(' · '), options: { color: BRAND.ink, breakLine: true } },
      { text: ' ', options: { breakLine: true, fontSize: 5 } },
      { text: t.typeOptions, options: { bold: true, color: BRAND.sage, breakLine: true } },
      { text: PROPERTY_TYPES.join(' · '), options: { color: BRAND.ink } },
    ],
    { x: px, y: SHEET.top + 0.45 + rows2 * 1.74, w: 4.15, h: 1.6, fontFace: UI_FONT, fontSize: 9.5, margin: 0, valign: 'top', isTextBox: true },
  );
  const rest = images.slice(4);
  for (let i = 0; i < rest.length; i += 15) {
    const more = addSheet(pres, section, `${title} — ${t.photos} ${T.continued}`, '');
    photoGrid(pres, more, rest.slice(i, i + 15), { x: SHEET.x, y: SHEET.top - 0.2, cols: 5, w: 2.56, gap: 0.25 });
  }
}

function addTeamSheet(pres, section, content) {
  const t = T.team;
  const widths = [2.4, 1.9, 3.3, 1.7, 1.3, 2.0, 1.2];
  const cols = t.cols.map((title, i) => ({ role: i === 0 ? 'label' : 'value', title, w: widths[i] }));
  const rows = content.about.team.map((m) => [m.name, m.role, m.email, m.phone, yesNo(m.showPhone), m.linkedin, yesNo(m.visible)]);
  rows.push(['', '', '', '', '', '', '']);
  tableFlow(pres, section, t.title, t.hint, cols, rows);
}

function addContactSheet(pres, section, content) {
  const c = content.contact;
  const t = T.contactSheet;
  const r = t.rows;
  const cols = COLS(['label', T.cols.field, 3.3], ['value', T.cols.value, 7.4], ['note', T.cols.note, 3.1]);
  const rows = [
    [r.formTitle, c.form.title, ''],
    [r.inquiryTypes, (c.form.inquiryTypes || []).join('\n'), T.onePerLine],
    [r.submitLabel, c.form.submitLabel, ''],
    [r.successTitle, c.form.successTitle, ''],
    [r.successText, c.form.successText, ''],
    [r.emails, (c.info.emails || []).join('\n'), T.onePerLine],
    [r.phone, c.info.phone, ''],
    [r.showMap, yesNo(c.info.showMap), T.yesNo],
    [r.mapQuery, c.info.mapQuery, t.notes.mapQuery],
    [r.sendTo, '', t.notes.sendTo],
  ];
  tableFlow(pres, section, t.title, t.hint, cols, rows);
}

function addGallerySheets(pres, section, content, pics) {
  const t = T.gallery;
  const items = (content.gallery?.images || []).map((g, i) => ({
    pic: pics[`gallery:${g.id}`],
    caption: `${i + 1}${g.visible === false ? ` · ${t.hidden}` : ''}${g.caption ? ` · ${g.caption}` : ''}`,
    flag: g.visible === false,
  }));
  for (let i = 0; i < items.length || i === 0; i += 15) {
    const slide = addSheet(pres, section, i ? `${t.title} ${T.continued}` : t.title, i ? '' : t.hint);
    photoGrid(pres, slide, items.slice(i, i + 15), { x: SHEET.x, y: i ? SHEET.top - 0.2 : SHEET.top, cols: 5, w: 2.56, gap: 0.25, empty: i + 15 >= items.length ? Math.min(2, 15 - (items.length - i)) : 0 });
    if (!items.length) break;
  }
}

function addPartnersSheets(pres, section, content, pics) {
  const t = T.partners;
  const items = content.partnerships?.items || [];
  const per = 8;
  for (let i = 0; i < items.length || i === 0; i += per) {
    const slide = addSheet(pres, section, i ? `${t.title} ${T.continued}` : t.title, i ? '' : t.hint);
    items.slice(i, i + per).forEach((it, j) => {
      const w = 3.225;
      const x = SHEET.x + (j % 4) * (w + 0.3);
      const y = SHEET.top + Math.floor(j / 4) * 3.2;
      slide.addShape(pres.ShapeType.rect, { x, y, w, h: 1.7, fill: { color: 'FFFFFF' }, line: { color: 'DDD6CA', width: 0.75 } });
      const p = pics[`partner:${it.id}`];
      if (p) {
        const lw = Math.min(w - 0.5, 1.3 / p.ratio);
        const lh = lw * p.ratio;
        slide.addImage({ data: picture(p), x: x + (w - lw) / 2, y: y + (1.7 - lh) / 2, w: lw, h: lh, altText: it.name });
      } else {
        slide.addText(t.noLogo, { x, y, w, h: 1.7, fontFace: UI_FONT, fontSize: 10, color: '8A8580', align: 'center', valign: 'middle', margin: 0.1, isTextBox: true });
      }
      slide.addText(
        [
          { text: it.name || '', options: { bold: true, fontSize: 11, color: BRAND.sage, breakLine: true } },
          { text: `${t.website}: ${it.url || '—'}`, options: { fontSize: 10, color: BRAND.ink, breakLine: true } },
          { text: `${T.cols.shown}: ${yesNo(it.visible !== false)}`, options: { fontSize: 10, color: BRAND.ink } },
        ],
        { x, y: y + 1.8, w, h: 1.1, fontFace: UI_FONT, margin: 0, valign: 'top', paraSpaceAfter: 3, isTextBox: true },
      );
    });
    if (!items.length) break;
  }
}

function addGoogleSheets(pres, section, content) {
  const t = T.google;
  const host = new URL(SITE).host;
  const suffix = content.settings.titleSuffix;
  const shown = (x) => x && x.visible !== false;
  const paths = [
    ...STATIC_PAGES.filter((s) => s.path !== '/team').map((s) => s.path),
    ...content.portfolio.items.filter(shown).map(propertyPath),
    ...content.services.items.filter((s) => shown(s) && s.hasPage).map(servicePath),
    ...content.about.team.filter(shown).map(memberPath),
  ];
  const results = [];
  for (const p of paths) {
    try {
      const seo = pageSeo(content, resolveRoute(content, p));
      results.push({ url: [host, ...p.split('/').filter(Boolean)].join(' › '), title: fullTitle(seo.title, suffix), description: seo.description });
    } catch {
      /* a page without SEO data is simply left out */
    }
  }
  const per = 6;
  for (let i = 0; i < results.length; i += per) {
    const slide = addSheet(pres, section, i ? `${t.title} ${T.continued}` : t.title, i ? '' : t.hint);
    results.slice(i, i + per).forEach((r, j) => {
      const w = 6.75;
      const x = SHEET.x + (j % 2) * (w + 0.3);
      const y = SHEET.top + Math.floor(j / 2) * 1.95 - (i ? 0.2 : 0);
      slide.addShape(pres.ShapeType.rect, { x, y, w, h: 1.7, fill: { color: 'FFFFFF' }, line: { color: 'E3DED5', width: 0.75 } });
      slide.addText(r.url, { x: x + 0.2, y: y + 0.15, w: w - 0.4, h: 0.28, fontFace: 'Arial', fontSize: 10, color: '4D5156', margin: 0, isTextBox: true });
      slide.addText(r.title, { x: x + 0.2, y: y + 0.45, w: w - 0.4, h: 0.4, fontFace: 'Arial', fontSize: 14, color: '1A0DAB', margin: 0, valign: 'top', isTextBox: true });
      slide.addText(r.description, { x: x + 0.2, y: y + 0.9, w: w - 0.4, h: 0.7, fontFace: 'Arial', fontSize: 10.5, color: '4D5156', margin: 0, valign: 'top', isTextBox: true });
    });
  }
}

function addLinkPreview(pres, section, content, pics) {
  const t = T.preview;
  const slide = addSheet(pres, section, t.title, t.hint);
  const w = 6.2;
  const x = (W * PX - w) / 2;
  const y = SHEET.top + 0.1;
  const ih = w / 1.91;
  slide.addShape(pres.ShapeType.roundRect, { x, y, w, h: ih + 1.55, fill: { color: 'FFFFFF' }, line: { color: 'DDD6CA', width: 0.75 }, rectRadius: 0.08 });
  const p = pics.share;
  if (p) slide.addImage({ data: picture(p), x, y, w, h: ih });
  const seo = content.home.seo;
  slide.addText(new URL(SITE).host.toUpperCase(), { x: x + 0.25, y: y + ih + 0.15, w: w - 0.5, h: 0.28, fontFace: 'Arial', fontSize: 10, color: '6F6A62', margin: 0, isTextBox: true });
  slide.addText(fullTitle(seo.title, content.settings.titleSuffix), { x: x + 0.25, y: y + ih + 0.45, w: w - 0.5, h: 0.4, fontFace: 'Arial', fontSize: 14, bold: true, color: '1A1A1A', margin: 0, isTextBox: true });
  slide.addText(seo.description, { x: x + 0.25, y: y + ih + 0.85, w: w - 0.5, h: 0.6, fontFace: 'Arial', fontSize: 10.5, color: '4D5156', margin: 0, valign: 'top', isTextBox: true });
}

function get(obj, dotted) {
  return dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);
}

function addHiddenSheet(pres, section, content) {
  const t = T.hidden;
  const rows = [];
  for (const [key, [what, where]] of Object.entries(t.sections)) if (get(content, key) === false) rows.push([what, where, T.no]);
  const off = (x) => x && x.visible === false;
  for (const m of content.navigation.mainMenu.filter(off)) rows.push([t.menuItem(m.label), t.menu, T.no]);
  for (const p of content.portfolio.items.filter(off)) rows.push([p.title, T.pages.portfolio, T.no]);
  for (const s of content.services.items.filter(off)) rows.push([s.title, T.pages.services, T.no]);
  for (const m of content.about.team.filter(off)) rows.push([m.name, t.team, T.no]);
  for (const p of (content.partnerships?.items || []).filter(off)) rows.push([p.name, T.pages.partnerships, T.no]);
  (content.gallery?.images || []).forEach((g, i) => off(g) && rows.push([t.galleryPhoto(i + 1), t.gallery, T.no]));
  if (!rows.length) return;
  const cols = COLS(['label', t.cols[0], 6.2], ['value', t.cols[1], 4.4], ['value', t.cols[2], 3.2]);
  tableFlow(pres, section, t.title, t.hint, cols, rows);
}

/* ---------------------------------------------------------------- main */

function pageGroups(content) {
  const shown = (x) => x && x.visible !== false;
  const order = [];
  const add = (p) => !order.includes(p) && order.push(p);
  add('/');
  for (const m of (content.navigation?.mainMenu || []).filter(shown)) if (STATIC_PAGES.some((s) => s.path === m.path)) add(m.path);
  for (const s of STATIC_PAGES) add(s.path);

  const groups = [];
  for (const p of order) {
    if (p === '/team') continue; // same page as /about
    const key = STATIC_PAGES.find((s) => s.path === p).key;
    const pages = [{ path: p, kind: key, sub: STATIC_PAGES.find((s) => s.path === p).label }];
    if (key === 'portfolio') for (const it of content.portfolio.items.filter(shown)) pages.push({ path: propertyPath(it), kind: 'property', sub: it.title, item: it });
    if (key === 'about') for (const m of content.about.team.filter(shown)) pages.push({ path: memberPath(m), kind: 'member', sub: m.name });
    if (key === 'services') for (const s of content.services.items.filter((s) => shown(s) && s.hasPage)) pages.push({ path: servicePath(s), kind: 'service', sub: s.title });
    groups.push({ key, pages });
  }
  return groups;
}

/** Every content picture the form slides show, converted in one pass. */
function pictureSpecs(content) {
  const specs = [];
  for (const p of content.portfolio.items) (p.images || []).forEach((img, i) => img.src && specs.push({ key: `prop:${p.id}:${i}`, src: img.src, fit: 'cover', w: 780, h: 520 }));
  for (const g of content.gallery?.images || []) if (g.src) specs.push({ key: `gallery:${g.id}`, src: g.src, fit: 'cover', w: 780, h: 520 });
  for (const it of content.partnerships?.items || []) if (it.logo) specs.push({ key: `partner:${it.id}`, src: it.logo, fit: 'contain', w: 800, h: 400 });
  for (const k of ['logo', 'logoOnDark', 'footerLogo']) if (content.style?.[k]) specs.push({ key: `brand:${k}`, src: content.style[k], fit: 'contain', w: 900, h: 380 });
  const share = content.home?.seo?.image || content.settings?.shareImage;
  if (share) specs.push({ key: 'share', src: share, fit: 'cover', w: 1200, h: 628 });
  return specs;
}

async function main() {
  const browser = await puppeteer.launch({
    executablePath: findChrome(),
    headless: true,
    args: ['--hide-scrollbars', '--force-color-profile=srgb', '--font-render-hinting=none'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: W, height: H, deviceScaleFactor: DPR });
    await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
    const helper = await browser.newPage();
    await helper.goto('about:blank');

    await page.goto(`${SITE}/`, { waitUntil: 'networkidle0', timeout: 90000 });
    const content = await page.evaluate(() => {
      const el = document.getElementById('synergy-content');
      return el ? JSON.parse(el.textContent) : null;
    });
    if (!content) throw new Error(`No site content found at ${SITE}/`);

    let groups = pageGroups(content);
    if (ONLY.length) groups = groups.map((g) => ({ ...g, pages: g.pages.filter((p) => ONLY.includes(p.path)) })).filter((g) => g.pages.length);
    const total = groups.reduce((n, g) => n + g.pages.length, 0);

    const captured = [];
    let n = 0;
    for (const g of groups) {
      for (const p of g.pages) {
        n += 1;
        process.stdout.write(`[${n}/${total}] ${p.path} … `);
        const shot = await capturePage(page, helper, `${SITE}${p.path}`, { cover: p.path === '/' });
        console.log(`${shot.screens.length} slides`);
        captured.push({ group: g, page: p, ...shot });
      }
    }
    process.stdout.write('Header, footer and “page not found” … ');
    // A page outside the menu, so no menu item shows as the current one.
    const header = await capturePage(page, helper, `${SITE}/page-not-found`, { region: 'header' });
    const footer = await capturePage(page, helper, `${SITE}/`, { region: 'footer' });
    const notFound = await capturePage(page, helper, `${SITE}/page-not-found`);
    console.log('done');

    process.stdout.write('Photos and logos … ');
    await page.goto(`${SITE}/`, { waitUntil: 'networkidle0', timeout: 90000 });
    const specs = pictureSpecs(content);
    const pics = await page.evaluate(loadPictures, specs);
    console.log(`${Object.values(pics).filter(Boolean).length}/${specs.length}`);

    const pres = new PptxGenJS();
    pres.defineLayout({ name: 'WEB', width: W * PX, height: H * PX });
    pres.layout = 'WEB';
    pres.author = 'Synergy Global';
    pres.company = 'Synergy Global';
    pres.title = `Synergy Global — ${T.coverTitle}`;
    pres.theme = { headFontFace: UI_FONT, bodyFontFace: UI_FONT };

    const homeShot = (captured.find((c) => c.page.path === '/') || captured[0])?.screens[0];
    const logo = header.screens[0]?.isos.filter((i) => i.w > 60).sort((a, b) => b.w - a.w)[0];
    const heroLogo = homeShot?.isos.filter((i) => i.y < 140 && i.w > 60).sort((a, b) => b.w - a.w)[0];

    pres.addSection({ title: T.coverTitle });
    addCover(pres, homeShot?.cover, heroLogo || logo, new URL(SITE).host);
    addGuide(pres);

    // Parts that are on every page.
    pres.addSection({ title: T.siteWide });
    addSectionDivider(pres, T.siteWide, T.siteWideLabel, T.siteWideItems);
    addHeaderSlide(pres, T.siteWide, header, content);
    addFooterSlides(pres, T.siteWide, footer, content);
    addCompanySheet(pres, T.siteWide, content);
    addBrandSheet(pres, T.siteWide, content, pics);

    // Page by page, with the forms that belong to each part of the site.
    const host = new URL(SITE).host;
    const finish = (group, section) => {
      if (group.key === 'portfolio') {
        for (const p of content.portfolio.items.filter((x) => x.visible === false)) addPropertySheet(pres, section, p, pics, { hidden: true });
        addPropertySheet(pres, section, { ...PROPERTY_TEMPLATE, images: [], features: [] }, pics, { template: true });
      }
      if (group.key === 'about') addTeamSheet(pres, section, content);
      if (group.key === 'contact') addContactSheet(pres, section, content);
    };
    let index = 0;
    let current = null;
    for (const c of captured) {
      const section = T.pages[c.group.key];
      if (c.group !== current) {
        if (current) finish(current, T.pages[current.key]);
        pres.addSection({ title: section });
        current = c.group;
      }
      index += 1;
      const name = c.page.kind === c.group.key ? T.pages[c.page.kind] : `${T.pages[c.page.kind]}: ${c.page.sub}`;
      const url = `${host}${c.page.path === '/' ? '' : c.page.path}`;
      addDivider(pres, section, { label: T.pageOf(index, total), name, sub: c.page.kind === c.group.key ? c.page.sub : '', url, count: c.screens.length, thumb: c.thumb });
      c.screens.forEach((s, i) => {
        const notes = `${name} — ${SITE}${c.page.path}\n${T.screen(i + 1, c.screens.length)}\n\n${T.notesPrompt}\n`;
        const badge = c.page.path === '/' && i === 0 && content.home?.hero?.backgroundVideo ? T.videoBadge : '';
        addScreenSlide(pres, section, s, notes, { last: i === c.screens.length - 1, badge });
      });
      if (c.page.kind === 'property') addPropertySheet(pres, section, c.page.item, pics);
    }
    if (current) finish(current, T.pages[current.key]);

    // Everything else.
    pres.addSection({ title: T.more });
    addSectionDivider(pres, T.more, T.moreLabel, T.moreItems);
    addGallerySheets(pres, T.more, content, pics);
    addPartnersSheets(pres, T.more, content, pics);
    addGoogleSheets(pres, T.more, content);
    addLinkPreview(pres, T.more, content, pics);
    addDivider(pres, T.more, { label: T.extraPage, name: T.notFound, sub: T.notFoundSub, count: notFound.screens.length, thumb: notFound.thumb });
    notFound.screens.forEach((s, i) => addScreenSlide(pres, T.more, s, `${T.notFound}\n\n${T.notesPrompt}\n`, { last: i === notFound.screens.length - 1 }));
    addHiddenSheet(pres, T.more, content);

    pres.addSection({ title: T.endTitle });
    addClosing(pres);

    fs.mkdirSync(path.dirname(OUT), { recursive: true });
    await pres.writeFile({ fileName: OUT });
    const mb = (fs.statSync(OUT).size / 1048576).toFixed(1);
    console.log(`\nSaved ${OUT} (${slideCount} slides, ${mb} MB)`);

    if (DEBUG) {
      fs.mkdirSync(DEBUG, { recursive: true });
      for (const r of references) fs.writeFileSync(path.join(DEBUG, `slide-${String(r.no).padStart(3, '0')}.png`), Buffer.from(r.data, 'base64'));
      console.log(`Reference screenshots in ${DEBUG}`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
