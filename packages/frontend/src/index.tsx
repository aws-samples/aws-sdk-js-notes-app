import { Buffer } from "buffer";
import process from "process";
import React from "react";
import { createRoot } from "react-dom/client";
import { Routes } from "./Routes";

// Polyfills required for MicrophoneStream
if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}
if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}
if (typeof (window as any).process === "undefined") {
  (window as any).process = process;
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <div className="container" style={{ height: "100vh" }}>
    <Routes />
  </div>
);
