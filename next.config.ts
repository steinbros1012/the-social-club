import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "endlesssports.org",
        pathname: "/wp-content/**",
      },
    ],
  },
}

export default nextConfig
