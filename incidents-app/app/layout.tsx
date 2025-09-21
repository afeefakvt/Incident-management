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
      <body className="bg-gray-50">
        <Providers>
          <div className="min-h-screen">
            <Sidebar />
            
            <div className="lg:pl-64">
              {/* Mobile content padding for fixed header */}
              <div className="lg:hidden h-16" />
              
              <main className="flex-1 min-h-screen">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}