import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminSignInForm from "./pages/AdminSignIn";

import Home from "./pages/Home";
import AdminSignUpForm from "./pages/AdminSignUp";
import Dashboard from "./view/dashboard/home";
import ArtistPortal from "./view/dashboard/artistPortal";
import WebsiteConfig from "./view/dashboard/websiteConfig";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminSignInForm />} />
        <Route path="/signup" element={<AdminSignUpForm />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/artistPortal" element={<ArtistPortal />} />
        <Route path="/WebsiteConfig" element={<WebsiteConfig/>} />
      </Routes>
    </Router>
  );
}

export default App;
