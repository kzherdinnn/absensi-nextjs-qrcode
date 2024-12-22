const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development', // Nonaktifkan saat development
  register: true,
  skipWaiting: true,
});

const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA(nextConfig);
