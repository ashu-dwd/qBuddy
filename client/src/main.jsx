import { createRoot } from "react-dom/client";
import "./globals.css";
import App from "./App.jsx";
import { UserContextProvider } from "./contexts/user.context";
import MarkdownWithCode from "./components/markdown.jsx";

createRoot(document.getElementById("root")).render(
  <UserContextProvider>
    <App />
  </UserContextProvider>
);
