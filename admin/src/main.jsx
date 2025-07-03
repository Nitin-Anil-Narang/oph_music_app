import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx';
import './index.css';
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
     <div className="z-[1000]">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
    </div>
  </StrictMode>,
)
