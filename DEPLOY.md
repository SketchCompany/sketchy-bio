# Deploying Sketchy to the Raspberry Pi

Runs as a Node process under PM2, behind Nginx, at `sketchy.sketch-company.de`.

## One-time setup on the Pi

1. Install Node 20+ (or newer), PostgreSQL, Nginx and PM2 (`npm i -g pm2`).
2. Create the database and role:
   ```sh
   sudo -u postgres createuser sketchy --pwprompt
   sudo -u postgres createdb sketchy_bio -O sketchy
   ```
3. Create the uploads directory that Nginx serves:
   ```sh
   sudo mkdir -p /var/www/sketchy/uploads
   sudo chown "$USER":"$USER" /var/www/sketchy/uploads
   ```
4. Clone the repo, then `cp .env.example .env` and fill it in:
   - `DATABASE_URL` with the password you set
   - `AUTH_SECRET` from `openssl rand -base64 32`
   - a real `ADMIN_PASSWORD`
   - `UPLOAD_DIR="/var/www/sketchy/uploads"`
5. Nginx: copy `nginx.conf.example` to `/etc/nginx/sites-available/sketchy`, symlink it into
   `sites-enabled`, run `sudo nginx -t && sudo systemctl reload nginx`, then add TLS with
   `sudo certbot --nginx -d sketchy.sketch-company.de`.

## Build and run

```sh
npm ci                 # install deps
npm run db:deploy      # apply migrations
npm run db:seed        # first time only — creates the admin + starter content
npm run build:pi       # production build + copies static/public into .next/standalone
pm2 start ecosystem.config.js
pm2 save               # persist across reboots (also run `pm2 startup` once)
```

The app now listens on `127.0.0.1:3000`; Nginx serves it publicly.

## Updating after a change

```sh
git pull
npm ci
npm run db:deploy
npm run build:pi
pm2 reload sketchy-bio
```

## Notes

- Admin lives at `/admin` (login at `/admin/login`). Change the password by re-seeding with a
  new `ADMIN_PASSWORD`, or add a change-password step later.
- Uploads persist in `/var/www/sketchy/uploads`, outside the app, so rebuilds don't touch them.
- `output: "standalone"` keeps the deployed bundle and memory footprint small for the Pi.
- Prisma uses a single pooled client; `connection_limit=5` in `DATABASE_URL` keeps Postgres calm.
