import type { Metadata } from "next";
import "./styles.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "avan's stat tracker",
  description: "avan's stat tracker",
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
