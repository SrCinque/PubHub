import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: [
        "animated-goggles-jpr9g4wq9g52j5xg-3000.app.github.dev",
        "localhost:3000",
        // Adicione aqui o domínio da Vercel: "seu-projeto.vercel.app"
        process.env.VERCEL_URL || "",
      ].filter(Boolean),
    },
  },
};

export default nextConfig;
