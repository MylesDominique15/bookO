import React, { useState, useEffect, useCallback, useRef } from "react";
import { BookMarked, X, Loader2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

// ─── Mock dictionary database ─────────────────────────────────────────────────
// Replace with a real API call (e.g. Free Dictionary API) in production.
const MOCK_DICTIONARY = {
  cognitive: {
    word: "cognitive",
    phonetic: "/ˈkɒɡnɪtɪv/",
    partOfSpeech: "adjective",
    definition:
      "Relating to or involving conscious mental activities such as thinking, understanding, learning, and remembering.",
    example: "The study focused on cognitive development in early childhood.",
  },
  schema: {
    word: "schema",
    phonetic: "/ˈskiːmə/",
    partOfSpeech: "noun",
    definition:
      "A representation of a plan or theory as an outline or model; an organized pattern of thought or behaviour.",
    example: "Children develop schemas to make sense of the world around them.",
  },
  intrinsic: {
    word: "intrinsic",
    phonetic: "/ɪnˈtrɪnsɪk/",
    partOfSpeech: "adjective",
    definition:
      "Belonging naturally; essential; originating from within a thing rather than from external factors.",
    example: "She had an intrinsic motivation to learn new skills.",
  },
  extraneous: {
    word: "extraneous",
    phonetic: "/ɪkˈstreɪniəs/",
    partOfSpeech: "adjective",
    definition:
      "Irrelevant or unrelated to the subject being dealt with; not forming an essential part of something.",
    example: "Remove all extraneous information from your summary.",
  },
  germane: {
    word: "germane",
    phonetic: "/dʒɜːˈmeɪn/",
    partOfSpeech: "adjective",
    definition: "Relevant to a subject under consideration.",
    example: "The judge ruled that the evidence was germane to the case.",
  },
  scaffolding: {
    word: "scaffolding",
    phonetic: "/ˈskæfəldɪŋ/",
    partOfSpeech: "noun",
    definition:
      "In education, temporary support provided to students to help them achieve a task they could not accomplish independently.",
    example:
      "The teacher used scaffolding techniques to introduce complex algebraic concepts.",
  },
  redundancy: {
    word: "redundancy",
    phonetic: "/rɪˈdʌndənsi/",
    partOfSpeech: "noun",
    definition:
      "The state of being not or no longer needed; superfluous repetition of information.",
    example:
      "The redundancy effect shows that presenting information in multiple formats can hurt learning.",
  },
  empirically: {
    word: "empirically",
    phonetic: "/ɪmˈpɪrɪkli/",
    partOfSpeech: "adverb",
    definition:
      "In a way based on observation and experience rather than theory or pure logic.",
    example: "The hypothesis was empirically tested across five studies.",
  },
};

const FALLBACK_DEFINITION = (word) => ({
  word,
  phonetic: null,
  partOfSpeech: "—",
  definition: `No definition found for "${word}". In a production build, this would query the Free Dictionary API.`,
  example: null,
});

// Simulate an async lookup with a small delay
async function lookupWord(word) {
  await new Promise((r) => setTimeout(r, 280));
  const clean = word.toLowerCase().replace(/[^a-z]/g, "");
  return MOCK_DICTIONARY[clean] || FALLBACK_DEFINITION(clean);
}

// ─── Tooltip UI ───────────────────────────────────────────────────────────────
function TooltipCard({ entry, position, onClose, styles }) {
  const ref = useRef(null);

  // Keep tooltip inside viewport horizontally
  const safeX = Math.min(
    Math.max(position.x - 140, 8),
    window.innerWidth - 296
  );

  return (
    <div
      ref={ref}
      role="tooltip"
      aria-live="polite"
      style={{
        position: "fixed",
        left: safeX,
        top: position.y + 10,
        width: "280px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "14px",
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        zIndex: 9999,
        overflow: "hidden",
        animation: "tooltipIn 0.18s ease forwards",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "8px",
          padding: "12px 14px 10px",
          borderBottom: "1px solid var(--color-border)",
          background: `${styles.accent}0e`,
        }}
      >
        <BookMarked size={14} color={styles.accent} />
        <div style={{ flex: 1 }}>
          <span
            style={{
              fontSize: "15px",
              fontWeight: "700",
              color: "var(--color-text)",
              letterSpacing: "-0.01em",
            }}
          >
            {entry.word}
          </span>
          {entry.phonetic && (
            <span
              style={{
                fontSize: "11px",
                color: "var(--color-subtext)",
                marginLeft: "8px",
              }}
            >
              {entry.phonetic}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          aria-label="Close definition"
          style={{
            border: "none",
            background: "transparent",
            cursor: "pointer",
            color: "var(--color-subtext)",
            padding: "2px",
            borderRadius: "4px",
            display: "flex",
            alignItems: "center",
          }}
        >
          <X size={13} />
        </button>
      </div>

      {/* Body */}
      <div style={{ padding: "12px 14px", display: "flex", flexDirection: "column", gap: "8px" }}>
        <div>
          <span
            style={{
              fontSize: "10px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: styles.accent,
              fontWeight: "700",
            }}
          >
            {entry.partOfSpeech}
          </span>
        </div>
        <p
          style={{
            fontSize: "13px",
            color: "var(--color-text)",
            lineHeight: "1.6",
          }}
        >
          {entry.definition}
        </p>
        {entry.example && (
          <p
            style={{
              fontSize: "12px",
              color: "var(--color-subtext)",
              lineHeight: "1.5",
              fontStyle: "italic",
              borderLeft: `2px solid ${styles.accent}44`,
              paddingLeft: "10px",
            }}
          >
            "{entry.example}"
          </p>
        )}
      </div>
    </div>
  );
}

// ─── Loading tooltip ──────────────────────────────────────────────────────────
function LoadingTooltip({ position, word }) {
  const safeX = Math.min(Math.max(position.x - 140, 8), window.innerWidth - 296);

  return (
    <div
      style={{
        position: "fixed",
        left: safeX,
        top: position.y + 10,
        padding: "12px 16px",
        background: "var(--color-surface)",
        border: "1px solid var(--color-border)",
        borderRadius: "12px",
        boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "10px",
        animation: "tooltipIn 0.18s ease forwards",
      }}
    >
      <Loader2
        size={14}
        color="var(--color-accent)"
        style={{ animation: "spin 0.8s linear infinite" }}
      />
      <span style={{ fontSize: "13px", color: "var(--color-subtext)" }}>
        Looking up "{word}"…
      </span>
    </div>
  );
}

// ─── Main hook + wrapper ──────────────────────────────────────────────────────
export default function DictionaryTooltip({ children }) {
  const { styles } = useTheme();
  const [tooltip, setTooltip] = useState(null); // { word, position }
  const [definition, setDefinition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const lookupRef = useRef(null);

  const handleMouseUp = useCallback(async () => {
    const selection = window.getSelection();
    const selectedText = selection?.toString()?.trim();

    // Only trigger on single clean words (no spaces, reasonable length)
    if (
      !selectedText ||
      selectedText.includes(" ") ||
      selectedText.length < 2 ||
      selectedText.length > 40 ||
      !/^[a-zA-Z]+$/.test(selectedText)
    ) {
      return;
    }

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const position = {
      x: rect.left + rect.width / 2,
      y: rect.bottom,
    };

    // Cancel in-flight lookup
    if (lookupRef.current) lookupRef.current = null;

    setTooltip({ word: selectedText, position });
    setDefinition(null);
    setIsLoading(true);

    const currentLookup = {};
    lookupRef.current = currentLookup;

    try {
      const entry = await lookupWord(selectedText);
      if (lookupRef.current === currentLookup) {
        setDefinition(entry);
      }
    } catch {
      if (lookupRef.current === currentLookup) {
        setDefinition(FALLBACK_DEFINITION(selectedText));
      }
    } finally {
      if (lookupRef.current === currentLookup) {
        setIsLoading(false);
      }
    }
  }, []);

  const handleClose = useCallback(() => {
    setTooltip(null);
    setDefinition(null);
    setIsLoading(false);
    lookupRef.current = null;
    window.getSelection()?.removeAllRanges();
  }, []);

  // Close on outside click or Escape
  useEffect(() => {
    if (!tooltip) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") handleClose();
    };

    const handleMouseDown = (e) => {
      if (!e.target.closest("[data-tooltip-root]")) handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, [tooltip, handleClose]);

  return (
    <>
      <style>{`
        @keyframes tooltipIn {
          from { opacity: 0; transform: translateY(6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>

      <div onMouseUp={handleMouseUp} style={{ display: "contents" }}>
        {children}
      </div>

      {/* Tooltip portal */}
      {tooltip && isLoading && (
        <div data-tooltip-root>
          <LoadingTooltip position={tooltip.position} word={tooltip.word} />
        </div>
      )}
      {tooltip && !isLoading && definition && (
        <div data-tooltip-root>
          <TooltipCard
            entry={definition}
            position={tooltip.position}
            onClose={handleClose}
            styles={styles}
          />
        </div>
      )}
    </>
  );
}