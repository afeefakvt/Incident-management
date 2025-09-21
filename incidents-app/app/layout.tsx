import type { Metadata } from "next";
import Providers from "./providers";
import "./globals.css";
import Sidebar from "@/components/Sidebar";

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
      <body>
        <Providers>
          <div className="flex bg-gray-50 min-h-screen">
            {/* Sidebar always visible */}
            <Sidebar />
            <main className="flex-1 ">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
