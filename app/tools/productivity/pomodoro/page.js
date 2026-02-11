"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause, RotateCcw, Monitor, Coffee } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function PomodoroPage() {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [mode, setMode] = useState("work"); // work, short, long
    const intervalRef = useRef(null);

    const modes = {
        work: { label: "Work", minutes: 25, color: "text-red-500", bg: "bg-red-500", icon: Monitor },
        short: { label: "Short Break", minutes: 5, color: "text-green-500", bg: "bg-green-500", icon: Coffee },
        long: { label: "Long Break", minutes: 15, color: "text-blue-500", bg: "bg-blue-500", icon: Coffee },
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsActive(false);
            // Play notification sound here if we had one
        }

        return () => clearInterval(intervalRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(modes[mode].minutes * 60);
    };

    const changeMode = (newMode) => {
        setMode(newMode);
        setIsActive(false);
        setTimeLeft(modes[newMode].minutes * 60);
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = 100 - (timeLeft / (modes[mode].minutes * 60)) * 100;

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Pomodoro Timer"
                    description="Boost your productivity with focused work sessions and timed breaks."
                />
            </div>

            <div className="max-w-xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Mode Selector */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-2 flex justify-between shadow-lg transition-colors">
                    {Object.entries(modes).map(([key, m]) => (
                        <button
                            key={key}
                            onClick={() => changeMode(key)}
                            className={`flex flex-1 items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${mode === key
                                ? `${m.bg} text-white shadow-lg`
                                : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                                }`}
                        >
                            <m.icon size={16} /> {m.label}
                        </button>
                    ))}
                </div>

                {/* Timer Display */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-[3rem] p-12 text-center shadow-2xl relative overflow-hidden flex items-center justify-center aspect-square md:aspect-auto md:h-96 transition-colors">
                    {/* Ring Progress (SVG) */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-6">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                            {/* Background Ring */}
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                className="text-gray-200 dark:text-gray-800 transition-colors"
                            />
                            {/* Progress Ring */}
                            <circle
                                cx="50" cy="50" r="45"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="4"
                                strokeLinecap="round"
                                className={`${modes[mode].color} transition-all duration-1000 ease-linear`}
                                strokeDasharray="283"
                                strokeDashoffset={283 - (progress / 100 * 283)}
                            />
                        </svg>
                    </div>

                    {/* Active Mode Color Glow */}
                    <div className={`absolute inset-0 opacity-10 blur-3xl transition-colors duration-700 pointer-events-none ${modes[mode].bg}`} />

                    <div className="relative z-10 flex flex-col items-center">
                        <div className={`text-7xl md:text-8xl font-mono font-bold tracking-tighter mb-2 transition-colors duration-300 ${isActive ? "text-gray-900 dark:text-gray-100" : "text-gray-400 dark:text-gray-500"}`}>
                            {formatTime(timeLeft)}
                        </div>
                        <p className={`text-lg font-medium tracking-widest uppercase opacity-80 ${modes[mode].color}`}>
                            {isActive ? "Running" : "Paused"}
                        </p>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-6">
                    <button
                        onClick={toggleTimer}
                        className={`w-20 h-20 rounded-full flex items-center justify-center transition-all shadow-xl hover:scale-105 ${isActive
                            ? "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-700"
                            : `bg-white dark:bg-gray-100 text-gray-900 border-4 border-gray-200 dark:border-gray-200`
                            }`}
                    >
                        {isActive ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                    </button>

                    <button
                        onClick={resetTimer}
                        className="w-20 h-20 rounded-full flex items-center justify-center bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all shadow-lg hover:rotate-180 duration-500"
                    >
                        <RotateCcw size={28} />
                    </button>
                </div>

            </div>
        </div>
    );
}
