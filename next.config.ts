import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co", // Mengizinkan semua project Supabase
        port: "",
        pathname: "/storage/v1/object/public/**", // Membatasi akses hanya ke public storage
      },
      // Tambahkan domain lain di bawah ini jika Anda menyimpan gambar di tempat lain
    ],
  },
};

export default nextConfig;
