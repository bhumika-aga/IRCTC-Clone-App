import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

// Import global styles
import "@/styles/global.css";

// React DevTools recommendation - Install browser extension for better debugging:
// https://reactjs.org/link/react-devtools

// Enable React strict mode for development
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
