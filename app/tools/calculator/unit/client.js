"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Ruler, Weight, Thermometer, Box, Layers } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import CustomSelect from "@/components/ui/CustomSelect";

const UNITS = {
    length: {
        label: "Length",
        icon: Ruler,
        units: [
            { id: "m", label: "Meters (m)", factor: 1 },
            { id: "km", label: "Kilometers (km)", factor: 1000 },
            { id: "cm", label: "Centimeters (cm)", factor: 0.01 },
            { id: "mm", label: "Millimeters (mm)", factor: 0.001 },
            { id: "ft", label: "Feet (ft)", factor: 0.3048 },
            { id: "in", label: "Inches (in)", factor: 0.0254 },
            { id: "yd", label: "Yards (yd)", factor: 0.9144 },
            { id: "mi", label: "Miles (mi)", factor: 1609.34 },
        ]
    },
    weight: {
        label: "Weight",
        icon: Weight,
        units: [
            { id: "kg", label: "Kilograms (kg)", factor: 1 },
            { id: "g", label: "Grams (g)", factor: 0.001 },
            { id: "mg", label: "Milligrams (mg)", factor: 0.000001 },
            { id: "lb", label: "Pounds (lb)", factor: 0.453592 },
            { id: "oz", label: "Ounces (oz)", factor: 0.0283495 },
        ]
    },
    temperature: {
        label: "Temperature",
        icon: Thermometer,
        units: [ // Custom logic needed for temp
            { id: "c", label: "Celsius (°C)" },
            { id: "f", label: "Fahrenheit (°F)" },
            { id: "k", label: "Kelvin (K)" },
        ]
    },
    area: {
        label: "Area",
        icon: Box,
        units: [
            { id: "sqm", label: "Square Meters (m²)", factor: 1 },
            { id: "sqkm", label: "Square Kilometers (km²)", factor: 1000000 },
            { id: "sqft", label: "Square Feet (ft²)", factor: 0.092903 },
            { id: "acr", label: "Acres (ac)", factor: 4046.86 },
            { id: "ha", label: "Hectares (ha)", factor: 10000 },
        ]
    },
    volume: {
        label: "Volume",
        icon: Layers,
        units: [
            { id: "l", label: "Liters (L)", factor: 1 },
            { id: "ml", label: "Milliliters (ml)", factor: 0.001 },
            { id: "gal", label: "Gallons (US)", factor: 3.78541 },
            { id: "qt", label: "Quarts (US)", factor: 0.946353 },
            { id: "pt", label: "Pints (US)", factor: 0.473176 },
            { id: "cup", label: "Cups (US)", factor: 0.236588 },
        ]
    }
};

export default function UnitConverterClient() {
    const [category, setCategory] = useState("length");
    const [fromUnit, setFromUnit] = useState(UNITS.length.units[0].id);
    const [toUnit, setToUnit] = useState(UNITS.length.units[4].id); // m to ft default
    const [amount, setAmount] = useState(1);
    const [result, setResult] = useState(0);

    // Update units when category changes
    useEffect(() => {
        setFromUnit(UNITS[category].units[0].id);
        setToUnit(UNITS[category].units[1]?.id || UNITS[category].units[0].id);
    }, [category]);

    useEffect(() => {
        if (category === "temperature") {
            let res = amount;
            // Convert to Celsius first
            if (fromUnit === "f") res = (amount - 32) * 5 / 9;
            if (fromUnit === "k") res = amount - 273.15;

            // Convert from Celsius to target
            if (toUnit === "f") res = (res * 9 / 5) + 32;
            if (toUnit === "k") res = res + 273.15;

            setResult(res);
        } else {
            // Factor based conversion
            const fromFactor = UNITS[category].units.find(u => u.id === fromUnit)?.factor || 1;
            const toFactor = UNITS[category].units.find(u => u.id === toUnit)?.factor || 1;

            // Convert to base unit then to target
            const base = amount * fromFactor;
            const target = base / toFactor;

            setResult(target);
        }
    }, [amount, fromUnit, toUnit, category]);

    const formatNumber = (num) => {
        if (Math.abs(num) < 0.000001 || Math.abs(num) > 1000000) {
            return num.toExponential(4);
        }
        return parseFloat(num.toFixed(6));
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Unit Converter"
                    description="Convert values between different units of measurement easily."
                    breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Unit Converter" }]}
                />
            </div>

            <div className="max-w-3xl mx-auto px-6 -mt-8 relative z-10">
                {/* Category Selector */}
                <div className="flex gap-3 mb-8 overflow-x-auto pb-1 no-scrollbar">
                    {Object.entries(UNITS).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl border text-sm font-semibold whitespace-nowrap flex-none justify-center transition-colors cursor-pointer ${category === key
                                ? "border-gray-500 bg-gray-900 text-gray-100 dark:border-gray-500 dark:bg-gray-800 dark:text-gray-100 shadow-lg"
                                : "border-gray-200 bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-800"
                                }`}
                        >
                            <data.icon size={18} /> {data.label}
                        </button>
                    ))}
                </div>

                {/* Conversion Card */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-10 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    <div className="flex flex-col gap-8">

                        <div className="grid grid-cols-1 md:grid-cols-[1fr,auto,1fr] gap-6 items-center">
                            {/* FROM */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">From</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-200 outline-none text-2xl font-bold focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                                />
                                <CustomSelect
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                    options={UNITS[category].units.map(u => ({ value: u.id, label: u.label }))}
                                    buttonClassName="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            </div>

                            {/* SWAP */}
                            <div className="mt-6">
                                <button
                                    onClick={() => {
                                        const temp = fromUnit;
                                        setFromUnit(toUnit);
                                        setToUnit(temp);
                                    }}
                                    className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-200 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white transition-colors mx-auto cursor-pointer"
                                    title="Swap Units"
                                >
                                    <ArrowRightLeft size={20} />
                                </button>
                            </div>

                            {/* TO */}
                            <div className="flex flex-col gap-3">
                                <label className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">To</label>
                                <div className="w-full p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 text-2xl font-bold h-[66px] flex items-center overflow-hidden">
                                    {formatNumber(result)}
                                </div>
                                <CustomSelect
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                    options={UNITS[category].units.map(u => ({ value: u.id, label: u.label }))}
                                    buttonClassName="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
