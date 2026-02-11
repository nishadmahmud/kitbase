"use client";

import { useState, useRef, useEffect } from "react";
import { Play, Pause, Square, Flag, RotateCcw, Clock } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function StopwatchPage() {
    const [time, setTime] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [laps, setLaps] = useState([]);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(0);

    useEffect(() => {
        if (isActive) {
            startTimeRef.current = Date.now() - time;
            intervalRef.current = setInterval(() => {
                setTime(Date.now() - startTimeRef.current);
            }, 10);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [isActive]);

    const handleStartStop = () => setIsActive(!isActive);

    const handleReset = () => {
        setIsActive(false);
        setTime(0);
        setLaps([]);
    };

    const handleLap = () => {
        setLaps(prev => [...prev, time]);
    };

    const formatTime = (ms) => {
        const mins = Math.floor(ms / 60000);
        const secs = Math.floor((ms % 60000) / 1000);
        const centis = Math.floor((ms % 1000) / 10);

        return (
            <div className="flex items-baseline justify-center font-mono tabular-nums leading-none">
                <span className="w-[1.2em] text-center">{mins.toString().padStart(2, '0')}</span>
                <span className="opacity-50 mx-1">:</span>
                <span className="w-[1.2em] text-center">{secs.toString().padStart(2, '0')}</span>
                <span className="opacity-50 mx-1">.</span>
                <span className="w-[1.2em] text-center text-6xl text-gray-400">{centis.toString().padStart(2, '0')}</span>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-950 pb-12">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Stopwatch"
                    description="Precise digital stopwatch with lap tracking down to milliseconds."
                />
            </div>

            <div className="max-w-2xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Display */}
                <div className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-12 text-center shadow-2xl relative overflow-hidden">
                    <div className="relative z-10 text-7xl sm:text-8xl md:text-9xl font-bold text-gray-100 tracking-tighter">
                        {formatTime(time)}
                    </div>
                </div>

                {/* Controls */}
                <div className="grid grid-cols-3 gap-4">
                    <button
                        onClick={handleReset}
                        className="h-20 rounded-2xl flex items-center justify-center bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700 transition-all shadow-lg"
                    >
                        <RotateCcw size={24} />
                    </button>

                    <button
                        onClick={handleStartStop}
                        className={`h-20 rounded-2xl flex items-center justify-center transition-all shadow-xl hover:scale-[1.02] ${isActive
                            ? "bg-red-500 text-white shadow-red-500/20"
                            : "bg-green-500 text-white shadow-green-500/20"
                            }`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" />}
                    </button>

                    <button
                        onClick={handleLap}
                        disabled={!isActive}
                        className="h-20 rounded-2xl flex items-center justify-center bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200 hover:border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg"
                    >
                        <Flag size={24} />
                    </button>
                </div>

                {/* Laps */}
                {laps.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 shadow-lg transform transition-all animate-in fade-in slide-in-from-bottom-4">
                        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-800">
                            <h3 className="text-gray-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                                <Clock size={16} /> Laps
                            </h3>
                            <span className="text-gray-500 text-xs font-mono">{laps.length} Total</span>
                        </div>
                        <div className="max-h-60 overflow-y-auto pr-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-800 scrollbar-track-transparent">
                            {[...laps].reverse().map((lapTime, i) => (
                                <div key={i} className="flex justify-between items-center text-lg font-mono p-3 bg-gray-950 rounded-xl border border-gray-800/50">
                                    <span className="text-gray-500 text-sm">#{laps.length - i}</span>
                                    <span className="text-gray-200 font-medium">
                                        {Math.floor(lapTime / 60000).toString().padStart(2, '0')}:
                                        {Math.floor((lapTime % 60000) / 1000).toString().padStart(2, '0')}.
                                        {Math.floor((lapTime % 1000) / 10).toString().padStart(2, '0')}
                                    </span>
                                    <span className="text-xs text-gray-600 w-16 text-right">
                                        {i === 0 ? "+0.00" : `+${((lapTime - laps[laps.length - i - 2]) / 1000).toFixed(2)}s`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}
