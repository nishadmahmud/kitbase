"use client";

import { useState, useEffect, useCallback } from "react";
import { Copy, Check, RefreshCw, ShieldCheck, ShieldAlert, Shield } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function PasswordGeneratorPage() {
    const [password, setPassword] = useState("");
    const [length, setLength] = useState(16);
    const [options, setOptions] = useState({
        uppercase: true,
        lowercase: true,
        numbers: true,
        symbols: true,
    });
    const [copied, setCopied] = useState(false);
    const [strength, setStrength] = useState("strong");

    const generatePassword = useCallback(() => {
        const charset = {
            uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            lowercase: "abcdefghijklmnopqrstuvwxyz",
            numbers: "0123456789",
            symbols: "!@#$%^&*()_+~`|}{[]:;?><,./-=",
        };

        let chars = "";
        let newPassword = "";

        if (options.uppercase) chars += charset.uppercase;
        if (options.lowercase) chars += charset.lowercase;
        if (options.numbers) chars += charset.numbers;
        if (options.symbols) chars += charset.symbols;

        if (chars === "") {
            setPassword("");
            return;
        }

        // Ensure at least one char of each selected type is present
        const types = [];
        if (options.uppercase) types.push(charset.uppercase);
        if (options.lowercase) types.push(charset.lowercase);
        if (options.numbers) types.push(charset.numbers);
        if (options.symbols) types.push(charset.symbols);

        types.forEach(type => {
            newPassword += type.charAt(Math.floor(Math.random() * type.length));
        });

        for (let i = newPassword.length; i < length; i++) {
            newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        setPassword(newPassword.split('').sort(() => 0.5 - Math.random()).join(''));
    }, [length, options]);

    useEffect(() => {
        generatePassword();
    }, [generatePassword]);

    useEffect(() => {
        // Calculate strength logic (very basic)
        if (length < 8) setStrength("weak");
        else if (length < 12) setStrength("medium");
        else if (length >= 12 && options.symbols && options.numbers && options.uppercase) setStrength("strong");
        else setStrength("medium");
    }, [length, options]);


    const handleCopy = () => {
        navigator.clipboard.writeText(password);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOptionChange = (key) => {
        setOptions(prev => {
            const newOptions = { ...prev, [key]: !prev[key] };
            // Prevent unchecking all
            if (!Object.values(newOptions).includes(true)) return prev;
            return newOptions;
        });
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Password Generator"
                    description="Generate strong, secure passwords with custom requirements."
                />
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">

                {/* Display Area */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-8 text-center shadow-lg transform transition-all hover:scale-[1.01]">
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-center gap-2">
                        {strength === "strong" && <span className="text-green-600 dark:text-green-500 flex items-center gap-1"><ShieldCheck size={14} /> Strong Password</span>}
                        {strength === "medium" && <span className="text-yellow-600 dark:text-yellow-500 flex items-center gap-1"><Shield size={14} /> Medium Strength</span>}
                        {strength === "weak" && <span className="text-red-500 flex items-center gap-1"><ShieldAlert size={14} /> Weak Password</span>}
                    </div>
                    <div className="text-3xl md:text-5xl font-mono font-bold text-gray-900 dark:text-gray-100 break-all tracking-wider mb-8 min-h-[60px] flex items-center justify-center">
                        {password}
                    </div>
                    <div className="flex justify-center gap-4">
                        <button
                            onClick={generatePassword}
                            className="flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-black dark:hover:text-white transition-all shadow-sm"
                        >
                            <RefreshCw size={18} /> Regenerate
                        </button>
                        <button
                            onClick={handleCopy}
                            className={`flex items-center gap-2 px-8 py-3 rounded-xl text-base font-semibold transition-all shadow-lg ${copied
                                ? "bg-green-500 text-white shadow-green-500/20"
                                : "bg-white dark:bg-gray-100 text-gray-900 border border-gray-200 dark:border-transparent hover:scale-105 shadow-gray-100/10"
                                }`}
                        >
                            {copied ? <Check size={18} /> : <Copy size={18} />}
                            {copied ? "Copied" : "Copy"}
                        </button>
                    </div>
                </div>

                {/* Options Area */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-lg transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-6">Settings</h3>

                    <div className="mb-8">
                        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                            <span>Password Length</span>
                            <span className="font-mono text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs border border-gray-200 dark:border-gray-700">{length}</span>
                        </div>
                        <input
                            type="range"
                            min="6"
                            max="64"
                            value={length}
                            onChange={(e) => setLength(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400"
                        />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <OptionToggle
                            label="Uppercase (A-Z)"
                            checked={options.uppercase}
                            onChange={() => handleOptionChange("uppercase")}
                        />
                        <OptionToggle
                            label="Lowercase (a-z)"
                            checked={options.lowercase}
                            onChange={() => handleOptionChange("lowercase")}
                        />
                        <OptionToggle
                            label="Numbers (0-9)"
                            checked={options.numbers}
                            onChange={() => handleOptionChange("numbers")}
                        />
                        <OptionToggle
                            label="Symbols (!@#$)"
                            checked={options.symbols}
                            onChange={() => handleOptionChange("symbols")}
                        />
                    </div>
                </div>

            </div>
        </div>
    );
}

function OptionToggle({ label, checked, onChange }) {
    return (
        <label className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{label}</span>
            <div className={`w-12 h-6 rounded-full p-1 transition-colors ${checked ? "bg-green-500" : "bg-gray-300 dark:bg-gray-800"}`}>
                <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${checked ? "translate-x-6" : "translate-x-0"}`} />
            </div>
            <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
        </label>
    );
}
