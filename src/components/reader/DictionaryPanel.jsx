import React, { useState, useCallback } from "react";
import { Book, Search, X, Loader2, AlertCircle } from "lucide-react";

const API_BASE = "https://api.dictionaryapi.dev/api/v2/entries/en/";

function getPhonetic(entry) {
  if (entry.phonetic) return entry.phonetic;
  const withText = entry.phonetics?.find((p) => p.text);
  return withText?.text || null;
}

function getFirstDefinitions(entry, limit = 2) {
  const out = [];
  for (const m of entry.meanings || []) {
    for (const d of m.definitions || []) {
      out.push({ partOfSpeech: m.partOfSpeech, definition: d.definition });
      if (out.length >= limit) return out;
    }
  }
  return out;
}

export default function DictionaryPanel({ onClose }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState(null);

  const runSearch = useCallback(async () => {
    const word = query.trim();
    if (!word) return;

    setStatus("loading");
    setErrorMessage("");
    setResult(null);

    try {
      const res = await fetch(
        `${API_BASE}${encodeURIComponent(word.toLowerCase())}`
      );

      if (res.status === 404) {
        setStatus("error");
        setErrorMessage("No dictionary entry found for that word.");
        return;
      }

      if (!res.ok) {
        setStatus("error");
        setErrorMessage("The dictionary service returned an error. Try again.");
        return;
      }

      const data = await res.json();
      const entry = data?.[0];
      if (!entry) {
        setStatus("error");
        setErrorMessage("No dictionary entry found for that word.");
        return;
      }

      const phonetic = getPhonetic(entry);
      const definitions = getFirstDefinitions(entry, 2);

      setResult({
        word: entry.word || word,
        phonetic,
        definitions,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Check your connection and try again.");
    }
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch();
  };

  return (
    <>
      <style>{`
        @keyframes dictSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <aside
        role="complementary"
        aria-label="Dictionary"
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "min(360px, 100%)",
          zIndex: 40,
          display: "flex",
          flexDirection: "column",
          background: "var(--color-surface)",
          borderLeft: "1px solid var(--color-border)",
          boxShadow: "-8px 0 32px rgba(15, 23, 42, 0.08)",
          fontFamily: "var(--font-family, inherit)",
        }}
      >
        <header
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "16px 14px 14px",
            borderBottom: "1px solid var(--color-border)",
            background: "var(--color-bg)",
            flexShrink: 0,
          }}
        >
          <Book size={20} color="var(--color-accent)" aria-hidden />
          <h2
            style={{
              margin: 0,
              fontSize: "15px",
              fontWeight: 700,
              color: "var(--color-text)",
              flex: 1,
            }}
          >
            Dictionary
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dictionary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: "10px",
              border: "1px solid var(--color-border)",
              background: "var(--color-surface)",
              color: "var(--color-text)",
              cursor: "pointer",
            }}
          >
            <X size={18} />
          </button>
        </header>

        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            gap: "8px",
            padding: "14px",
            borderBottom: "1px solid var(--color-border)",
            flexShrink: 0,
          }}
        >
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Look up a word…"
            aria-label="Word to look up"
            style={{
              flex: 1,
              minWidth: 0,
              padding: "10px 12px",
              borderRadius: "10px",
              border: "1px solid var(--color-border)",
              background: "var(--color-bg)",
              color: "var(--color-text)",
              fontSize: "14px",
            }}
          />
          <button
            type="submit"
            disabled={status === "loading" || !query.trim()}
            aria-label="Search dictionary"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 44,
              height: 44,
              borderRadius: "10px",
              border: "none",
              background:
                status === "loading" || !query.trim()
                  ? "var(--color-border)"
                  : "var(--color-accent)",
              color: "#fff",
              cursor:
                status === "loading" || !query.trim()
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            <Search size={18} />
          </button>
        </form>

        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 14px 24px",
          }}
        >
          {status === "loading" && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "12px",
                padding: "32px 12px",
                color: "var(--color-subtext)",
              }}
            >
              <Loader2
                size={28}
                color="var(--color-accent)"
                style={{ animation: "dictSpin 0.85s linear infinite" }}
                aria-hidden
              />
              <p style={{ margin: 0, fontSize: "13px" }}>Looking up…</p>
            </div>
          )}

          {status === "error" && (
            <div
              role="alert"
              style={{
                display: "flex",
                gap: "10px",
                padding: "14px",
                borderRadius: "12px",
                background: "#ef444414",
                border: "1px solid #ef444440",
              }}
            >
              <AlertCircle
                size={18}
                color="#dc2626"
                style={{ flexShrink: 0, marginTop: 2 }}
              />
              <p
                style={{
                  margin: 0,
                  fontSize: "13px",
                  lineHeight: 1.5,
                  color: "var(--color-text)",
                }}
              >
                {errorMessage}
              </p>
            </div>
          )}

          {status === "success" && result && (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <h3
                  style={{
                    margin: "0 0 6px",
                    fontSize: "22px",
                    fontWeight: 800,
                    color: "var(--color-text)",
                    letterSpacing: "-0.02em",
                  }}
                >
                  {result.word}
                </h3>
                {result.phonetic && (
                  <p
                    style={{
                      margin: 0,
                      fontSize: "14px",
                      color: "var(--color-accent)",
                      fontWeight: 600,
                    }}
                  >
                    {result.phonetic}
                  </p>
                )}
              </div>

              {result.definitions.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {result.definitions.map((item, idx) => (
                    <div
                      key={`${item.partOfSpeech}-${idx}`}
                      style={{
                        padding: "12px 14px",
                        borderRadius: "12px",
                        border: "1px solid var(--color-border)",
                        background: "var(--color-bg)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          fontSize: "10px",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                          color: "var(--color-accent)",
                          marginBottom: "6px",
                        }}
                      >
                        {item.partOfSpeech}
                      </span>
                      <p
                        style={{
                          margin: 0,
                          fontSize: "14px",
                          lineHeight: 1.55,
                          color: "var(--color-text)",
                          fontWeight: idx === 0 ? 500 : 400,
                        }}
                      >
                        <span style={{ color: "var(--color-subtext)", marginRight: 6 }}>
                          {idx + 1}.
                        </span>
                        {item.definition}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {status === "idle" && (
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                lineHeight: 1.55,
                color: "var(--color-subtext)",
                paddingTop: 8,
              }}
            >
              Enter a word and tap search to see meaning, pronunciation, and
              definitions from the Free Dictionary API.
            </p>
          )}
        </div>
      </aside>
    </>
  );
}
