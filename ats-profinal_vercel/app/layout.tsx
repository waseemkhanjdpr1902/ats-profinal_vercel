import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "ATSPro – ATS Score Checker & CV Builder",
  description: "Beat ATS filters. Get hired faster with AI-powered resume tools.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Nav />
        {children}
      </body>
    </html>
  );
}
