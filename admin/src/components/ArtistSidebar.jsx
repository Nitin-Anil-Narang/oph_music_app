import React from "react";
import Sidebar from "./Sidebar"; // adjust path if needed
import { ROLES } from "../utils/roles";
import { useAuth } from "../auth/AuthProvider";

const artistLinks = [
  {
    label: "Artist",
    children: [
      { label: "All", route: "/artist/all" },
      { label: "New", route: "/artist/new" },
    ],
  },
  {
    label: "Content",
    children: [
      { label: "New", route: "/content/new" },
      { label: "Manage", route: "/content/manage" },
      { label: "Tv Publishing", route: "/content/tv" },
    ],
  },
  {
    label: "Analytics",
    children: [
      { label: "Artist KPI", route: "/analytics/kpi" },
      { label: "Content Analysis", route: "/analytics/analysis" },
      { label: "Content Release", route: "/analytics/release" },
    ],
  },
  {
    label: "Payments",
    children: [
      { label: "All", route: "/payments/all" },
      { label: "Withdrawals", route: "/payments/withdrawals" },
    ],
  },
  { label: "All Data", route: "/data" },
  { label: "Notifications", route: "/notifications" },
  { label: "Time Calendar", route: "/calendar" },
  { label: "Tickets", route: "/tickets", roles: [ROLES.SUPER_ADMIN] },
  { label: "Settings", route: "/settings", roles: [ROLES.SUPER_ADMIN] },
];

const ArtistSidebar = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50 relative">
      <Sidebar title="Artist Portal" links={artistLinks} userRole={user.role} />
      <main className="flex-1 p-10 overflow-y-auto">
        {children || (
          <div className="text-gray-400 italic flex justify-center items-center h-full">
            Select an item from the sidebar…
          </div>
        )}
      </main>
    </div>
  );
};

export default ArtistSidebar;
