import React from "react";
import { useAuth } from "../../../auth/AuthProvider";
import ArtistSidebar from "../../../components/ArtistSidebar";


const ArtistPortal = () => {
  const { user } = useAuth();
  return (
    <div className="h-screen flex overflow-hidden relative bg-gray-50">
      
      <ArtistSidebar></ArtistSidebar>
      
    </div>
  );
};

export default ArtistPortal;
