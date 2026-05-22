import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./styles/index.css";
import { AppProvider } from "./context/AppProvider.tsx";

createRoot(document.getElementById("root")!).render(
  <AppProvider>
    <App />
  </AppProvider>,
);
