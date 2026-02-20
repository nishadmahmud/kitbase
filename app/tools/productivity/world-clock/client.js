"use client";

import { useState, useEffect } from "react";
import { Plus, X, Globe, Clock } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import CustomSelect from "@/components/ui/CustomSelect";

export default function WorldClockClient() {
    const [time, setTime] = useState(new Date());
    const [clocks, setClocks] = useState(["UTC", "America/New_York", "Europe/London", "Asia/Tokyo"]);

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const zones = Intl.supportedValuesOf('timeZone');

    const addClock = (zone) => {
        if (zone && !clocks.includes(zone)) {
            setClocks([...clocks, zone]);
        }
    };

    const removeClock = (zone) => {
        setClocks(clocks.filter(c => c !== zone));
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="World Clock"
                    description="Track current time across multiple timezones simultaneously."
                    breadcrumbs={[{ label: "Productivity", href: "/category/productivity" }, { label: "World Clock" }]}
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">

                {/* Hero Clock (Local) */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between shadow-2xl transition-colors">
                    <div className="flex flex-col gap-2">
                        <span className="text-blue-500 dark:text-blue-400 font-semibold uppercase tracking-wider text-sm flex items-center gap-2">
                            <Clock size={16} /> Local Time
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-200">
                            {Intl.DateTimeFormat().resolvedOptions().timeZone}
                        </h2>
                        <p className="text-gray-500 text-lg">
                            {time.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="text-6xl md:text-8xl font-mono font-bold text-gray-900 dark:text-gray-100 tracking-tighter mt-4 md:mt-0">
                        {time.toLocaleTimeString(undefined, { hour12: false, hour: '2-digit', minute: '2-digit' })}
                        <span className="text-2xl md:text-4xl text-gray-400 dark:text-gray-500 ml-2">
                            {time.toLocaleTimeString(undefined, { second: '2-digit' })}
                        </span>
                    </div>
                </div>

                {/* Add Zone */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 flex gap-4 items-center shadow-lg max-w-xl mx-auto w-full transition-colors">
                    <Globe className="text-gray-400 dark:text-gray-500" />
                    <CustomSelect
                        value=""
                        onChange={(e) => addClock(e.target.value)}
                        options={[
                            { value: "", label: "Add a Timezone..." }, // Placeholder-like option if needed, or handle differently
                            ...zones.map(z => ({ value: z, label: z.replace(/_/g, ' ') }))
                        ]}
                        className="flex-1"
                        placeholder="Add a Timezone..."
                    />
                    <div className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg transition-colors">
                        <Plus size={20} className="text-gray-500 dark:text-gray-400" />
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {clocks.map(zone => (
                        <ClockCard key={zone} zone={zone} time={time} onRemove={() => removeClock(zone)} />
                    ))}
                </div>

            </div>
        </div>
    );
}

function ClockCard({ zone, time, onRemove }) {
    const tzTime = new Date(time.toLocaleString("en-US", { timeZone: zone }));
    const timeStr = tzTime.toLocaleTimeString("en-US", { timeZone: zone, hour: '2-digit', minute: '2-digit', hour12: false });
    const dateStr = tzTime.toLocaleDateString("en-US", { timeZone: zone, weekday: 'short', month: 'short', day: 'numeric' });
    const diff = (tzTime.getDate() - time.getDate());
    const diffStr = diff === 0 ? "Today" : diff > 0 ? "Tomorrow" : "Yesterday";

    // City name cleanup
    const city = zone.split("/").pop().replace(/_/g, ' ');

    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 relative group hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:-translate-y-1 shadow-sm dark:shadow-none">
            <button
                onClick={onRemove}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
                <X size={16} />
            </button>

            <div className="flex flex-col gap-4">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 truncate pr-4">{city}</h3>
                    <p className="text-xs text-gray-500 font-mono truncate">{zone}</p>
                </div>

                <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-mono font-bold text-gray-900 dark:text-gray-100">{timeStr}</span>
                </div>

                <div className="flex justify-between items-center text-sm border-t border-gray-100 dark:border-gray-800/50 pt-3 mt-1">
                    <span className="text-gray-500 dark:text-gray-400">{dateStr}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${diff === 0 ? "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400" : "bg-blue-500/10 text-blue-600 dark:text-blue-400"}`}>
                        {diffStr}
                    </span>
                </div>
            </div>
        </div>
    );
}
