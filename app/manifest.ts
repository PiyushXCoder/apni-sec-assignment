import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Apni Sec - Security Issue Management System",
    short_name: "Apni Sec",
    description:
      "Track and manage your Cloud Security, Red Team Assessment, and VAPT issues in one centralized platform.",
    start_url: "/",
    display: "standalone",
    background_color: "#000000",
    theme_color: "#000000",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
