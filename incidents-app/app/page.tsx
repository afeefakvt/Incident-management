"use client";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-6 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-black">
          Welcome to <span className="text-gray-700">Incidents App 🚗</span>
        </h1>
        <p className="text-gray-600 text-lg md:text-xl max-w-xl mx-auto">
          Manage, track, and resolve incidents efficiently.
        </p>
      </div>
      <Link
        href="/fleetmanager/incidents"
        className="relative inline-flex items-center justify-center px-8 py-4 font-medium text-white bg-black rounded-lg shadow-lg hover:bg-gray-800 hover:scale-105 transition transform"
      >
        View Incidents
      </Link>
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-6 mt-10">
        <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow-md w-64 text-center hover:scale-105 transition transform">
          <h3 className="font-bold text-black text-lg">Track</h3>
          <p className="text-gray-600 mt-2">Keep an eye on all incidents</p>
        </div>
        <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow-md w-64 text-center hover:scale-105 transition transform">
          <h3 className="font-bold text-black text-lg">Resolve</h3>
          <p className="text-gray-600 mt-2">Update statuses and resolutions</p>
        </div>
        <div className="bg-gray-100 border border-gray-300 p-6 rounded-xl shadow-md w-64 text-center hover:scale-105 transition transform">
          <h3 className="font-bold text-black text-lg">Report</h3>
          <p className="text-gray-600 mt-2">Add new incidents easily</p>
        </div>
      </div>
    </main>
  );
}
