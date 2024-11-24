import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import App from "./App";

// root elementini seç
const root = ReactDOM.createRoot(document.getElementById("root"));

// React 18 uyumlu render
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
