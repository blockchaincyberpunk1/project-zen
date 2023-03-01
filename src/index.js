// Import necessary modules
import React from "react";
import ReactDOM from "react-dom";

// Import styles
import "./index.css";

// Import App component and AuthContextProvider
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

// Render the App wrapped in AuthContextProvider in the root element of the HTML
ReactDOM.render(
  <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
