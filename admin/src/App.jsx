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
import Dashboard from "./view/dashboard/home";
import ArtistPortal from "./view/dashboard/artistPortal";
import WebsiteConfig from "./view/dashboard/websiteConfig";
import ArtistNew from "./view/dashboard/artistPortal/artistNew";
import ArtistAll from "./view/dashboard/artistPortal/artistAll";
import ContentNew from "./view/dashboard/artistPortal/contentNew";
import ContentManage from "./view/dashboard/artistPortal/contentManage";
import NewSignupDetails from "./view/dashboard/New_signUp";

import AssignRoles from "./pages/AssignRole";

function App() {
  return (

    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminSignInForm />} />
          <Route path="/signup" element={<AdminSignUpForm />} />
          <Route path="/WebsiteConfig" element={<WebsiteConfig />} />


          {/* <Route path="/home" element={<Dashboard />} /> */}
          <Route path="/ArtistNew" element={<ArtistNew />} />
          <Route path="/ArtistAll" element={<ArtistAll />} />
          <Route path="/ContentNew" element={<ContentNew />} />
          <Route path="/ContentManage" element={<ContentManage />} />
          <Route path="/artistPortal" element={<ArtistPortal />} />
          <Route path="/newsignup/:ophid" element={<NewSignupDetails />} />

          <Route path="/home" element={<ProtectedRoute allowedRoles={Object.values(ROLES)}><Home /></ProtectedRoute>} />
          <Route
            path="/role_change/:id"
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
