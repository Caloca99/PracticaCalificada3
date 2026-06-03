/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos"
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com"
      },
      {
        protocol: "https",
        hostname: "fakestoreapi.com",
        pathname: "/img/**"
      }
    ]
  }
};

export default nextConfig;
