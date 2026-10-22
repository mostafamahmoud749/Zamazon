/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL || 'http://localhost:9000',
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com', 'cdn.dummyjson.com'],
    remotePatterns: process.env.CLOUDINARY_CLOUD_NAME
      ? [
          {
            protocol: 'https',
            hostname: 'res.cloudinary.com',
            port: '',
            pathname: `/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/**`,
            search: '',
          },
        ]
      : [],
  },
};

export default nextConfig;
