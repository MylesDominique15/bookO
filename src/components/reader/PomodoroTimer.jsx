import React, { useState, useEffect, useRef, useCallback } from "react";
import { Play, Pause, RotateCcw, Plus, Coffee, BookOpen } from "lucide-react";

const MODES = { READING: "reading", BREAK: "break" };

export default function PomodoroTimer() {
  const [mode, setMode] = useState(MODES.READING);
  const [readingMinutes, setReadingMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const clearTimer = useCallback(() => {
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            clearTimer();
            setIsRunning(false);
            const newMode = mode === MODES.READING ? MODES.BREAK : MODES.READING;
            setMode(newMode);
            return newMode === MODES.READING ? readingMinutes * 60 : breakMinutes * 60;
          }
          return prev - 1;
        });
      }, 1000);
    } else { clearTimer(); }
    return clearTimer;
  }, [isRunning, mode, readingMinutes, breakMinutes, clearTimer]);

  const toggleRunning = () => setIsRunning(!isRunning);
  const reset = () => { clearTimer(); setIsRunning(false); setSecondsLeft(mode === MODES.READING ? readingMinutes * 60 : breakMinutes * 60); };

  const m = Math.floor(secondsLeft / 60).toString().padStart(2, "0");
  const s = (secondsLeft % 60).toString().padStart(2, "0");

  return (
    <div className="bg-[#FFD7C4] rounded-[2rem] p-6 flex flex-col items-center justify-center gap-4 shadow-lg shadow-orange-200/50 mt-auto">
      <div className="flex gap-2 bg-white/40 p-1 rounded-full w-full">
        <button 
          onClick={() => { setMode(MODES.READING); setSecondsLeft(readingMinutes * 60); setIsRunning(false); }}
          className={`flex-1 text-[10px] font-bold uppercase rounded-full py-1.5 transition-all ${mode === MODES.READING ? 'bg-white text-orange-500 shadow-sm' : 'text-orange-600/60'}`}
        >
          Focus
        </button>
        <button 
          onClick={() => { setMode(MODES.BREAK); setSecondsLeft(breakMinutes * 60); setIsRunning(false); }}
          className={`flex-1 text-[10px] font-bold uppercase rounded-full py-1.5 transition-all ${mode === MODES.BREAK ? 'bg-white text-orange-500 shadow-sm' : 'text-orange-600/60'}`}
        >
          Break
        </button>
      </div>

      <div className="text-5xl font-black text-white drop-shadow-sm tracking-tight">
        {m}:{s}
      </div>

      <button
        onClick={toggleRunning}
        className="bg-white text-orange-500 px-8 py-3 rounded-full font-bold text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
      >
        {isRunning ? <Pause size={16} /> : <Play size={16} />}
        {isRunning ? "PAUSE" : "START"}
      </button>

      <div className="flex gap-4 mt-2">
        <button onClick={reset} className="text-white/80 hover:text-white transition-colors"><RotateCcw size={18} /></button>
        <button className="text-white/80 hover:text-white transition-colors"><BookOpen size={18} /></button>
        <button className="text-white/80 hover:text-white transition-colors"><Coffee size={18} /></button>
      </div>
    </div>
  );
}