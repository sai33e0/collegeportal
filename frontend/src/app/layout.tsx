import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SRIT College Portal",
  description: "Srinivasa Ramanujan Institute of Technology - College Management Portal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
