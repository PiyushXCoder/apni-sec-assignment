export function generateStructuredData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Apni Sec",
    applicationCategory: "SecurityApplication",
    description:
      "Track and manage your Cloud Security, Red Team Assessment, and VAPT issues in one centralized platform.",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    url: baseUrl,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "100",
    },
    featureList: [
      "Cloud Security Issue Tracking",
      "Red Team Assessment Management",
      "VAPT Issue Organization",
      "JWT Authentication",
      "Email Notifications",
      "Priority-based Tracking",
    ],
  };
}
