/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'i.scdn.co' },
    ],
  },
  async headers() {
    return [
      {
        source: '/live',
        headers: [
          {
            key: 'Permissions-Policy',
            value: 'accelerometer=*, autoplay=*, clipboard-write=*, encrypted-media=*, fullscreen=*, gyroscope=*, magnetometer=*, payment=*, picture-in-picture=*',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig
