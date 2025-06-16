import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
    <div className="z-[1000]">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  </StrictMode>
);
