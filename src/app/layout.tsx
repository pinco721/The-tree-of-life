import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import ClientBody from "./ClientBody";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-open-sans",
});

export const metadata: Metadata = {
  title: "Family Tree",
  description: "Interactive family tree visualization",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <ClientBody className={openSans.variable}>{children}</ClientBody>
    </html>
  );
}
