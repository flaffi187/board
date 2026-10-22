/** @type {import('next').NextConfig} */
const nextConfig = {
  // Board auch über die weitergeleitete Codespace-Adresse (Handy, andere Geräte/Browser) erlauben
  allowedDevOrigins: process.env.CODESPACE_NAME
    ? [`${process.env.CODESPACE_NAME}-3000.${process.env.GITHUB_CODESPACES_PORT_FORWARDING_DOMAIN || 'app.github.dev'}`]
    : [],
};

export default nextConfig;
