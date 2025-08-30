import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";



export const metadata: Metadata = {
  title: "Incidents-app",
  description: "An Incident management system for cars",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
