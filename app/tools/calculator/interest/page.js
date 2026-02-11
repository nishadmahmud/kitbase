"use client";

import { useState, useEffect } from "react";
import { TrendingUp, Calculator } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import CustomSelect from "@/components/ui/CustomSelect";

export default function InterestCalculatorPage() {
    const [principal, setPrincipal] = useState(10000);
    const [rate, setRate] = useState(5);
    const [years, setYears] = useState(10);
    const [compounding, setCompounding] = useState(12); // 1, 12, 365

    const [simpleInterest, setSimpleInterest] = useState(0);
    const [compoundInterest, setCompoundInterest] = useState(0);
    const [totalSimple, setTotalSimple] = useState(0);
    const [totalCompound, setTotalCompound] = useState(0);

    useEffect(() => {
        const p = parseFloat(principal);
        const r = parseFloat(rate) / 100;
        const t = parseFloat(years);
        const n = parseFloat(compounding);

        if (p > 0 && r > 0 && t > 0) {
            // Simple: A = P(1 + rt)
            const simpleA = p * (1 + (r * t));
            setTotalSimple(simpleA);
            setSimpleInterest(simpleA - p);

            // Compound: A = P(1 + r/n)^(nt)
            const compoundA = p * Math.pow((1 + (r / n)), (n * t));
            setTotalCompound(compoundA);
            setCompoundInterest(compoundA - p);
        }
    }, [principal, rate, years, compounding]);

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Interest Calculator"
                    description="Compare Simple vs. Compound Interest growth over time."
                    breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Interest" }]}
                />
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10 grid lg:grid-cols-3 gap-8">

                {/* Inputs */}
                <div className="lg:col-span-1 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 h-fit transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-6 flex items-center gap-2">
                        <Calculator size={20} className="text-gray-500 dark:text-gray-400" /> Parameters
                    </h3>

                    <div className="space-y-6">
                        <InputGroup
                            label="Principal Amount"
                            symbol="$"
                            value={principal}
                            onChange={setPrincipal}
                        />
                        <InputGroup
                            label="Annual Rate"
                            symbol="%"
                            value={rate}
                            onChange={setRate}
                            step={0.1}
                        />
                        <InputGroup
                            label="Time Period"
                            symbol="Yr"
                            value={years}
                            onChange={setYears}
                        />

                        <div>
                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Compounding Frequency</label>
                            <CustomSelect
                                value={compounding}
                                onChange={(e) => setCompounding(Number(e.target.value))}
                                options={[
                                    { value: 1, label: "Annually (1x/yr)" },
                                    { value: 2, label: "Semi-Annually (2x/yr)" },
                                    { value: 4, label: "Quarterly (4x/yr)" },
                                    { value: 12, label: "Monthly (12x/yr)" },
                                    { value: 365, label: "Daily (365x/yr)" },
                                ]}
                                buttonClassName="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200"
                            />
                        </div>
                    </div>
                </div>

                {/* Comparison Results */}
                <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                    {/* Simple Interest Card */}
                    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 flex flex-col relative overflow-hidden group transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={100} className="text-gray-900 dark:text-gray-100" />
                        </div>
                        <h4 className="text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider text-sm mb-4">Simple Interest</h4>
                        <div className="mt-auto">
                            <div className="text-3xl font-bold text-gray-900 dark:text-gray-200 mb-1">{formatMoney(totalSimple)}</div>
                            <div className="text-sm font-medium text-green-600 dark:text-green-500">
                                +{formatMoney(simpleInterest)} Profit
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800 space-y-2">
                            <ResultRow label="Principal" value={formatMoney(principal)} />
                            <ResultRow label="Rate Return" value={(rate * years).toFixed(1) + "%"} />
                        </div>
                    </div>

                    {/* Compound Interest Card */}
                    <div className="bg-gradient-to-br from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 border border-blue-100 dark:border-blue-500/20 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 flex flex-col relative overflow-hidden group transition-colors">
                        <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-600 dark:text-blue-500 group-hover:opacity-20 transition-opacity">
                            <TrendingUp size={100} />
                        </div>
                        <h4 className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider text-sm mb-4">Compound Interest</h4>
                        <div className="mt-auto">
                            <div className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-1">{formatMoney(totalCompound)}</div>
                            <div className="text-sm font-medium text-green-600 dark:text-green-400 flex items-center gap-2">
                                +{formatMoney(compoundInterest)} Profit
                                <span className="bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded text-xs">
                                    +{(compoundInterest - simpleInterest > 0) ? formatMoney(compoundInterest - simpleInterest) : "$0"} vs Simple
                                </span>
                            </div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-blue-200 dark:border-blue-500/20 space-y-2">
                            <ResultRow label="Principal" value={formatMoney(principal)} />
                            <ResultRow label="Effective APY" value={(((Math.pow((1 + (rate / 100 / compounding)), compounding) - 1) * 100).toFixed(2)) + "%"} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputGroup({ label, symbol, value, onChange, type = "number", step = 1 }) {
    return (
        <div className="relative">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 pl-10 text-gray-900 dark:text-gray-200 outline-none focus:border-blue-500/50 transition-colors"
                    step={step}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                    {symbol}
                </span>
            </div>
        </div>
    );
}

function ResultRow({ label, value }) {
    return (
        <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600 dark:text-gray-400">{label}</span>
            <span className="font-mono text-gray-900 dark:text-gray-300">{value}</span>
        </div>
    );
}
