import type { Metadata } from "next";
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
        {children}
      </body>
    </html>
  );
}
