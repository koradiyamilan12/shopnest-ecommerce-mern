import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import "./styles/global.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { Provider } from "react-redux";
import { store } from "./redux/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--surface)",
            color: "var(--foreground)",
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-md)",
            padding: "12px 16px",
            boxShadow: "var(--shadow-lg)",
            fontWeight: 500,
            fontSize: "var(--text-sm)",
          },
          success: {
            style: {
              background: "var(--success-bg)",
              color: "var(--success-text)",
              border: "1px solid var(--success)",
            },
            iconTheme: {
              primary: "var(--success)",
              secondary: "var(--success-bg)",
            },
          },
          error: {
            style: {
              background: "var(--error-bg)",
              color: "var(--error-text)",
              border: "1px solid var(--error)",
            },
            iconTheme: {
              primary: "var(--error)",
              secondary: "var(--error-bg)",
            },
          },
        }}
      />
    </AuthProvider>
  </Provider>,
);
