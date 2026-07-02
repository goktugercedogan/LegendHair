import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Legend Hair | Reservierung",
  description: "Moderner One-Page Webauftritt mit Reservierungssystem für Legend Hair."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de">
      <body>{children}</body>
    </html>
  );
}
