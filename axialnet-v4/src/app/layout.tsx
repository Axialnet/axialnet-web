import type { Metadata } from "next";
import { IBM_Plex_Serif, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";

const ibmSerif = IBM_Plex_Serif({
  variable: "--font-ibm-serif",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"]
});

const ibmSans = IBM_Plex_Sans({
  variable: "--font-ibm-sans",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"]
});

const ibmMono = IBM_Plex_Mono({
  variable: "--font-ibm-mono",
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  style: ["normal", "italic"]
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.axialnet.in"),
  title: "axialnet — ML Studio",
  description: "Machine learning for physical-world engineering systems.",
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${ibmSerif.variable} ${ibmSans.variable} ${ibmMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
