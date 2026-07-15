# Synergy Global — Configuración de Seguridad

Cambios aplicados para blindar el sitio y su panel `/admin`. **Hay 2 pasos obligatorios**
antes del próximo deploy (marcados con ⚠️).

---

## ⚠️ Paso 1 — Define la contraseña del admin

El panel `/admin` y el guardado en el servidor ahora exigen login. La contraseña
se guarda **hasheada** (bcrypt) en `public/config.php`, nunca en el código ni en el bundle.

Desde la carpeta del proyecto, con PHP instalado:

```bash
php public/generate_hash.php "tu-contrasena-fuerte"
```

Esto escribe el hash en `public/config.php` automáticamente. Luego reconstruye y
despliega (el `config.php` viaja dentro de `dist/`):

```bash
npm run build
./deploy_synergy.ps1
```

> Mientras `ADMIN_PASSWORD_HASH` esté vacío, el login responde "Auth no configurada"
> y nadie puede escribir en el servidor (bloqueo seguro por defecto).
> Define la contraseña **localmente** y despliega, para que el hash quede en el servidor.

El `AUTH_SECRET` (firma los tokens de sesión) ya está generado en `public/config.php`.

---

## ⚠️ Paso 2 — Rota la contraseña FTP

La contraseña FTP estaba en texto plano dentro de `deploy_synergy.ps1`. Aunque el
archivo estaba en `.gitignore` (nunca llegó a git), cámbiala en tu hosting por precaución.

El script ya **no** contiene credenciales. Configúralas una vez por máquina:

```powershell
setx SYNERGY_FTP_HOST "tu-host"
setx SYNERGY_FTP_USER "tu-usuario"
setx SYNERGY_FTP_PASS "tu-password-nueva"
```

Abre una terminal nueva y ejecuta `./deploy_synergy.ps1`. Si falta algún dato, el
script lo pide por pantalla (la contraseña se escribe oculta).

---

## Qué se endureció

**Backend `public/api.php`**
- Escrituras y subidas requieren un **token Bearer** (HMAC, expira en 12 h).
- Endpoint de login `POST /api.php?action=login` valida con `password_verify`.
- Subidas: whitelist de extensiones (jpg, jpeg, png, webp, gif, svg, mp4, webm, pdf),
  límite de 25 MB, nombre de archivo aleatorio y saneado, y un `.htaccess` en
  `/uploads` que impide ejecutar código.
- CORS restringido a orígenes de una allowlist (antes era `*`).

**Panel `/admin`**
- Pantalla de login (`AdminLogin.jsx`); sin token no se renderiza el dashboard.
- Botón "Cerrar sesión" en el header.
- El token se guarda en `localStorage`; si el servidor responde 401, cierra sesión.

**Config y limpieza**
- `public/config.php` (git-ignored) guarda `AUTH_SECRET` y el hash. Plantilla en
  `public/config.example.php`.
- `.htaccess` pasa el header `Authorization` a PHP y bloquea acceso web a
  `config.php` / `generate_hash.php`.
- Eliminados: `info.php` (exponía el listado de directorios), `temp_test*`,
  `current_content.json`.
- `.gitignore` reforzado (config.php, deploy.zip, unzip.php, uploads/).

## Cómo cambiar la contraseña más adelante
Vuelve a ejecutar `php public/generate_hash.php "nueva-contrasena"`, luego
`npm run build` y `./deploy_synergy.ps1`.
