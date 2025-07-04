import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminSignInForm from "./pages/AdminSignIn";
import { AuthProvider } from "./auth/AuthProvider";
import ProtectedRoute from "./components/ProtectedRoute";
import { ROLES } from "./utils/roles";

//Import for pages
import Home from "./pages/Home";
import AdminSignUpForm from "./pages/AdminSignUp";
mport Dashboard from "./view/dashboard/home";
import ArtistPortal from "./view/dashboard/artistPortal";
import WebsiteConfig from "./view/dashboard/websiteConfig";

import AssignRoles from "./pages/AssignRole";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminSignInForm />} />
          <Route path="/signup" element={<AdminSignUpForm />} />
          <Route path="/WebsiteConfig" element={<WebsiteConfig/>} />
          
         
          <Route path="/Dashboard" element={<Dashboard />} />
          <Route path="/artistPortal" element={<ArtistPortal />} />
        
          <Route path="/home" element={<ProtectedRoute allowedRoles={Object.values(ROLES)}><Home /></ProtectedRoute>} />
          <Route
            path="/role_change"
            element={
              <ProtectedRoute allowedRoles={[ROLES.SUPER_ADMIN]}>
                <AssignRoles />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>

  );
}

export default App;
