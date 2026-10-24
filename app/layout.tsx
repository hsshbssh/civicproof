
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CivicProof | Public Infrastructure Accountability",
  description:
    "Track civic complaints, public infrastructure projects, evidence and independent inspections through one transparent workflow.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
