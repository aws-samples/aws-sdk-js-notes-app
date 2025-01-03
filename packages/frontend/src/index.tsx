import React from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <div className="container" style={{ height: "100vh" }}>
    <Routes />
  </div>
);
