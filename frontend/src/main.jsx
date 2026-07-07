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
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 4000,
          style: {
            background: "#18181b",
            color: "#fef3c7",
            border: "1px solid rgba(249, 115, 22, 0.35)",
            borderRadius: "14px",
            padding: "14px 16px",
            boxShadow: "0 16px 40px rgba(0, 0, 0, 0.35)",
            fontWeight: 600,
          },
          success: {
            style: {
              background: "linear-gradient(135deg, #14532d 0%, #166534 100%)",
              color: "#ecfdf5",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#16a34a",
            },
          },
          error: {
            style: {
              background: "linear-gradient(135deg, #7f1d1d 0%, #991b1b 100%)",
              color: "#fef2f2",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#ef4444",
            },
          },
        }}
      />
    </AuthProvider>
  </Provider>,
);
