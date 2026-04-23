import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RegistrationRouter } from "./router/registrationRouter";

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("No se encontro el elemento #root para montar Registration");
}

createRoot(rootElement).render(
  <StrictMode>
    <RegistrationRouter />
  </StrictMode>,
);
