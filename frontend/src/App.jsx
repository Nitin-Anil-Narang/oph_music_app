import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ArtistProvider } from "./pages/auth/API/ArtistContext";
import DashboardRoutes from "./routes/DashboardRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import Error from "./pages/Error";
import { Navigate } from "react-router-dom";
import React from "react";
// import NotFound from "./pages/error/NotFound";
// import Unauthorized from "./pages/error/Unauthorized";

const App = () => {
  
  return (
    <Router>
      <ArtistProvider>
        <Routes>
          {/* Artist Routes */}
          <Route index element={<AuthRoutes />} />
          <Route path="/dashboard/*" element={<DashboardRoutes />} />

          {/* Authentication Routes */}
          <Route path="/auth/*" element={<AuthRoutes />} />
          {/* Error Pages */}
          {/* <Route path="*" element={<NotFound />} />
          <Route path="/unauthorized" element={<Unauthorized />} /> */}
          <Route path="/" element={<Navigate to="/auth" />} />
          <Route path="*" element={<Error />} />

        </Routes>
      </ArtistProvider>
    </Router>
  );
};

export default App;
