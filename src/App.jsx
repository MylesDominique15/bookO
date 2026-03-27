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
        background: "rgba(245, 237, 224, 0.8)", // Semi-transparent version of bg
        borderBottom: "1px solid var(--color-border)",
        fontFamily: "var(--font-serif)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div style={{ /* ... existing styles */ }}>
        {/* Brand */}
        <NavLink to="/" style={{ display: "flex", alignItems: "center", gap: "9px", textDecoration: "none" }}>
          <div style={{
              width: 28, height: 28, borderRadius: "50%",
              border: `1.5px solid #5a7a3a`, // Explicitly olive
              background: `#5a7a3a18`,
              display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Sparkles size={13} color="#5a7a3a" />
          </div>
          <span style={{ fontSize: "17px", fontWeight: "800", color: "var(--color-text)", letterSpacing: "-0.03em" }}>
            bookO
          </span>
        </NavLink>

        {/* Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          {NAV_ITEMS.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              style={({ isActive }) => ({
                // ... existing logic
                color: isActive ? "#5a7a3a" : "var(--color-subtext)",
                background: isActive ? "#5a7a3a14" : "transparent",
                fontFamily: "var(--font-serif)",
                fontWeight: isActive ? "700" : "500",
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
      @import url('https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700;800&display=swap');

      :root {
        /* Matching the PALETTE from Profile.jsx */
        --color-bg: #f5ede0;
        --color-surface: #fdf6ec;
        --color-surface-alt: #f0e6d3;
        --color-border: #d9c8b0;
        --color-text: #3d2b1f;
        --color-subtext: #8c7260;
        --color-accent: #5a7a3a; /* Dark Olive */
        --font-serif: 'Lora', 'Georgia', serif;
      }

      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      body {
        font-family: var(--font-serif);
        background-color: var(--color-bg);
        color: var(--color-text);
        -webkit-font-smoothing: antialiased;
      }

      /* Update the Scrollbar to match the brown/cream tones */
      ::-webkit-scrollbar-thumb {
        background: #d9c8b0;
        border-radius: 10px;
      }
      ::-webkit-scrollbar-thumb:hover {
        background: #8c7260;
      }
    `}</style>
  );
}