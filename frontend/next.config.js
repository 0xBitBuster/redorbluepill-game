/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    images: {
        domains: ["res.cloudinary.com"],
    },
    env: {
        NEXT_PUBLIC_CLIENT_BACKEND_URL: process.env.NODE_ENV === "production" ? "https://YOURDOMAIN.COM" : "http://127.0.0.1:4000",
        SERVER_BACKEND_URL: "http://backend:4000"
    }
};

module.exports = nextConfig;
