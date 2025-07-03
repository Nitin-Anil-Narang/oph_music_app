import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";
import AdminSignInForm from "./pages/AdminSignIn";

import Home from "./pages/Home";
import AdminSignUpForm from "./pages/AdminSignUp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AdminSignInForm />} />
        <Route path="/signup" element={<AdminSignUpForm />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
