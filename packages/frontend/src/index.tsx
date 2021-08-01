import { Buffer } from "buffer";
import React from "react";
import ReactDOM from "react-dom";
import { Routes } from "./Routes";

if (typeof (window as any).global === "undefined") {
  (window as any).global = window;
}

if (typeof (window as any).Buffer === "undefined") {
  (window as any).Buffer = Buffer;
}

ReactDOM.render(
  <div className="container" style={{ height: "100vh" }}>
    <Routes />
  </div>,
  document.getElementById("root")
);
