import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SalonX - Professional Salon Management Platform",
  description: "Complete salon management solution with booking, scheduling, and marketing tools",
  keywords: ["salon", "booking", "appointment", "management", "beauty", "spa"],
  authors: [{ name: "SalonX Team" }],
  creator: "SalonX",
  publisher: "SalonX",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://salonx.com'),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "SalonX - Professional Salon Management Platform",
    description: "Complete salon management solution with booking, scheduling, and marketing tools",
    siteName: "SalonX",
  },
  twitter: {
    card: "summary_large_image",
    title: "SalonX - Professional Salon Management Platform",
    description: "Complete salon management solution with booking, scheduling, and marketing tools",
    creator: "@salonx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
