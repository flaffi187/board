import { initOpenNextCloudflareForDev } from '@opennextjs/cloudflare';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Board auch über die weitergeleitete Codespace-Adresse (Handy, andere Geräte/Browser) erlauben
  allowedDevOrigins: process.env.CODESPACE_NAME
    ? [`${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev'}`]
    : [],
};

// "next dev": dieselbe Cloudflare-Datenbank wie die Online-Version benutzen (Einstellung "codespace" in wrangler.jsonc)
if (process.env.NODE_ENV === 'development') initOpenNextCloudflareForDev({ environment: 'codespace' });

export default nextConfig;
