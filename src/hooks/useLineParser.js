import { useState, useRef, useLayoutEffect, useCallback } from "react";

/**
 * Wraps every word in the input text with a <span> element,
 * measures each span's offsetTop after render, and groups
 * words sharing the same vertical position into line objects.
 *
 * @param {string} rawText  - The full plain-text string to parse.
 * @returns {{
 *   containerRef: React.RefObject,
 *   lines: Array<{ lineIndex: number, words: string[], rawHtml: string }>,
 *   isReady: boolean,
 *   reparse: () => void
 * }}
 */
function useLineParser(rawText) {
  const containerRef = useRef(null);
  const [lines, setLines] = useState([]);
  const [isReady, setIsReady] = useState(false);
  const [parseKey, setParseKey] = useState(0);

  const buildWordSpans = useCallback((text) => {
    if (!text || typeof text !== "string") return "";

    return text
      .split(/(\s+)/)
      .map((token, index) => {
        if (/^\s+$/.test(token)) {
          return token;
        }
        if (token === "") return "";
        return `<span data-word-index="${index}" class="word-token" style="display:inline;">${token}</span>`;
      })
      .join("");
  }, []);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || !rawText) {
      setLines([]);
      setIsReady(false);
      return;
    }

    const html = buildWordSpans(rawText);
    container.innerHTML = html;

    const spans = Array.from(
      container.querySelectorAll("span.word-token")
    );

    if (spans.length === 0) {
      setLines([]);
      setIsReady(true);
      return;
    }

    const rowMap = new Map();

    spans.forEach((span) => {
      const top = span.offsetTop;
      const word = span.textContent;
      const wordIndex = Number(span.getAttribute("data-word-index"));

      if (!rowMap.has(top)) {
        rowMap.set(top, []);
      }
      rowMap.get(top).push({ word, wordIndex });
    });

    const sortedTops = Array.from(rowMap.keys()).sort((a, b) => a - b);

    const parsedLines = sortedTops.map((top, lineIndex) => {
      const wordEntries = rowMap.get(top);
      const words = wordEntries.map((e) => e.word);
      return {
        lineIndex,
        words,
        rawHtml: words
          .map(
            (w, i) =>
              `<span data-word-index="${wordEntries[i].wordIndex}" class="word-token">${w}</span>`
          )
          .join(" "),
        text: words.join(" "),
        offsetTop: top,
      };
    });

    setLines(parsedLines);
    setIsReady(true);
  }, [rawText, buildWordSpans, parseKey]);

  const reparse = useCallback(() => {
    setIsReady(false);
    setParseKey((k) => k + 1);
  }, []);

  return {
    containerRef,
    lines,
    isReady,
    reparse,
  };
}

export default useLineParser;