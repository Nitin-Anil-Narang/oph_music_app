import React, { useState } from "react";
import { Menu, X, ChevronDown, ChevronRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // ⬅ add Link
// Tailwind‑only styling – brand colour #0d3c44

const ArtistPortal = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const navigate = useNavigate();

  const toggleSection = (label) =>
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));

  /** All in‑app routes live in `to` (not `href`). */
  const links = [
    {
      label: "Artist",
      children: [
        { label: "New", to: "/ArtistNew" },
        { label: "All", to: "/ArtistAll" },
      ],
    },
    {
      label: "Content",
      children: [
        { label: "New", to: "/ContentNew" },
        { label: "Manage", to:"/ContentManage" },
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


  /** Quick helper so we can close the sidebar after navigation */
  const handleNav = (to) => {
    navigate(to);
    setSidebarOpen(false);
  };

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
      {/* Toggle button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed top-4 left-4 z-30 p-2 rounded-full text-[#0d3c44] hover:bg-gray-100"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      {sidebarOpen && (
        <aside className="fixed inset-y-0 left-0 w-64 bg-[#0d3c44] text-white flex flex-col py-6 shadow-2xl rounded-r-2xl z-20">
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
                              {/* 1️⃣ Either use Link */}
                              <Link
                                to={sub.to}
                                onClick={() => setSidebarOpen(false)}
                                className="block py-1 pl-2 hover:underline text-sm"
                              >
                                {sub.label}
                              </Link>
                              {/* 2️⃣ …or programmatic navigate:
                                  <button onClick={() => handleNav(sub.to)} …> */}
                            </li>
                          ))}
                        </ul>
                      )}
                    </>
                  ) : (
                    // Top‑level item without children
                    <button
                      onClick={() => handleNav(link.to)}
                      className="block w-full text-left py-2 font-medium hover:underline"
                    >
                      {link.label}
                    </button>
                  )}
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

export default ArtistPortal;
