const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      // Cache para imagens
      urlPattern: /^https:\/\/firebasestorage\.googleapis\.com\/.*\/images\/.*/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hangover-images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 60 * 60 * 24 * 30, // 30 dias
        },
      },
    },
    {
      // Cache para fontes
      urlPattern: /^https:\/\/fonts\.(?:googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hangover-fonts',
        expiration: {
          maxEntries: 20,
          maxAgeSeconds: 60 * 60 * 24 * 365, // 1 ano
        },
      },
    },
    {
      // Cache para API (com estratégia StaleWhileRevalidate)
      urlPattern: /^https:\/\/api\.hangoverclub\.com\/api\/.*/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'hangover-api',
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 60 * 5, // 5 minutos
        },
      },
    },
    {
      // Cache para assets estáticos
      urlPattern: /\.(?:js|css)$/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'hangover-static-resources',
      },
    },
    {
      // Cache offline fallback
      urlPattern: /.*$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hangover-others',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

module.exports = withPWA({
  // Outras configurações do Next.js
  reactStrictMode: true,
  images: {
    domains: ['firebasestorage.googleapis.com'],
  },
  experimental: {
    appDir: true,
  },
});
