import React, { useState } from "react";
import { Menu, X } from "lucide-react";

// WebsiteConfig page – independent component
// Tailwind‑only styling – brand colour #0d3c44

const WebsiteConfig = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const links = [
    { label: "Content Management", href: "#contentManagement" },
    { label: "Website Config", href: "#websiteConfig" },
    { label: "Event Management", href: "#eventManagement" },
  ];

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
      {/* Overlay behind sidebar */}
      {sidebarOpen && (
        <div
          // className="fixed inset-0 bg-black bg-opacity-30 z-10"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Hamburger / Close button (always visible) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 p-2 rounded-full text-[#0d3c44] bg-transparent hover:bg-transparent active:bg-transparent focus:outline-none"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0d3c44] text-white flex flex-col py-6 shadow-2xl rounded-r-2xl z-20 transition-transform duration-300">
          <h1 className="text-2xl font-bold px-6 mb-8">Website Config</h1>
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
        <div className="text-gray-400 italic">
          Select an item from the sidebar…
        </div>
      </main>
    </div>
  );
};

export default WebsiteConfig;
