import React, { useState, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  UploadCloud,
  FileText,
  ArrowRight,
  Sparkles,
  BookOpen,
  X,
  AlertCircle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { ReaderContext } from "../context/ReaderContext";

// ─── pdfjs-dist setup ─────────────────────────────────────────────────────────
// Ensure the worker is configured in your app entry (index.js):
//   import * as pdfjsLib from "pdfjs-dist";
//   pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;
import * as pdfjsLib from "pdfjs-dist";

async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    fullText += pageText + "\n";
  }

  return fullText.trim();
}

// ─── Sprite placeholder ───────────────────────────────────────────────────────
function HeroSprite({ styles }) {
  return (
    <div
      style={{
        width: "110px",
        height: "110px",
        borderRadius: "50%",
        border: `2.5px solid ${styles.accent}`,
        background: `radial-gradient(circle at 38% 38%, ${styles.accent}44, ${styles.accent}0a)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        boxShadow: `0 0 0 8px ${styles.accent}14, 0 12px 40px ${styles.accent}22`,
        animation: "spritePulse 3s ease-in-out infinite",
        flexShrink: 0,
      }}
      title="Sprite mascot (placeholder)"
    >
      <Sparkles size={28} color={styles.accent} />
      <span
        style={{
          fontSize: "9px",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
          fontWeight: "800",
          color: styles.accent,
        }}
      >
        Sprite
      </span>
    </div>
  );
}

// ─── Upload zone ──────────────────────────────────────────────────────────────
function DropZone({ onFile, isDragging, setIsDragging }) {
  const { styles } = useTheme();
  const fileInputRef = useRef(null);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file && file.type === "application/pdf") onFile(file);
    },
    [onFile, setIsDragging]
  );

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleInputChange = (e) => {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  };

  return (
    <div
      onClick={() => fileInputRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      role="button"
      tabIndex={0}
      aria-label="Drop a PDF here or click to upload"
      onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
      style={{
        border: `2px dashed ${isDragging ? styles.accent : "var(--color-border)"}`,
        borderRadius: "16px",
        padding: "48px 32px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        background: isDragging ? `${styles.accent}0c` : "var(--color-surface)",
        transition: "all 0.25s ease",
        outline: "none",
      }}
    >
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: isDragging ? `${styles.accent}22` : "var(--color-bg)",
          border: `1.5px solid ${isDragging ? styles.accent : "var(--color-border)"}`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.25s ease",
        }}
      >
        <UploadCloud
          size={22}
          color={isDragging ? styles.accent : "var(--color-subtext)"}
        />
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            fontSize: "15px",
            fontWeight: "600",
            color: "var(--color-text)",
            marginBottom: "5px",
          }}
        >
          {isDragging ? "Release to upload" : "Drop your PDF here"}
        </p>
        <p style={{ fontSize: "13px", color: "var(--color-subtext)" }}>
          or{" "}
          <span style={{ color: styles.accent, fontWeight: "600" }}>
            click to browse
          </span>{" "}
          — PDF files only
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/pdf"
        onChange={handleInputChange}
        style={{ display: "none" }}
        aria-hidden="true"
      />
    </div>
  );
}

// ─── File preview card ────────────────────────────────────────────────────────
function FileCard({ file, onRemove, styles }) {
  const sizeKB = (file.size / 1024).toFixed(1);
  const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
  const displaySize = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 16px",
        borderRadius: "12px",
        border: "1px solid var(--color-border)",
        background: "var(--color-surface)",
        animation: "fadeSlideUp 0.3s ease forwards",
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: "10px",
          background: `${styles.accent}18`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <FileText size={18} color={styles.accent} />
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
          {file.name}
        </p>
        <p style={{ fontSize: "11px", color: "var(--color-subtext)" }}>
          {displaySize}
        </p>
      </div>
      <button
        onClick={onRemove}
        aria-label="Remove file"
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "var(--color-subtext)",
          padding: "4px",
          borderRadius: "6px",
          display: "flex",
          alignItems: "center",
        }}
      >
        <X size={15} />
      </button>
    </div>
  );
}

// ─── Extraction progress ──────────────────────────────────────────────────────
function ExtractionStatus({ status, wordCount, styles }) {
  const states = {
    extracting: {
      color: styles.accent,
      label: "Extracting text from PDF…",
      pulse: true,
    },
    done: {
      color: "#22c55e",
      label: `Ready — ${wordCount.toLocaleString()} words extracted`,
      pulse: false,
    },
    error: { color: "#ef4444", label: "Extraction failed. Try another PDF.", pulse: false },
  };
  const cfg = states[status];
  if (!cfg) return null;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px 14px",
        borderRadius: "10px",
        background: `${cfg.color}12`,
        border: `1px solid ${cfg.color}33`,
      }}
    >
      {status === "error" ? (
        <AlertCircle size={15} color={cfg.color} />
      ) : (
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: cfg.color,
            animation: cfg.pulse ? "statusPulse 1.2s ease-in-out infinite" : "none",
            flexShrink: 0,
          }}
        />
      )}
      <p style={{ fontSize: "13px", color: cfg.color, fontWeight: "500" }}>
        {cfg.label}
      </p>
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home() {
  const navigate = useNavigate();
  const { styles, fontFamily } = useTheme();
  const { setExtractedText, setDocumentTitle } = useContext(ReaderContext);

  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState(null);
  const [extractedText, setLocalExtractedText] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleFile = useCallback(async (selectedFile) => {
    setFile(selectedFile);
    setExtractionStatus("extracting");
    setLocalExtractedText("");
    setWordCount(0);

    try {
      const text = await extractTextFromPDF(selectedFile);
      const wc = text.split(/\s+/).filter(Boolean).length;
      setLocalExtractedText(text);
      setWordCount(wc);
      setExtractionStatus("done");
    } catch (err) {
      console.error("PDF extraction error:", err);
      setExtractionStatus("error");
    }
  }, []);

  const handleRemoveFile = () => {
    setFile(null);
    setExtractionStatus(null);
    setLocalExtractedText("");
    setWordCount(0);
  };

  const handleLetsRead = () => {
    if (!extractedText) return;
    setExtractedText(extractedText);
    setDocumentTitle(file?.name?.replace(".pdf", "") || "Untitled Document");
    navigate("/read");
  };

  const canRead = extractionStatus === "done" && extractedText.length > 0;

  return (
    <>
      <style>{`
        @keyframes spritePulse {
          0%, 100% { box-shadow: 0 0 0 8px ${styles.accent}14, 0 12px 40px ${styles.accent}22; }
          50% { box-shadow: 0 0 0 16px ${styles.accent}08, 0 12px 60px ${styles.accent}33; }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes statusPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "var(--color-bg)",
          fontFamily,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "40px 24px",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "560px",
            display: "flex",
            flexDirection: "column",
            gap: "32px",
            animation: "heroFadeIn 0.6s ease forwards",
          }}
        >
          {/* Hero header */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "24px",
            }}
          >
            <HeroSprite styles={styles} />
            <div>
              <h1
                style={{
                  fontSize: "30px",
                  fontWeight: "800",
                  color: "var(--color-text)",
                  lineHeight: "1.2",
                  letterSpacing: "-0.03em",
                  marginBottom: "8px",
                }}
              >
                Let's Read
              </h1>
              <p
                style={{
                  fontSize: "14px",
                  color: "var(--color-subtext)",
                  lineHeight: "1.6",
                  maxWidth: "300px",
                }}
              >
                Upload a dense academic PDF and read it line-by-line — no
                more cognitive overload.
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: "12px",
            }}
          >
            {[
              { icon: <BookOpen size={14} />, label: "Line-by-line focus" },
              { icon: <Sparkles size={14} />, label: "AI comprehension quiz" },
              { icon: <FileText size={14} />, label: "Any academic PDF" },
            ].map(({ icon, label }) => (
              <div
                key={label}
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  padding: "12px 8px",
                  borderRadius: "12px",
                  border: "1px solid var(--color-border)",
                  background: "var(--color-surface)",
                  color: "var(--color-subtext)",
                  fontSize: "11px",
                  fontWeight: "500",
                  textAlign: "center",
                  letterSpacing: "0.02em",
                }}
              >
                <span style={{ color: styles.accent }}>{icon}</span>
                {label}
              </div>
            ))}
          </div>

          {/* Upload area */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {!file ? (
              <DropZone
                onFile={handleFile}
                isDragging={isDragging}
                setIsDragging={setIsDragging}
              />
            ) : (
              <FileCard file={file} onRemove={handleRemoveFile} styles={styles} />
            )}

            {extractionStatus && (
              <ExtractionStatus
                status={extractionStatus}
                wordCount={wordCount}
                styles={styles}
              />
            )}
          </div>

          {/* CTA */}
          <button
            onClick={handleLetsRead}
            disabled={!canRead}
            aria-label="Begin reading this document"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              padding: "16px 28px",
              borderRadius: "14px",
              border: "none",
              background: canRead ? styles.accent : "var(--color-border)",
              color: canRead ? "#fff" : "var(--color-subtext)",
              cursor: canRead ? "pointer" : "not-allowed",
              fontSize: "15px",
              fontWeight: "700",
              letterSpacing: "-0.01em",
              boxShadow: canRead ? `0 6px 24px ${styles.accent}44` : "none",
              transition: "all 0.25s ease",
              transform: "scale(1)",
            }}
            onMouseEnter={(e) => {
              if (canRead) e.currentTarget.style.transform = "scale(1.02)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <BookOpen size={17} />
            Let's Read
            {canRead && <ArrowRight size={15} />}
          </button>
        </div>
      </div>
    </>
  );
}