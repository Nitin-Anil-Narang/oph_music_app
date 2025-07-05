import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminSignInForm from "./pages/AdminSignIn";

import Home from "./pages/Home";
import AdminSignUpForm from "./pages/AdminSignUp";
import Dashboard from "./view/dashboard/home";
import ArtistPortal from "./view/dashboard/artistPortal";
import WebsiteConfig from "./view/dashboard/websiteConfig";
import ArtistNew from "./view/dashboard/artistPortal/artistNew";
import ArtistAll from "./view/dashboard/artistPortal/artistAll";
import ContentNew from "./view/dashboard/artistPortal/contentNew";
import ContentManage from "./view/dashboard/artistPortal/contentManage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/signup" element={<AdminSignUpForm />} />
        {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
        <Route path="/artistPortal" element={<ArtistPortal />} />
        <Route path="/WebsiteConfig" element={<WebsiteConfig />} />
        <Route path="/ArtistNew" element={<ArtistNew />} />
        <Route path="/ArtistAll" element={<ArtistAll />} />
        <Route path="/ContentNew" element={<ContentNew />} />
        <Route path="/ContentManage" element={<ContentManage />} />
      </Routes>
    </Router>
  );
}

export default App;
