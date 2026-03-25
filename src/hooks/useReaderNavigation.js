import { useState, useEffect, useCallback } from "react";

/**
 * Manages the active line index for line-by-line reading navigation.
 * Advances the index on Space, Enter, ArrowDown, or a primary pointer click
 * on the reading surface. Retreats on ArrowUp or Backspace.
 *
 * @param {number} totalLines       - Total number of parsed lines.
 * @param {boolean} isReady         - Whether the line parser has finished.
 * @param {React.RefObject} targetRef - Optional ref to a DOM node that scoped
 *                                     pointer events should be bound to.
 *                                     Falls back to window if not provided.
 * @returns {{
 *   activeLineIndex: number,
 *   setActiveLineIndex: Function,
 *   goToNext: Function,
 *   goToPrev: Function,
 *   reset: Function,
 *   isComplete: boolean
 * }}
 */
function useReaderNavigation(totalLines, isReady, targetRef = null) {
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  const isComplete = activeLineIndex >= totalLines - 1;

  const goToNext = useCallback(() => {
    setActiveLineIndex((prev) => {
      if (prev >= totalLines - 1) return prev;
      return prev + 1;
    });
  }, [totalLines]);

  const goToPrev = useCallback(() => {
    setActiveLineIndex((prev) => {
      if (prev <= 0) return 0;
      return prev - 1;
    });
  }, []);

  const reset = useCallback(() => {
    setActiveLineIndex(0);
  }, []);

  useEffect(() => {
    if (!isReady || totalLines === 0) return;

    const handleKeyDown = (event) => {
      const tag = document.activeElement?.tagName?.toLowerCase();
      const isTyping =
        tag === "input" ||
        tag === "textarea" ||
        document.activeElement?.isContentEditable;

      if (isTyping) return;

      switch (event.code) {
        case "Space":
        case "Enter":
        case "NumpadEnter":
        case "ArrowDown":
        case "ArrowRight":
          event.preventDefault();
          goToNext();
          break;

        case "ArrowUp":
        case "ArrowLeft":
        case "Backspace":
          event.preventDefault();
          goToPrev();
          break;

        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isReady, totalLines, goToNext, goToPrev]);

  useEffect(() => {
    if (!isReady || totalLines === 0) return;

    const node = targetRef?.current || null;
    if (!node) return;

    const handlePointerUp = (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      goToNext();
    };

    node.addEventListener("pointerup", handlePointerUp);
    return () => node.removeEventListener("pointerup", handlePointerUp);
  }, [isReady, totalLines, targetRef, goToNext]);

  useEffect(() => {
    if (isReady) {
      setActiveLineIndex(0);
    }
  }, [isReady, totalLines]);

  return {
    activeLineIndex,
    setActiveLineIndex,
    goToNext,
    goToPrev,
    reset,
    isComplete,
  };
}

export default useReaderNavigation;