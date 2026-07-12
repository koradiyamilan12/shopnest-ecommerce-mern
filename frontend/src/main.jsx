import { createRoot } from "react-dom/client";
import { Toaster, ToastBar } from "react-hot-toast";
import { MdCheckCircle, MdError, MdInfo } from "react-icons/md";
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
          duration: 1000,
          style: {
            fontFamily: "var(--font-family)",
            background: "rgba(var(--background-rgb), 0.8)",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
            color: "var(--foreground)",
            border: "1px solid var(--surface-border)",
            borderRadius: "var(--radius-full)",
            padding: "12px 24px",
            boxShadow: "var(--shadow-lg)",
            fontWeight: 500,
            fontSize: "var(--text-sm)",
          },
          success: {
            icon: <MdCheckCircle style={{ color: "var(--success)", fontSize: "1.5rem" }} />,
            style: {
              borderLeft: "4px solid var(--success)",
            },
          },
          error: {
            icon: <MdError style={{ color: "var(--error)", fontSize: "1.5rem" }} />,
            style: {
              borderLeft: "4px solid var(--error)",
            },
          },
          blank: {
            icon: <MdInfo style={{ color: "var(--brand)", fontSize: "1.5rem" }} />,
            style: {
              borderLeft: "4px solid var(--brand)",
            },
          }
        }}
      >
        {(t) => (
          <ToastBar
            toast={t}
            style={{
              ...t.style,
              animation: t.visible
                ? "toastSlideDown 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards"
                : "toastSlideUp 0.4s ease-in forwards",
            }}
          />
        )}
      </Toaster>
    </AuthProvider>
  </Provider>,
);
