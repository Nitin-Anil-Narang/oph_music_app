import React, { useState } from "react";
import { Menu, X } from "lucide-react";

// Artist Portal page – independent component
// Tailwind‑only styling – brand colour #0d3c44

const WebsiteConfig = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { label: "Content Management", href: "#contentManagement " },
    { label: "Website Config", href: "#websiteConfig" },
    { label: "Event Management", href: "#eventManagement" },
  ];

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
      {/* Hamburger / Close button (mobile) */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-20 p-3 rounded-2xl bg-[#0d3c44] text-white shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d3c44]"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } transition-transform duration-300 w-64 bg-[#0d3c44] text-white flex flex-col py-6 shadow-2xl rounded-r-2xl z-10`}
      >
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
