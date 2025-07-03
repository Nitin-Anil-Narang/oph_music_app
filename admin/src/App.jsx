import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminSignInForm from "./pages/AdminSignIn";
import { AuthProvider } from "./auth/AuthProvider";

import Home from "./pages/Home";
import AdminSignUpForm from "./pages/AdminSignUp";
import AssignRoles from "./pages/AssignRole";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AdminSignInForm />} />
          <Route path="/signup" element={<AdminSignUpForm />} />
          <Route path="/home" element={<Home />} />
          <Route path="/role_change" element={<AssignRoles />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
