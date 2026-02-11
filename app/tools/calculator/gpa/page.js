"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";

const gradePoints = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0.0 };
const gradeOptions = Object.keys(gradePoints);

const emptyCourse = () => ({ name: "", grade: "A", credits: 3 });

export default function GpaCalculatorPage() {
    const [courses, setCourses] = useState([emptyCourse(), emptyCourse(), emptyCourse()]);

    const addCourse = () => setCourses((prev) => [...prev, emptyCourse()]);
    const removeCourse = (i) => setCourses((prev) => prev.filter((_, idx) => idx !== i));
    const updateCourse = (i, field, value) => setCourses((prev) => prev.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
    const reset = () => setCourses([emptyCourse(), emptyCourse(), emptyCourse()]);

    const totalCredits = useMemo(() => courses.reduce((s, c) => s + (parseFloat(c.credits) || 0), 0), [courses]);
    const gpa = useMemo(() => {
        if (totalCredits === 0) return 0;
        const totalPoints = courses.reduce((s, c) => s + (gradePoints[c.grade] || 0) * (parseFloat(c.credits) || 0), 0);
        return totalPoints / totalCredits;
    }, [courses, totalCredits]);

    const letterGrade = gpa >= 3.7 ? "A" : gpa >= 3.3 ? "A-" : gpa >= 3.0 ? "B+" : gpa >= 2.7 ? "B" : gpa >= 2.3 ? "B-" : gpa >= 2.0 ? "C+" : gpa >= 1.7 ? "C" : gpa >= 1.0 ? "D" : "F";

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-10">
            <ToolHeader
                title="GPA Calculator"
                description="Calculate your Grade Point Average instantly with an easy-to-use course table."
                breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "GPA Calculator" }]}
            />

            <div className="max-w-[800px] mx-auto">
                {/* GPA Display */}
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-9 text-center mb-8">
                    <p className="text-[13px] text-gray-500 m-0 mb-2 uppercase tracking-wide font-semibold">Your GPA</p>
                    <p className="text-[56px] font-extrabold text-gray-100 m-0 mb-2 leading-none">{gpa.toFixed(2)}</p>
                    <p className="text-base text-gray-400 m-0">
                        {letterGrade} · {totalCredits} credit{totalCredits !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Course Table */}
                <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden mb-6">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_120px_100px_48px] gap-3 px-5 py-3.5 border-b border-gray-800">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Credits</span>
                        <span></span>
                    </div>
                    {/* Rows */}
                    {courses.map((course, i) => (
                        <div key={i} className={`grid grid-cols-[1fr_120px_100px_48px] gap-3 px-5 py-2.5 items-center ${i < courses.length - 1 ? "border-b border-gray-800" : ""}`}>
                            <input
                                type="text"
                                placeholder={`Course ${i + 1}`}
                                value={course.name}
                                onChange={(e) => updateCourse(i, "name", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-950 border border-gray-800 rounded-lg text-gray-200 outline-none focus:border-gray-500 transition-colors"
                            />
                            <select
                                value={course.grade}
                                onChange={(e) => updateCourse(i, "grade", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-950 border border-gray-800 rounded-lg text-gray-200 outline-none cursor-pointer focus:border-gray-500 transition-colors"
                            >
                                {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => updateCourse(i, "credits", e.target.value)}
                                min={0}
                                max={12}
                                className="w-full px-3 py-2 text-sm bg-gray-950 border border-gray-800 rounded-lg text-gray-200 outline-none text-center focus:border-gray-500 transition-colors"
                            />
                            <button
                                onClick={() => removeCourse(i)}
                                disabled={courses.length <= 1}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent transition-colors ${courses.length <= 1
                                    ? "text-gray-700 cursor-not-allowed"
                                    : "text-gray-500 hover:text-red-500 hover:bg-red-500/10 cursor-pointer"
                                    }`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex justify-center gap-3">
                    <button
                        onClick={addCourse}
                        className="inline-flex items-center gap-1.5 px-6 py-3 bg-gray-100 text-gray-900 font-semibold text-sm rounded-xl border-none cursor-pointer hover:bg-white transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Course
                    </button>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 px-6 py-3 border border-gray-800 text-gray-400 font-semibold text-sm rounded-xl bg-transparent cursor-pointer hover:bg-gray-800 hover:text-gray-200 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
