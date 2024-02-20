import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./contexts/auth.jsx";

const warmUpBackend = async () => {
  try {
     await fetch(`${import.meta.env.VITE_API_URL}`);
    console.log('Backend warmed up successfully');
  } catch (error) {
    console.error('Error warming up the backend:', error);
  }
};

warmUpBackend();


ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
