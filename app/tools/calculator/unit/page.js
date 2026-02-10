"use client";

import { useState, useEffect } from "react";
import { ArrowRightLeft, Ruler, Weight, Thermometer, Box, Layers } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

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

export default function UnitConverterPage() {
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="Unit Converter"
                description="Convert values between different units of measurement easily."
                breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Unit Converter" }]}
            />

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* Category Selector */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "32px", overflowX: "auto", paddingBottom: "4px" }}>
                    {Object.entries(UNITS).map(([key, data]) => (
                        <button
                            key={key}
                            onClick={() => setCategory(key)}
                            style={{
                                display: "flex", alignItems: "center", gap: "8px",
                                padding: "12px 20px", borderRadius: "12px", border: "1px solid",
                                borderColor: category === key ? "#4f8cff" : "#2a2f3a",
                                backgroundColor: category === key ? "rgba(79, 140, 255, 0.1)" : "#171a21",
                                color: category === key ? "#4f8cff" : "#9aa0aa",
                                cursor: "pointer", fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap",
                                flex: "1 0 auto", justifyContent: "center"
                            }}
                        >
                            <data.icon size={18} /> {data.label}
                        </button>
                    ))}
                </div>

                {/* Conversion Card */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "24px", padding: "40px" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr auto 1fr", gap: "24px", alignItems: "center" }}>
                            {/* FROM */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase" }}>From</label>
                                <input
                                    type="number"
                                    value={amount}
                                    onChange={(e) => setAmount(Number(e.target.value))}
                                    style={{
                                        width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #3f4451",
                                        backgroundColor: "#0f1115", color: "#e6e8ee", outline: "none", fontSize: "24px", fontWeight: 700
                                    }}
                                />
                                <select
                                    value={fromUnit}
                                    onChange={(e) => setFromUnit(e.target.value)}
                                    style={{
                                        width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451",
                                        backgroundColor: "#2a2f3a", color: "#e6e8ee", outline: "none", fontSize: "14px", cursor: "pointer"
                                    }}
                                >
                                    {UNITS[category].units.map(u => (
                                        <option key={u.id} value={u.id}>{u.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* SWAP */}
                            <div style={{ marginTop: "24px" }}>
                                <button
                                    onClick={() => {
                                        const temp = fromUnit;
                                        setFromUnit(toUnit);
                                        setToUnit(temp);
                                    }}
                                    style={{
                                        width: "48px", height: "48px", borderRadius: "50%", backgroundColor: "#2a2f3a", border: "1px solid #3f4451",
                                        color: "#4f8cff", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
                                    }}
                                    title="Swap Units"
                                >
                                    <ArrowRightLeft size={20} />
                                </button>
                            </div>

                            {/* TO */}
                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <label style={{ fontSize: "14px", fontWeight: 600, color: "#9aa0aa", textTransform: "uppercase" }}>To</label>
                                <div style={{
                                    width: "100%", padding: "16px", borderRadius: "12px", border: "1px solid #2a2f3a",
                                    backgroundColor: "#111", color: "#4f8cff", fontSize: "24px", fontWeight: 700,
                                    display: "flex", alignItems: "center", height: "66px" // Match input height
                                }}>
                                    {formatNumber(result)}
                                </div>
                                <select
                                    value={toUnit}
                                    onChange={(e) => setToUnit(e.target.value)}
                                    style={{
                                        width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #3f4451",
                                        backgroundColor: "#2a2f3a", color: "#e6e8ee", outline: "none", fontSize: "14px", cursor: "pointer"
                                    }}
                                >
                                    {UNITS[category].units.map(u => (
                                        <option key={u.id} value={u.id}>{u.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
