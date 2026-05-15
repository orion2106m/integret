import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { ShellProviders } from "./providers/ShellProviders";
import { appRouter } from "./router";
import "./styles/globals.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ShellProviders>
      <RouterProvider router={appRouter} />
    </ShellProviders>
  </StrictMode>,
);
