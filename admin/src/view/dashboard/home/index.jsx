import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {useNavigate } from "react-router-dom";

// Main Dashboard component
const Dashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState("home"); // 'home' | 'artist'

  // Sidebar link sets
  const homeLinks = [
    { label: "Section 1", href: "#section1" },
    { label: "Section 2", href: "#section2" },
    { label: "Section 3", href: "#section3" },
  ];

  const artistLinks = []; // placeholder for future use

  const links = page === "home" ? homeLinks : artistLinks;

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
      {/* Dim overlay behind the sidebar */}
      {sidebarOpen && (
        <div
          // className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Hamburger / Close button (always visible) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 p-2 rounded-full text-[#0d3c44] bg-transparent hover:bg-transparent focus:outline-none active:bg-transparent"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0d3c44] text-white flex flex-col py-6 shadow-2xl rounded-r-2xl z-20 transition-transform duration-300">
          <h1 className="text-2xl font-bold px-6 mb-8">
            {page === "home" ? "Dashboard" : "Artist Portal"}
          </h1>
          <nav className="flex-1 overflow-y-auto px-6">
            <ul className="space-y-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="block font-medium hover:underline"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
      )}

      {/* Main content */}
      <main className="flex-1 p-10 flex items-center justify-center">
        {page === "home" ? (
          <div className="flex flex-row gap-6">
            {/* Artist Portal button navigates to new view */}
            <button
              onClick={() => navigate("/artistPortal")}
              className="px-8 py-6 text-xl rounded-2xl font-semibold bg-[#0d3c44] text-white shadow-lg hover:bg-[#0b3239] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d3c44] transition-transform hover:scale-105"
            >
              Artist Portal
            </button>

            {/* Website Config placeholder */}
            <button
              onClick={() => navigate("/websiteConfig")}
              className="px-8 py-6 text-xl rounded-2xl font-semibold border-2 border-[#0d3c44] text-[#0d3c44] shadow-lg hover:bg-[#e6f2f4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d3c44] transition-transform hover:scale-105"
            >
              Website Config
            </button>
          </div>
        ) : (
          <div className="text-gray-400 italic">
            Select an item from the sidebar…
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
