"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Welcome to Incidents App 🚗</h1>
      <p className="mt-2 text-gray-600">Manage and track incidents here.</p>

      <Link
        href="/fleetmanager/incidents"
        className="inline-block px-4 py-2 bg-black text-white rounded-lg shadow hover:bg-gray-800 transition"
      >
        View Incidents
      </Link>
    </main>
  );
}
