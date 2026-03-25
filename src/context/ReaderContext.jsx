import React, { createContext, useState, useCallback } from "react";

export const ReaderContext = createContext(null);

export function ReaderProvider({ children }) {
  const [extractedText, setExtractedText] = useState("");
  const [documentTitle, setDocumentTitle] = useState("");
  const [sessionResults, setSessionResults] = useState([]);
  const [highlights, setHighlights] = useState([]);

  const addSessionResult = useCallback((result) => {
    setSessionResults((prev) => [result, ...prev]);
  }, []);

  const addHighlight = useCallback((highlight) => {
    setHighlights((prev) => [...prev, { ...highlight, id: Date.now() }]);
  }, []);

  const removeHighlight = useCallback((id) => {
    setHighlights((prev) => prev.filter((h) => h.id !== id));
  }, []);

  const clearDocument = useCallback(() => {
    setExtractedText("");
    setDocumentTitle("");
    setHighlights([]);
  }, []);

  const value = {
    extractedText,
    setExtractedText,
    documentTitle,
    setDocumentTitle,
    sessionResults,
    addSessionResult,
    highlights,
    addHighlight,
    removeHighlight,
    clearDocument,
  };

  return (
    <ReaderContext.Provider value={value}>{children}</ReaderContext.Provider>
  );
}