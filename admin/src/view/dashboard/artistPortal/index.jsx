import React, { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";

// Artist Portal page – independent component
// Tailwind‑only styling – brand colour #0d3c44

const ArtistPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSections, setOpenSections] = useState({}); // keeps track of which parent links are expanded

  const toggleSection = (label) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  const links = [
    {
      label: "Artist",
      children: [
        { label: "All", href: "#artist-all" },
        { label: "New", href: "#artist-new" },
      ],
    },
    {
      label: "Content",
      children: [
        { label: "New", href: "#artist-new" },
        { label: "Manage", href: "#artist-all" },
        { label: "Tv Publishing", href: "#artist-new" },
      ],
    },
    {
      label: "Analytics",
      children: [
        { label: "Artist KPI", href: "#artist-all" },
        { label: "Content Analysis", href: "#artist-new" },
        { label: "Content Release", href: "#artist-new" },
      ],
    },
    {
      label: "Payments",
      children: [
        { label: "All", href: "#artist-all" },
        { label: "Withdrawals", href: "#artist-new" },
      ],
    },
    { label: "All Data", href: "#data" },
    { label: "Notifications", href: "#notifications" },
    { label: "Time Calendar", href: "#calendar" },
    { label: "Tickets", href: "#tickets" },
    { label: "Settings", href: "#settings" },
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
        <h1 className="text-2xl font-bold px-6 mb-8">Artist Portal</h1>
        <nav className="flex-1 overflow-y-auto px-6">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.label}>
                {link.children ? (
                  <>
                    <button
                      onClick={() => toggleSection(link.label)}
                      className="w-full flex items-center justify-between font-medium py-2 hover:underline"
                    >
                      <span>{link.label}</span>
                      {openSections[link.label] ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </button>
                    {openSections[link.label] && (
                      <ul className="ml-4 space-y-1">
                        {link.children.map((sub) => (
                          <li key={sub.label}>
                            <a
                              href={sub.href}
                              className="block py-1 pl-2 hover:underline text-sm"
                            >
                              {sub.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </>
                ) : (
                  <a
                    href={link.href}
                    className="block py-2 font-medium hover:underline"
                  >
                    {link.label}
                  </a>
                )}
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

export default ArtistPortal;
