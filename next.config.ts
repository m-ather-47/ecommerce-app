import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  redirects: async () => {
    return [
      {
        source: "/auth/sign-in",
        destination: "/auth/login",
        permanent: true,
      },
      {
        source: "/auth/sign-up",
        destination: "/auth/register",
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
