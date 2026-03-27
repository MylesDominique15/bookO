import React, { useContext, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
} from "recharts";
import {
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  MapPin,
  Calendar,
  Users,
  Star,
  Award,
  Zap,
  Sun,
  ChevronRight,
  Edit3,
  BookMarked,
  Flame,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ReaderContext } from "../context/ReaderContext";

// ─── Color Palette (from the design mockup) ───────────────────────────────────
const PALETTE = {
  bg: "#f5ede0",
  surface: "#fdf6ec",
  surfaceAlt: "#f0e6d3",
  border: "#d9c8b0",
  text: "#3d2b1f",
  subtext: "#8c7260",
  accent: "#5a7a3a",       // dark olive green
  accentLight: "#7a9a52",
  accentMuted: "#c8d4b0",
  brown: "#7a4f2e",
  brownLight: "#c49a6c",
  red: "#b84a3a",
  redLight: "#d4796a",
  cream: "#e8dcc8",
  chartGreen: "#4a6e2a",
  chartBrown: "#8b4a3a",
};

// ─── Mock historical data ─────────────────────────────────────────────────────
const MOCK_SESSIONS = [
  { date: "2025-01-10", score: 4, total: 5, title: "Cognitive Load Theory" },
  { date: "2025-01-14", score: 3, total: 5, title: "Working Memory Models" },
  { date: "2025-01-19", score: 5, total: 5, title: "Dual Coding Theory" },
  { date: "2025-01-25", score: 2, total: 5, title: "Situated Learning" },
  { date: "2025-02-03", score: 4, total: 5, title: "Spaced Repetition" },
  { date: "2025-02-11", score: 5, total: 5, title: "Metacognition Research" },
  { date: "2025-02-20", score: 3, total: 5, title: "Schema Theory" },
];

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Background SVG (bookshelf + plants, matching uploaded image) ─────────────
function LibraryBackground() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      {/* 1. Base Gradient */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        background: "radial-gradient(ellipse at 50% 0%, #ede0cc 0%, #f5ede0 50%, #ead5b8 100%)" 
      }} />

      {/* 2. RESPONSIVE BACKGROUND IMAGE */}
      <img 
        src="/images/bg.png" 
        alt="Library Background"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: "100%",
          height: "100%",      /* Changed from auto to 100% */
          opacity: 0.35,
          objectFit: "cover",   /* This ensures it scales like a background-size: cover */
          objectPosition: "bottom center", /* Keeps the bookshelves at the bottom */
          filter: "blur(0.5px)" 
        }}
      />

      {/* 3. Grain Overlay */}
      <div style={{ 
        position: "absolute", 
        inset: 0, 
        backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E\")", 
        opacity: 0.4 
      }} />
    </div>
  );
}

// ─── Mascot SVG (bookO character - olive green round critter with glasses) ────
function MascotImage({ size = 100, className = "" }) {
  return (
    <img 
      /* FIX: Remove 'public' and use a forward slash '/' */
      src="/char4.png" 
      alt="Mascot"
      className={className}
      style={{
        width: size,
        height: 'auto',
        display: 'block',
        objectFit: 'contain',
        /* Optional: Add a smooth fade-in so it doesn't 'pop' in */
        transition: 'opacity 0.3s ease'
      }}
    />
  );
}

// ─── Badge chip ───────────────────────────────────────────────────────────────
function Badge({ icon, label }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        padding: "4px 10px",
        borderRadius: "20px",
        background: PALETTE.surfaceAlt,
        border: `1px solid ${PALETTE.border}`,
        fontSize: "11px",
        fontWeight: "600",
        color: PALETTE.brown,
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      <span style={{ fontSize: "13px" }}>{icon}</span>
      {label}
    </span>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub }) {
  return (
    <div
      style={{
        padding: "24px",
        borderRadius: "24px",
        /* CHANGE THIS LINE TO USE PALETTE */
        background: PALETTE.surface, 
        border: `1.5px solid #D9C8B0`, 
        boxShadow: "0 8px 20px -5px rgba(61, 43, 31, 0.05)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 6px 20px rgba(90,60,30,0.12)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 12px rgba(90,60,30,0.06)";
      }}
    >
        {/* Icon Container - Should also match PALETTE.surfaceAlt */}
      <div style={{
        width: "40px",
        height: "40px",
        borderRadius: "10px",
        background: PALETTE.surfaceAlt, 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: PALETTE.brown,
        border: `1px solid ${PALETTE.border}`
      }}>
        {React.cloneElement(icon, { size: 20 })}
      </div>

      <div>
        {/* The Big Number (Value) */}
        <p style={{ 
          fontSize: "36px", 
          fontWeight: "700", 
          color: "#3D2B1F", // Deep chocolate brown
          fontFamily: "'Fredoka', sans-serif", // The bubbly font
          lineHeight: "1"
        }}>
          {value}
        </p>
        

        {/* The Label */}
        <p style={{ 
          fontSize: "13px", 
          fontWeight: "600", 
          color: "#8C7260", // Muted subtext color
          marginTop: "6px",
          fontFamily: "'Fredoka', sans-serif" 
        }}>
          {label}
        </p>

        {/* The Sub-text (e.g. "26/35 correct") */}
        {sub && (
          <p style={{ 
            fontSize: "11px", 
            color: "#A69080", 
            fontFamily: "'Lexend', sans-serif",
            marginTop: "2px"
          }}>
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Custom pie tooltip ───────────────────────────────────────────────────────
function CustomPieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div
      style={{
        background: PALETTE.surface,
        border: `1px solid ${PALETTE.border}`,
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(90,60,30,0.12)",
        fontSize: "12px",
        color: PALETTE.text,
        fontFamily: "'Lora', Georgia, serif",
      }}
    >
      <strong>{name}</strong>
      <br />
      {value} points {p.percent !== undefined ? `(${(p.percent * 100).toFixed(0)}%)` : ""}
    </div>
  );
}

// ─── Session history row ──────────────────────────────────────────────────────
function SessionRow({ session }) {
  const pct = Math.round((session.score / session.total) * 100);
  const color =
    pct >= 80 ? PALETTE.accent : pct >= 60 ? PALETTE.brown : pct >= 40 ? "#c97c3a" : PALETTE.red;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "16px",
        borderRadius: "20px", // Increased for a softer look
        border: `1.5px solid #D9C8B0`, // Matches your main card borders
        background: PALETTE.surface,
        boxShadow: "0 4px 12px rgba(90,60,30,0.04)",
        transition: "transform 0.15s ease",
        marginBottom: "8px"
      }}
      onMouseEnter={(e) => (e.currentTarget.style.transform = "translateX(3px)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "translateX(0)")}
    >
      {/* Score Circle */}
      <div
        style={{
          width: 50,
          height: 50,
          borderRadius: "50%",
          background: `${color}12`, // 12 is for a very light tint
          border: `2px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ 
          fontSize: "13px", 
          fontWeight: "700", 
          color, 
          fontFamily: "'Fredoka', sans-serif" // SWAP TO FREDOKA
        }}>
          {pct}%
        </span>
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Session Title */}
        <p style={{
          fontSize: "15px",
          fontWeight: "700",
          color: PALETTE.text,
          fontFamily: "'Fredoka', sans-serif", // SWAP TO FREDOKA
          margin: 0
        }}>
          {session.title}
        </p>
        {/* Date */}
        <p style={{ 
          fontSize: "11px", 
          color: PALETTE.subtext, 
          marginTop: "2px", 
          fontFamily: "'Lexend', sans-serif" // LEXEND FOR DATES
        }}>
          {formatDate(session.date)}
        </p>
      </div>

      {/* Fraction Score (3/5, 5/5, etc) */}
      <span style={{
        fontSize: "18px",
        fontWeight: "700",
        color,
        minWidth: 40,
        textAlign: "right",
        fontFamily: "'Fredoka', sans-serif", // SWAP TO FREDOKA
      }}>
        {session.score}/{session.total}
      </span>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { styles, fontFamily } = useTheme();
  const { sessionResults } = useContext(ReaderContext);
  const [showAllSessions, setShowAllSessions] = useState(false);

  const allSessions = useMemo(() => {
    const live = (sessionResults || []).map((s) => ({ ...s }));
    return [...MOCK_SESSIONS, ...live].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [sessionResults]);

  const totalScore = allSessions.reduce((s, r) => s + r.score, 0);
  const totalPossible = allSessions.reduce((s, r) => s + r.total, 0);
  const avgPct =
    allSessions.length > 0 ? Math.round((totalScore / totalPossible) * 100) : 0;
  const perfectSessions = allSessions.filter((s) => s.score === s.total).length;

  const pieData = [
    { name: "Correct", value: totalScore, color: PALETTE.chartGreen },
    { name: "Incorrect", value: totalPossible - totalScore, color: PALETTE.chartBrown },
  ];

  const radialData = allSessions.slice(0, 6).map((s, i) => ({
    name: s.title.split(" ").slice(0, 2).join(" "),
    score: Math.round((s.score / s.total) * 100),
    fill: i % 2 === 0 ? PALETTE.chartGreen : PALETTE.chartBrown,
  }));

  const visibleSessions = showAllSessions ? allSessions : allSessions.slice(0, 5);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fredoka:wght@300;400;500;600;700&display=swap');

        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .profile-fade { animation: fadeUp 0.5s ease both; }
        /* (keep your fade-delay classes) */
      `}</style>

      {/* Background Layer */}
      <LibraryBackground />

      {/* Main Content */}
      <div style={{
        minHeight: "100vh",
        fontFamily: "Sans-Serif", /* For Genty Sans */
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        position: "relative",
        zIndex: 1, 
        paddingTop: "0px" /* Spacing for the Nav */
      }}>

        <div style={{ 
          width: "100%", 
          maxWidth: "1300px", 
          padding: "20px 24px 100px",
        }}>
          
          {/* Header */}
          <div className="profile-fade profile-fade-1" style={{ marginBottom: "24px" }}>
            <p style={{ fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", color: PALETTE.subtext, fontWeight: "600", fontFamily: "'Fredoka', sans-serif" }}>
              YOUR SPACE
            </p>
            <h1 style={{ fontSize: "38px", fontWeight: "700", color: "#4A3728", fontFamily: "'Fredoka', sans-serif", margin: 0 }}>
              Reading Profile
            </h1>
          </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: "20px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>

            {/* ── Profile card ── */}
            <div
              className="profile-fade profile-fade-1"
              style={{
                background: PALETTE.surface,
                border: `1.5px solid ${PALETTE.border}`, /* Increased slightly for visibility */
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 8px 20px rgba(90,60,30,0.06)", /* Softer brown shadow */
                display: "flex",
                gap: "20px",
                alignItems: "flex-start",
                position: "relative",
              }}
            >
              {/* Avatar circle */}
<div
  style={{
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: PALETTE.surfaceAlt,
    border: `2.5px solid ${PALETTE.border}`,
    overflow: "hidden", 
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative", // CRITICAL: Makes the circle a "window"
  }}
>
  <div style={{
    position: "absolute", // Detaches it from the normal flow
    top: "-1px",         // Pulls the head UP into the circle
    left: "50%",
    transform: "translateX(-50%) scale(1.8)", // Zooms in 1.8x and stays centered
    width: "100%",        // Makes the image container wide
    height: "100%",
    display: "flex",
    justifyContent: "center"
  }}>
    <MascotImage charNumber={2} size={200} />
  </div>
</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap", marginBottom: "8px" }}>
                  <h2 style={{ 
                    fontSize: "24px", 
                    fontWeight: "800", 
                    color: "#4A3728", 
                    fontFamily: "'Fredoka', cursive" 
                  }}>
                    Neil Ivan Cajipe
                  </h2>
                  <span style={{ fontSize: "12px", color: PALETTE.subtext, fontStyle: "italic" }}>"Vanvan"</span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif", 
                      fontSize: "12px",
                      fontWeight: "600",
                      color: PALETTE.brown,
                      background: PALETTE.surfaceAlt,
                      border: `1px solid ${PALETTE.border}`,
                      borderRadius: "20px",
                      padding: "2px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <BookMarked size={11} /> Advanced Scholar
                  </span>
                  <span
                    style={{
                      fontFamily: "'Fredoka', sans-serif", 
                      fontWeight: "600",
                      fontSize: "12px",
                      color: PALETTE.red,
                      background: "#b84a3a12",
                      border: `1px solid ${PALETTE.redLight}60`,
                      borderRadius: "20px",
                      padding: "2px 10px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                    }}
                  >
                    <Flame size={11} /> 14-day streak
                  </span>
                </div>

                {/* Meta row */}
                <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {[
                    { icon: <Calendar size={12} />, text: "January 19, 2007" },
                    { icon: <MapPin size={12} />, text: "PH Philippines" },
                    { icon: <Users size={12} />, text: "Member since March 2026" },
                    { icon: <BookOpen size={12} />, text: `${allSessions.length} sessions` },
                  ].map((item, i) => (
                    <span key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: PALETTE.subtext }}>
                      {item.icon} {item.text}
                    </span>
                  ))}
                </div>

                {/* Bio */}
                <p
                  style={{
                    fontSize: "12px",
                    color: PALETTE.subtext,
                    fontStyle: "italic",
                    borderTop: `1px solid ${PALETTE.border}`,
                    paddingTop: "10px",
                    marginBottom: "10px",
                  }}
                >
                  "Passionate about graphic design and learning data science. Loves annotating dense academic texts."
                </p>

                {/* Badges */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  <span style={{ fontSize: "11px", color: PALETTE.subtext, fontWeight: "600", marginRight: "2px" }}>BADGES:</span>
                  <Badge icon="🌅" label="Early Bird" />
                  <Badge icon="🧠" label="Deep Thinker" />
                  <Badge icon="⚔️" label="Week Warrior" />
                </div>
              </div>

              {/* Edit button */}
              <button
                style={{
                  position: "absolute",
                  top: "20px",
                  right: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "7px 14px",
                  borderRadius: "10px",
                  border: `1.5px solid ${PALETTE.border}`,
                  background: PALETTE.surface,
                  color: PALETTE.text,
                  fontSize: "12px",
                  fontWeight: "600",
                  cursor: "pointer",
                  fontFamily: "'Lora', Georgia, serif",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = PALETTE.surfaceAlt)}
                onMouseLeave={(e) => (e.currentTarget.style.background = PALETTE.surface)}
              >
                <Edit3 size={13} /> Edit Profile
              </button>
            </div>

            {/* ── Stat cards ── */}
            <div
              className="profile-fade profile-fade-2"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "12px",
              }}
            >
              <StatCard icon={<BookOpen />} label="Sessions Completed" value={allSessions.length} />
              <StatCard
                icon={<Target />}
                label="Overall Accuracy"
                value={`${avgPct}%`}
                sub={`${totalScore} / ${totalPossible} correct`}
              />
              <StatCard
                icon={<TrendingUp />}
                label="Perfect Scores"
                value={perfectSessions}
                sub={perfectSessions === 1 ? "session" : "sessions"}
              />
              <StatCard icon={<Clock />} label="Questions Answered" value={totalPossible} />
            </div>

            {/* ── Charts row ── */}
            <div
              className="profile-fade profile-fade-3"
              style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
            >
              {/* Pie chart */}
              <div
                style={{
                  padding: "22px",
                  borderRadius: "16px",
                  border: `1px solid ${PALETTE.border}`,
                  background: PALETTE.surface,
                  boxShadow: "0 2px 12px rgba(90,60,30,0.06)",
                }}
              >
                <p style={{ 
                  fontFamily: "'Fredoka', sans-serif", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#4A3728" 
                }}>
                  Total Score Breakdown
                </p>
                <ResponsiveContainer width="100%" height={190}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={52}
                      outerRadius={78}
                      paddingAngle={4}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {pieData.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                    <Legend
                      iconType="circle"
                      iconSize={8}
                      formatter={(value) => (
                        <span style={{ 
                          fontFamily: "'Fredoka', sans-serif", 
                          fontWeight: "600",
                          fontSize: "13px",
                          color: PALETTE.text,
                          paddingLeft: "4px"
                        }}>
                          {value}
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <p style={{ 
                  textAlign: "center", 
                  marginTop: "12px",
                  fontFamily: "'Fredoka', sans-serif", // Key change here
                  color: PALETTE.subtext,
                  fontSize: "14px"
                }}>
                  <strong style={{ 
                    color: PALETTE.text, 
                    fontSize: "18px", 
                    fontWeight: "700" 
                  }}>
                    {avgPct}%
                  </strong> avg accuracy
                </p>
              </div>

              {/* Radial bar chart */}
              <div
                style={{
                  padding: "22px",
                  borderRadius: "16px",
                  border: `1px solid ${PALETTE.border}`,
                  background: PALETTE.surface,
                  boxShadow: "0 2px 12px rgba(90,60,30,0.06)",
                }}
              >
                <p style={{ 
                  fontFamily: "'Fredoka', sans-serif", 
                  fontSize: "14px", 
                  fontWeight: "600", 
                  color: "#4A3728" 
                }}>
                  Recent Session Scores
                </p>
                <ResponsiveContainer width="100%" height={190}>
                  <RadialBarChart
                    cx="50%"
                    cy="50%"
                    innerRadius={18}
                    outerRadius={82}
                    data={radialData}
                    startAngle={180}
                    endAngle={0}
                  >
                    <RadialBar
                      minAngle={5}
                      background={{ fill: PALETTE.cream }}
                      dataKey="score"
                      cornerRadius={5}
                    />
                    <Tooltip
                      formatter={(v) => [`${v}%`, "Score"]}
                      contentStyle={{
                        background: PALETTE.surface,
                        border: `1px solid ${PALETTE.border}`,
                        borderRadius: "8px",
                        fontSize: "12px",
                        color: PALETTE.text,
                        fontFamily: "'Lora', Georgia, serif",
                      }}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Session History ── */}
          <div className="profile-fade profile-fade-4" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <p style={{ fontSize: "13px", fontWeight: "700", color: PALETTE.text, letterSpacing: "-0.01em" }}>
                Session History
              </p>
              <button
                onClick={() => setShowAllSessions((v) => !v)}
                style={{
                  fontSize: "11px",
                  color: PALETTE.brown,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontFamily: "'Lora', Georgia, serif",
                  display: "flex",
                  alignItems: "center",
                  gap: "3px",
                }}
              >
                {showAllSessions ? "Show Less" : "View All"} <ChevronRight size={12} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {visibleSessions.map((s, i) => (
                <SessionRow key={i} session={s} />
              ))}
            </div>
          </div>
        </div>

        </div>

        {/* ── Bottom Responsive Mascot ── */}
<div style={{
  display: "inline-flex", 
  alignItems: "center", 
  gap: "4px",           /* REDUCED GAP: Pulls them almost touching */
  marginTop: "20px",    /* Pulls the whole unit up toward the charts */
  fontFamily: "'Fredoka', sans-serif"
}}>
  
  <MascotImage 
    charNumber={4} 
    size={250} 
    style={{ margin: 0 }} /* Removes any hidden spacing around the image */
    className="profile-fade profile-fade-5" 
  />
  
  <div style={{
    padding: "10px 16px",
    background: "#fdf6ec",
    border: "1px solid #d9c8b0",
    borderRadius: "20px 20px 20px 0",
    fontSize: "13px",
    color: "#8c7260",
    fontStyle: "italic",
    boxShadow: "0 4px 12px rgba(90,60,30,0.06)",
/* THE FIX: NEGATIVE MARGIN */
    marginLeft: "-80px",  // Pulls the bubble OVER the transparent edge of the image
    zIndex: 2,           // Ensures bubble stays on top    maxWidth: "180px",
    lineHeight: "1.3"
  }}>
    Keep up the great work, Neil!
  </div>
</div>
      </div>
    </>
  );
}