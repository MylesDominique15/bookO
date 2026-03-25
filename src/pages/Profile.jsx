import React, { useContext, useMemo } from "react";
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
import { BookOpen, Target, TrendingUp, Clock } from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ReaderContext } from "../context/ReaderContext";

// ─── Mock historical data (merged with real session results from context) ─────
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

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon, label, value, sub, accent }) {
  return (
    <div
      style={{
        padding: "18px 20px",
        borderRadius: "14px",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "10px",
          background: `${accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {React.cloneElement(icon, { size: 16, color: accent })}
      </div>
      <div>
        <p
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "var(--color-text)",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}
        >
          {value}
        </p>
        <p style={{ fontSize: "12px", color: "var(--color-subtext)", marginTop: "3px" }}>
          {label}
        </p>
        {sub && (
          <p style={{ fontSize: "11px", color: accent, marginTop: "2px", fontWeight: "600" }}>
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
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "10px",
        padding: "10px 14px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        fontSize: "13px",
        color: "var(--color-text)",
      }}
    >
      <strong>{name}</strong>
      <br />
      {value} points ({p.percent !== undefined ? `${(p.percent * 100).toFixed(0)}%` : ""})
    </div>
  );
}

// ─── History table row ────────────────────────────────────────────────────────
function SessionRow({ session, accent }) {
  const pct = Math.round((session.score / session.total) * 100);
  const color =
    pct >= 80 ? "#22c55e" : pct >= 60 ? accent : pct >= 40 ? "#f59e0b" : "#ef4444";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "14px",
        padding: "12px 16px",
        borderRadius: "10px",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          background: `${color}18`,
          border: `1.5px solid ${color}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <span style={{ fontSize: "12px", fontWeight: "800", color }}>{pct}%</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            fontSize: "13px",
            fontWeight: "600",
            color: "var(--color-text)",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {session.title}
        </p>
        <p style={{ fontSize: "11px", color: "var(--color-subtext)" }}>
          {formatDate(session.date)}
        </p>
      </div>
      <span
        style={{
          fontSize: "13px",
          fontWeight: "700",
          color,
          minWidth: 40,
          textAlign: "right",
        }}
      >
        {session.score}/{session.total}
      </span>
    </div>
  );
}

// ─── Profile page ─────────────────────────────────────────────────────────────
export default function Profile() {
  const { styles, fontFamily } = useTheme();
  const { sessionResults } = useContext(ReaderContext);

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

  // Pie chart: total correct vs total incorrect
  const pieData = [
    { name: "Correct", value: totalScore, color: "#22c55e" },
    { name: "Incorrect", value: totalPossible - totalScore, color: "#ef4444" },
  ];

  // Radial chart: per-session scores
  const radialData = allSessions.slice(0, 6).map((s, i) => ({
    name: s.title.split(" ").slice(0, 2).join(" "),
    score: Math.round((s.score / s.total) * 100),
    fill: i % 2 === 0 ? styles.accent : `${styles.accent}99`,
  }));

  return (
    <>
      <style>{`
        @keyframes profileIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          fontFamily,
          padding: "48px 24px 80px",
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          {/* Header */}
          <header
            style={{
              marginBottom: "36px",
              animation: "profileIn 0.5s ease",
            }}
          >
            <p
              style={{
                fontSize: "11px",
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "var(--color-subtext)",
                fontWeight: "600",
                marginBottom: "6px",
              }}
            >
              Your Reading Profile
            </p>
            <h1
              style={{
                fontSize: "26px",
                fontWeight: "800",
                color: "var(--color-text)",
                letterSpacing: "-0.02em",
              }}
            >
              Performance Overview
            </h1>
          </header>

          {/* Stat cards */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: "12px",
              marginBottom: "32px",
              animation: "profileIn 0.55s ease",
            }}
          >
            <StatCard
              icon={<BookOpen />}
              label="Sessions completed"
              value={allSessions.length}
              accent={styles.accent}
            />
            <StatCard
              icon={<Target />}
              label="Overall accuracy"
              value={`${avgPct}%`}
              sub={`${totalScore} / ${totalPossible} correct`}
              accent={styles.accent}
            />
            <StatCard
              icon={<TrendingUp />}
              label="Perfect scores"
              value={perfectSessions}
              sub={perfectSessions === 1 ? "session" : "sessions"}
              accent="#22c55e"
            />
            <StatCard
              icon={<Clock />}
              label="Questions answered"
              value={totalPossible}
              accent={styles.accent}
            />
          </div>

          {/* Charts row */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "16px",
              marginBottom: "32px",
              animation: "profileIn 0.6s ease",
            }}
          >
            {/* Pie chart */}
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--color-text)",
                  marginBottom: "20px",
                  letterSpacing: "-0.01em",
                }}
              >
                Total Score Breakdown
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={52}
                    outerRadius={80}
                    paddingAngle={3}
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
                      <span
                        style={{
                          fontSize: "12px",
                          color: "var(--color-text)",
                        }}
                      >
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Centre label */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: "13px",
                  color: "var(--color-subtext)",
                  marginTop: "8px",
                }}
              >
                <strong style={{ color: "var(--color-text)" }}>{avgPct}%</strong> avg accuracy
              </p>
            </div>

            {/* Radial bar chart */}
            <div
              style={{
                padding: "24px",
                borderRadius: "16px",
                border: "1px solid var(--color-border)",
                background: "var(--color-surface)",
              }}
            >
              <p
                style={{
                  fontSize: "13px",
                  fontWeight: "700",
                  color: "var(--color-text)",
                  marginBottom: "20px",
                  letterSpacing: "-0.01em",
                }}
              >
                Recent Session Scores
              </p>
              <ResponsiveContainer width="100%" height={200}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={85}
                  data={radialData}
                  startAngle={180}
                  endAngle={0}
                >
                  <RadialBar
                    minAngle={5}
                    background={{ fill: "var(--color-border)" }}
                    dataKey="score"
                    cornerRadius={4}
                  />
                  <Tooltip
                    formatter={(v) => [`${v}%`, "Score"]}
                    contentStyle={{
                      background: "var(--color-surface)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "8px",
                      fontSize: "12px",
                      color: "var(--color-text)",
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Session history */}
          <div style={{ animation: "profileIn 0.65s ease" }}>
            <p
              style={{
                fontSize: "13px",
                fontWeight: "700",
                color: "var(--color-text)",
                marginBottom: "14px",
                letterSpacing: "-0.01em",
              }}
            >
              Session History
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {allSessions.map((s, i) => (
                <SessionRow key={i} session={s} accent={styles.accent} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}