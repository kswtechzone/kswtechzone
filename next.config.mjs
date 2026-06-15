/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'kswtechzone.com',
      'avatars.githubusercontent.com',
      'lh3.googleusercontent.com',
      's.gravatar.com',
    ],
  },
  output: 'standalone',
};

export default nextConfig;
