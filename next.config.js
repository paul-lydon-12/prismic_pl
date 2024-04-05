// @ts-check
const isDev = process.env.NODE_ENV === 'development';
const DEFAULT_LOCALE = process.env.DEFAULT_LOCALE || 'en-gb';
const redirects = require('./redirects');

// https://nextjs.org/docs/advanced-features/security-headers#content-security-policy
const ContentSecurityPolicy = `
  default-src 'self';
  frame-ancestors 'none';
  object-src 'none';
  script-src 'self' 'unsafe-inline' *.googletagmanager.com *.google-analytics.com cookiehub.net static.cookiehub.com plausible.io *.google.com *.gstatic.com ${
    // Required for react hot reload and dev tools
    isDev ? "'unsafe-eval'" : ''
  };
  img-src 'self' data: blob: i.vimeocdn.com *.prismic.io prismic-io.s3.amazonaws.com;
  style-src 'self' 'unsafe-inline' fonts.googleapis.com cookiehub.net static.cookiehub.com p.typekit.net;
  font-src 'self' fonts.gstatic.com use.typekit.net;
  frame-src www.youtube-nocookie.com player.vimeo.com *.google.com;
  media-src 'self' prismic-io.s3.amazonaws.com;
  connect-src 'self' ws: wss: vimeo.com plausible.io *.google-analytics.com *.analytics.google.com *.googletagmanager.com ds.cookiehub.net cookiehub.net *.botpoison.com;
`;

/** @type {import('next').NextConfig} nextConfig */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: [DEFAULT_LOCALE],
    defaultLocale: DEFAULT_LOCALE,
    localeDetection: false,
  },
  redirects() {
    return Promise.resolve(redirects);
  },
  experimental: {
    scrollRestoration: true,
  },
  headers() {
    return Promise.resolve([
      {
        source: '/:path*',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'Content-Security-Policy',
            value: ContentSecurityPolicy.replace(/\s+/g, ' ').trim(),
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]);
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.prismic.io',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
};

if (process.env.ANALYZE === 'true') {
  // only load dependency if env `ANALYZE` was set
  const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: true,
  });

  module.exports = withBundleAnalyzer(nextConfig);
} else {
  module.exports = nextConfig;
}
