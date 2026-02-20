"use client";

import { useState, useEffect } from "react";
import { DollarSign, PieChart, Calculator } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

export default function LoanCalculatorClient() {
    const [amount, setAmount] = useState(20000);
    const [rate, setRate] = useState(5.5);
    const [years, setYears] = useState(5);

    const [monthlyPayment, setMonthlyPayment] = useState(0);
    const [totalInterest, setTotalInterest] = useState(0);
    const [totalPayment, setTotalPayment] = useState(0);

    useEffect(() => {
        calculate();
    }, [amount, rate, years]);

    const calculate = () => {
        const principal = parseFloat(amount);
        const calculatedInterest = parseFloat(rate) / 100 / 12;
        const calculatedPayments = parseFloat(years) * 12;

        if (principal > 0 && calculatedInterest > 0 && calculatedPayments > 0) {
            const x = Math.pow(1 + calculatedInterest, calculatedPayments);
            const monthly = (principal * x * calculatedInterest) / (x - 1);

            if (isFinite(monthly)) {
                setMonthlyPayment(monthly);
                setTotalPayment(monthly * calculatedPayments);
                setTotalInterest((monthly * calculatedPayments) - principal);
            }
        }
    };

    const formatMoney = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Loan Calculator"
                    description="Calculate monthly payments, total interest, and amortization for loans."
                    breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "Loan Calculator" }]}
                />
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 grid md:grid-cols-2 gap-8">

                {/* Inputs */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 h-fit transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-6 flex items-center gap-2">
                        <Calculator size={20} className="text-gray-500 dark:text-gray-400" /> Loan Details
                    </h3>

                    <div className="space-y-6">
                        <InputGroup
                            label="Loan Amount"
                            symbol="$"
                            value={amount}
                            onChange={setAmount}
                            min={1000}
                        />
                        <InputGroup
                            label="Interest Rate"
                            symbol="%"
                            value={rate}
                            onChange={setRate}
                            step={0.1}
                        />
                        <InputGroup
                            label="Loan Term (Years)"
                            symbol="Yr"
                            value={years}
                            onChange={setYears}
                            max={50}
                        />

                        <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                            <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
                                <span>Monthly Payment</span>
                            </div>
                            <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                                {formatMoney(monthlyPayment)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Results Visual */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 flex flex-col justify-center transition-colors">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-gray-200 mb-6 flex items-center gap-2">
                        <PieChart size={20} className="text-gray-500 dark:text-gray-400" /> Breakdown
                    </h3>

                    <div className="flex flex-col gap-6">
                        <ResultRow label="Total Principal" value={formatMoney(amount)} color="bg-blue-500" />
                        <ResultRow label="Total Interest" value={formatMoney(totalInterest)} color="bg-red-500" />
                        <div className="h-px bg-gray-200 dark:bg-gray-800 my-2" />
                        <ResultRow label="Total Cost of Loan" value={formatMoney(totalPayment)} color="bg-green-500" big />
                    </div>

                    {/* Visual Bar */}
                    <div className="mt-8">
                        <div className="flex text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 justify-between">
                            <span>Principal</span>
                            <span>Interest</span>
                        </div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden flex">
                            <div className="bg-blue-500 h-full" style={{ width: `${(amount / totalPayment) * 100}%` }} />
                            <div className="bg-red-500 h-full flex-1" />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}

function InputGroup({ label, symbol, value, onChange, type = "number", min = 0, max, step = 1 }) {
    return (
        <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">{label}</label>
            <div className="relative">
                <input
                    type={type}
                    value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-4 py-3 pl-10 text-gray-900 dark:text-gray-200 outline-none focus:border-blue-500/50 transition-colors"
                    min={min}
                    max={max}
                    step={step}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-sm">
                    {symbol}
                </span>
            </div>
        </div>
    );
}

function ResultRow({ label, value, color, big }) {
    return (
        <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${color}`} />
                <span className={`text-gray-700 dark:text-gray-400 ${big ? "font-semibold text-lg" : "font-medium"}`}>{label}</span>
            </div>
            <span className={`font-mono text-gray-900 dark:text-gray-200 ${big ? "text-2xl font-bold" : "text-lg"}`}>{value}</span>
        </div>
    );
}
