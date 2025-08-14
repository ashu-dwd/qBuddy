import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { UserContextProvider } from "./contexts/user.context";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
