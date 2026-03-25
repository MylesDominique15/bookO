import React, { useContext } from "react";
import { BrowserRouter, Routes, Route, NavLink, useLocation } from "react-router-dom";
import { Home as HomeIcon, BookOpen, ClipboardList, User, Sparkles } from "lucide-react";

import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { ReaderProvider, ReaderContext } from "./context/ReaderContext";

import './index.css';

import Home from "./pages/Home";
import Read from "./pages/Read";
import Assessment from "./pages/Assessment";
import Profile from "./pages/Profile";

// ─── Nav items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  { path: "/", label: "Home", icon: HomeIcon, exact: true },
  { path: "/read", label: "Read", icon: BookOpen },
  { path: "/assessment", label: "Assessment", icon: ClipboardList },
  { path: "/profile", label: "Profile", icon: User },
];

// ─── Top navigation bar ───────────────────────────────────────────────────────
function Navbar() {
  const { styles, fontFamily } = useTheme();
  const { documentTitle } = useContext(ReaderContext);
  const location = useLocation();

  const isReadPage = location.pathname === "/read";

  // Hide full nav on the immersive read page — show a minimal bar instead
  if (isReadPage) {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 220, // sidebar width
          right: 0,
          height: "40px",
          background: "var(--color-bg)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 100,
          fontFamily,
        }}
      >
        <p
          style={{
            fontSize: "12px",
            color: "var(--color-subtext)",
            letterSpacing: "0.04em",
            fontWeight: "500",
            maxWidth: "480px",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {documentTitle || "Reading Session"}
        </p>
      </div>
    );
  }

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 200,
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        fontFamily,
        backdropFilter: "blur(8px)",
      }}
      aria-label="Main navigation"
    >
      <div
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px",
          height: "56px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Brand */}
        <NavLink
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "9px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              border: `1.5px solid ${styles.accent}`,
              background: `${styles.accent}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Sparkles size={13} color={styles.accent} />
          </div>
          <span
            style={{
              fontSize: "15px",
              fontWeight: "800",
              color: "var(--color-text)",
              letterSpacing: "-0.02em",
            }}
          >
            bookO
          </span>
        </NavLink>

        {/* Nav links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end={path === "/"}
              style={({ isActive }) => ({
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "7px 14px",
                borderRadius: "9px",
                textDecoration: "none",
                fontSize: "13px",
                fontWeight: isActive ? "700" : "500",
                color: isActive ? styles.accent : "var(--color-subtext)",
                background: isActive ? `${styles.accent}14` : "transparent",
                transition: "all 0.18s ease",
                letterSpacing: isActive ? "-0.01em" : "0",
              })}
            >
              <Icon size={14} />
              {label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ─── App shell ────────────────────────────────────────────────────────────────
function AppShell() {
  const { theme } = useTheme();
  const location = useLocation();
  const isReadPage = location.pathname === "/read";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        color: "var(--color-text)",
      }}
      data-theme={theme}
    >
      <Navbar />
      <main
        style={{
          paddingTop: isReadPage ? "40px" : "0",
        }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/read" element={<Read />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/profile" element={<Profile />} />
          {/* Catch-all */}
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}
console.log("1. ThemeProvider is:", ThemeProvider);
console.log("2. ReaderProvider is:", ReaderProvider);
console.log("3. Home Page is:", Home);
console.log("4. Read Page is:", Read);
console.log("5. Assessment Page is:", Assessment);
console.log("6. Profile Page is:", Profile);
// ─── Root: providers + router ─────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <ReaderProvider>
          <GlobalStyles />
          <AppShell />
        </ReaderProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

// ─── Global CSS injected once ─────────────────────────────────────────────────
function GlobalStyles() {
  return (
    <style>{`
      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      :root {
        --font-family: 'Georgia', 'Times New Roman', serif;
      }

      html, body, #root {
        height: 100%;
      }

      body {
        font-family: var(--font-family);
        background: var(--color-bg);
        color: var(--color-text);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      /* Scrollbar */
      ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: var(--color-border);
        border-radius: 3px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: var(--color-subtext);
      }

      /* Selection highlight */
      ::selection {
        background: var(--color-accent);
        color: #fff;
      }

      /* Focus ring */
      :focus-visible {
        outline: 2px solid var(--color-accent);
        outline-offset: 2px;
      }

      /* Smooth anchor transitions for router pages */
      @keyframes pageIn {
        from { opacity: 0; transform: translateY(12px); }
        to   { opacity: 1; transform: translateY(0); }
      }
    `}</style>
  );
}