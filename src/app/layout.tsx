import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "avan's stat tracker",
  description: "avan's stat tracker",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="m-0 p-0 font-sans bg-[#111111] text-[#eeeeee] lowercase">
        {children}
      </body>
    </html>
  );
}
