# Synergy Global — sitio web y CMS

Sitio de Synergy Global Development & Investments (bienes raíces en San Francisco) con un
administrador propio en `/admin`. Todo el contenido del sitio se edita desde el CMS; nadie
necesita tocar código.

- **Sitio público:** React 19 + Vite + Tailwind 4, textos en inglés (mercado de EE. UU.).
- **CMS:** `/admin`, bilingüe (español / inglés), con vista previa, deshacer, historial y
  borrador que se guarda solo.
- **Servidor:** PHP 7+ en Apache (hosting compartido). Sin base de datos: el contenido vive
  en `data/content.json` con copias de seguridad automáticas.

## Comandos

| Comando | Qué hace |
|---|---|
| `npm run dev` + `npm run dev:api` | Desarrollo local (Vite en :5173, API PHP en :8787). |
| `npm run build` | Compila en `dist/` y revisa la contraseña y la sintaxis PHP. |
| `npm run serve` | Sirve `dist/` con PHP en http://127.0.0.1:8787 (igual que producción). |
| `npm run deploy` | Compila y publica por FTP con verificación y reversión automática. |
| `npm run set-password -- "nueva-contraseña"` | Cambia la contraseña del CMS (luego `npm run deploy`). |
| `npm run optimize-assets` | Regenera imágenes WebP, video, favicons y fuentes desde `source-assets/`. |
| `npm run export:pptx` | Genera en `exports/` un PowerPoint del sitio publicado para que el cliente lo corrija (ver abajo). |
| `npm run lint` | ESLint. |

## Revisión del cliente en PowerPoint

`npm run export:pptx` recorre todas las páginas visibles del sitio en vivo y arma una
presentación: una portada por página y una diapositiva por pantalla, en el orden en que se ve
al bajar. El diseño queda como fondo; cada texto es un cuadro de texto editable y cada foto,
logo o ícono es una imagen suelta que se puede reemplazar. El cliente escribe encima, cambia
fotos y deja comentarios; los cambios se aplican después a mano desde el CMS (el archivo no se
importa de vuelta).

Opciones: `-- --lang en` (guía en inglés), `-- --url http://127.0.0.1:8787` (sitio local),
`-- --out ruta.pptx`. Necesita Chrome o Edge (o `CHROME_PATH`). Las fuentes del sitio se
sustituyen por Century Gothic y Calibri, que vienen con Office, ajustando el tamaño para
que cada línea corte donde corta en el sitio.

## Despliegue

Configura las credenciales FTP una vez por equipo (nunca se guardan en el repositorio):

```powershell
setx SYNERGY_FTP_HOST "ftp.tu-hosting.com"
setx SYNERGY_FTP_USER "tu-usuario"
setx SYNERGY_FTP_PASS "tu-contraseña"
```

Abre una terminal nueva y ejecuta `npm run deploy`. El script:

1. compila el sitio;
2. sube un zip y un agente de un solo uso con nombre y token aleatorios (FTPS si el servidor lo permite);
3. instala los archivos respaldando todo lo que reemplaza;
4. revisa inicio, propiedades, API, robots.txt y admin;
5. si algo falla, **revierte solo**; si todo está bien, borra archivos de despliegues anteriores y el agente.

Nunca toca `data/` (contenido y respaldos) ni `uploads/` (archivos subidos desde el CMS).
Opcionales: `SYNERGY_FTP_PATH` (por defecto `/public_html/synergy.inedito.digital`) y
`SYNERGY_SITE_URL` (por defecto `https://synergy.inedito.digital`).

## Lanzamiento en el dominio definitivo

1. Apunta el dominio al hosting y ajusta `SYNERGY_FTP_PATH` / `SYNERGY_SITE_URL`.
2. En el CMS → **Ajustes y SEO**: cambia «Dominio del sitio» y activa «Permitir que Google muestre el sitio».
3. Publica. Da de alta el dominio en Google Search Console y envía `https://tu-dominio/sitemap.xml`.
4. Conecta el formulario de contacto a un correo (hoy muestra confirmación pero no envía nada).

Mientras el sitio esté en el subdominio de la agencia, Google no lo indexa (`noindex` + robots.txt),
para no posicionar una copia temporal.

## Estructura

```
src/
  content/      defaults.js (contenido de fábrica), normalize.js (valida y migra),
                schema.js, site.js (rutas y SEO), media-library.js (generado)
  components/   secciones públicas (Hero, Navbar, Footer…) y ui/ (SmartImage, SafeSection…)
  pages/        páginas públicas; ServiceDetail sirve todos los servicios
  admin/        CMS: AdminProvider (borrador, deshacer, publicar), components/, pages/, i18n.js
public/
  index.php     entrada de cada página: título, descripción, canónica, Open Graph y JSON-LD por URL
  api.php       contenido, login, publicar, subir archivos, medios, historial
  sitemap.php, robots.php
  app/          privado (bloqueado por .htaccess): bootstrap.php, seo.php, config.php (no se versiona)
  img/          imágenes optimizadas (generadas)
source-assets/  originales en alta resolución (no se publican)
tools/          optimize-assets, build-seed, postbuild, deploy-agent, generate_hash, dev-router
```

## Seguridad

- Contraseña del CMS con bcrypt en `public/app/config.php` (fuera de git y bloqueado en el servidor).
  Cambiar la contraseña cierra todas las sesiones abiertas.
- Sesiones firmadas (HMAC) de 12 h que se renuevan mientras el editor está abierto.
- Máximo 8 intentos de acceso cada 15 minutos por IP.
- Subidas: lista blanca de tipos, verificación de contenido, nombres aleatorios y sin ejecución de scripts en `uploads/`.
- Cada publicación guarda la versión anterior (se conservan 60). Dos editores no pueden pisarse: el
  segundo recibe un aviso de conflicto.

## Contenido y robustez

`normalizeContent()` se aplica al cargar y al publicar: completa campos faltantes, corrige tipos,
limita valores numéricos, asigna identificadores y direcciones web únicas, convierte enlaces absolutos
del propio dominio en relativos y migra contenido del CMS anterior. Si una sección falla al mostrarse,
solo esa sección desaparece (`SafeSection`); si falla la capa SEO en PHP, se sirve la página normal.
