// PM2 process config for the Raspberry Pi.
// Start:   pm2 start ecosystem.config.js
// Reload:  pm2 reload sketchy-bio
// Logs:    pm2 logs sketchy-bio
module.exports = {
  apps: [
    {
      name: "sketchy-bio",
      // Run the self-contained standalone server produced by `npm run build:pi`.
      script: ".next/standalone/server.js",
      cwd: __dirname,
      instances: 1,
      exec_mode: "fork",
      max_memory_restart: "400M",
      env: {
        NODE_ENV: "production",
        PORT: 3008,
        HOSTNAME: "127.0.0.1",
      },
      // .env is loaded by the app via Prisma/Auth; PM2 also reads it if present.
      env_file: ".env",
    },
  ],
};
