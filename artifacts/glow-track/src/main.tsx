import { createRoot } from "react-dom/client";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./context/AuthContext";
import App from "./App";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </ThemeProvider>
);
