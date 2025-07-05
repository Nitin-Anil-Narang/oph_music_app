import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import Sidebar from "../../../components/Sidebar";

// Artist Portal page – independent component
// Tailwind‑only styling – brand colour #0d3c44

const WebsiteConfig = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const links = [
    { label: "Content Management", route: "/calendar"},
    { label: "Website Config", route: "/notifications"},
    { label: "Event Management", route: "/eventManagement" },
    
  ];

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
    <Sidebar title="Artist Portal" links={links} /> 
      

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
