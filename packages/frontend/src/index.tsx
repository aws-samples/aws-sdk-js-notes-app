import { Buffer } from "buffer";
import process from "process";
import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./Routes";
import { ThemeProvider } from "./hooks/useThemeContext";

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
import 'bootstrap/dist/css/bootstrap.min.css';



ReactDOM.render(
    <ThemeProvider>
      <Routes />
    </ThemeProvider>,
    document.getElementById("root")
);
