import React, { useState, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud } from "lucide-react";
import { ReaderContext } from "../context/ReaderContext";
import * as pdfjsLib from "pdfjs-dist";

// ─── PDF EXTRACT ─────────────────────────
async function extractTextFromPDF(file) {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    fullText += content.items.map((it) => it.str).join(" ") + "\n";
  }

  return fullText.trim();
}

// ─── TAG ─────────────────────────
const Tag = ({ children, rotate }) => (
  <div
    style={{
      background: "#e7cfa4",
      padding: "10px 18px",
      borderRadius: "20px",
      fontWeight: "800",
      color: "#6b4f2b",
      transform: `rotate(${rotate}deg)`,
      boxShadow: "0 6px 12px rgba(0,0,0,0.15)",
      width: "fit-content",
      transition: "transform 0.2s",
    }}
    onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
    onMouseLeave={(e) =>
      (e.currentTarget.style.transform = `rotate(${rotate}deg)`)
    }
  >
    {children}
  </div>
);

export default function Home() {
  const navigate = useNavigate();
  const { setExtractedText, setDocumentTitle } =
    useContext(ReaderContext);

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState(null);
  const [wordCount, setWordCount] = useState(0);
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef();

  const handleFile = useCallback(async (f) => {
    if (!f) return;
    setFile(f);
    setStatus("loading");

    try {
      const text = await extractTextFromPDF(f);
      const wc = text.split(/\s+/).length;

      setExtractedText(text);
      setDocumentTitle(f.name.replace(".pdf", ""));
      setWordCount(wc);
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const handleRead = () => {
    if (status === "done") navigate("/read");
  };

  return (
    <>
      {/* ANIMATIONS */}
      <style>{`
        @keyframes float {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#fff4e4",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "50px",
        }}
      >
        {/* OUTER */}
        <div
          style={{
            width: "100%",
            minHeight: "calc(100vh - 40px)",
            borderRadius: "30px",
            border: "3px solid #cabba7",
            background: "transparent",
            padding: "30px",
            boxSizing: "border-box",
          }}
        >
          {/* INNER */} 
          <div 
          style={{ 
            width: "100%",
            minHeight: "calc(100vh - 40px)",
            borderRadius: "25px", 
            padding: "40px 60px", 
            backgroundImage: "url('/images/bg.png')", 
            backgroundSize: "cover", 
            }} 
          >

          {/* 🔥 LOGO (NEW) */}
  <div
    style={{
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginBottom: "-50px", // overlap effect
    }}
  >
    <img
      src="/images/name-logo.png"
      alt="bookO logo"
      style={{
        width: "600px",
        height: "auto",
        objectFit: "contain",
        filter: "drop-shadow(0 6px 15px rgba(255, 255, 255, 0.2))",
      }}
    />
  </div>

          {/* CARD */}
            <div 
            style={{  
              backgroundImage: "url('/images/card-bg.png')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
              overflow: "hidden",

              borderRadius: "25px", 
              padding: "50px", 
              display: "flex", 
              flexWrap: "wrap", 
              gap: "40px", 
              justifyContent: "center", 
              alignItems: "center", 
              
              width: "100%",
              maxWidth: "1000px",
              margin: "0 auto",

              boxShadow: "0 15px 30px rgba(0,0,0,0.15)",
              transform: "translateY(60px)",

              
              }}
            >


              {/* LEFT TAGS */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "50px",
                  flex: "1 1 200px",
                }}
              >
                <Tag rotate={-8}>Any Academic PDF</Tag>
                <Tag rotate={5}>Line-by-line Focus</Tag>
                <Tag rotate={-6}>AI Comprehension Quiz</Tag>
              </div>

              {/* MASCOT */}
              <div style={{ flex: "1 1 200px", textAlign: "center" }}>
                <img
                  src="/images/mascot.png"
                  alt="mascot"
                  style={{
                    width: "1000px",
                    animation: "float 3s ease-in-out infinite",
                  }}
                />
              </div>

              {/* RIGHT */}
              <div style={{ flex: "1 1 260px", maxWidth: "320px" }}>
                <h1 style={{ fontColor: "#142004", fontSize: "38px", fontWeight: "900" }}>
                  Let’s Read!
                </h1>

                <p style={{ fontSize: "14px", marginBottom: "15px" }}>
                  Upload a PDF and read it line-by-line easily.
                </p>

                {/* UPLOAD */}
                <div
                  onClick={() => inputRef.current.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                  style={{
                    border: "2px dashed #7a3e1d",
                    borderRadius: "20px",
                    padding: "20px",
                    textAlign: "center",
                    background: dragging ? "#f1e3d3" : "#fff7ec",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                >
                  <div
                    style={{
                      width: "60px",
                      height: "60px",
                      margin: "0 auto 10px",
                      borderRadius: "15px",
                      background: "#7a3e1d",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: "0 5px 0 #5a2e14",
                    }}
                  >
                    <UploadCloud color="#fff" />
                  </div>

                  <p><b>Drop PDF here</b></p>
                  <p style={{ fontSize: "12px" }}>or click to browse</p>

                  <input
                    ref={inputRef}
                    type="file"
                    hidden
                    accept="application/pdf"
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                </div>

                {/* STATUS */}
                {status === "loading" && <p>Processing...</p>}
                {status === "done" && <p>Ready ({wordCount} words)</p>}
                {status === "error" && (
                  <p style={{ color: "red" }}>Error reading file</p>
                )}

                {/* BUTTON */}
                <button
                  onClick={handleRead}
                  disabled={status !== "done"}
                  style={{
                    width: "100%",
                    marginTop: "10px",
                    padding: "12px",
                    borderRadius: "20px",
                    border: "none",
                    background: "#c9a46b",
                    color: "#fff",
                    fontWeight: "800",
                    boxShadow: "0 5px 0 #a17c4a",
                    cursor: "pointer",
                    transition: "0.2s",
                  }}
                  onMouseDown={(e) =>
                    (e.currentTarget.style.transform = "translateY(3px)")
                  }
                  onMouseUp={(e) =>
                    (e.currentTarget.style.transform = "translateY(0)")
                  }
                >
                  Let’s Read!
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}