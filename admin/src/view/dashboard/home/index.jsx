import React, { useState } from "react";
import { Menu, X } from "lucide-react";

import {useNavigate } from "react-router-dom";


import Sidebar from "../../../components/Sidebar";
// Dashboard with two views: Home & Artist Portal
// Tailwind‑only styling – brand colour #0d3c44


// Main Dashboard component
const Dashboard = () => {
  
  const navigate = useNavigate();


  // Sidebar link sets
  const homeLinks = [
    { label: "Artist Portal", route: "/artistPortal" },
    { label: "New SignUp", route: "/New_SignUp" },
    { label: "Website Config", route: "/WebsiteConfig" },
    { label: "Assign Role", route: "/role_change" },
  ];




  

  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">

    

     
    <Sidebar title="DashBoard" links={homeLinks} /> 

      {/* Main content */}
      <main className="flex-1 p-10 flex items-center justify-center">
        { (
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
        ) 
        }
      </main>
    </div>
  );
};

export default Dashboard;
