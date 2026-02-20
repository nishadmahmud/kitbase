"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import CustomSelect from "@/components/ui/CustomSelect";

const gradePoints = { "A+": 4.0, A: 4.0, "A-": 3.7, "B+": 3.3, B: 3.0, "B-": 2.7, "C+": 2.3, C: 2.0, "C-": 1.7, "D+": 1.3, D: 1.0, "D-": 0.7, F: 0.0 };
const gradeOptions = Object.keys(gradePoints);

const emptyCourse = () => ({ name: "", grade: "A", credits: 3 });

export default function GpaCalculatorClient() {
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
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="GPA Calculator"
                    description="Calculate your Grade Point Average instantly with an easy-to-use course table."
                    breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "GPA Calculator" }]}
                />
            </div>

            <div className="max-w-[800px] mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-8">
                {/* GPA Display */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-9 text-center shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    <p className="text-[13px] text-gray-500 font-semibold uppercase tracking-wide m-0 mb-2">Your GPA</p>
                    <p className="text-[56px] font-extrabold text-gray-900 dark:text-gray-100 m-0 mb-2 leading-none">{gpa.toFixed(2)}</p>
                    <p className="text-base text-gray-500 dark:text-gray-400 m-0">
                        {letterGrade} · {totalCredits} credit{totalCredits !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Course Table */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
                    {/* Header */}
                    <div className="grid grid-cols-[1fr_120px_100px_48px] gap-3 px-5 py-3.5 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 rounded-t-2xl transition-colors">
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Course</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Grade</span>
                        <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Credits</span>
                        <span></span>
                    </div>
                    {/* Rows */}
                    {courses.map((course, i) => (
                        <div key={i} className={`grid grid-cols-[1fr_120px_100px_48px] gap-3 px-5 py-2.5 items-center ${i < courses.length - 1 ? "border-b border-gray-200 dark:border-gray-800" : ""}`}>
                            <input
                                type="text"
                                placeholder={`Course ${i + 1}`}
                                value={course.name}
                                onChange={(e) => updateCourse(i, "name", e.target.value)}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-200 outline-none focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            />
                            <div className="w-full">
                                <CustomSelect
                                    value={course.grade}
                                    onChange={(e) => updateCourse(i, "grade", e.target.value)}
                                    options={gradeOptions.map(g => ({ value: g, label: g }))}
                                    buttonClassName="bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-200"
                                />
                            </div>
                            <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => updateCourse(i, "credits", e.target.value)}
                                min={0}
                                max={12}
                                className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-lg text-gray-900 dark:text-gray-200 outline-none text-center focus:border-blue-500 dark:focus:border-blue-500 transition-colors"
                            />
                            <button
                                onClick={() => removeCourse(i)}
                                disabled={courses.length <= 1}
                                className={`flex items-center justify-center w-9 h-9 rounded-lg border-none bg-transparent transition-colors ${courses.length <= 1
                                    ? "text-gray-300 dark:text-gray-700 cursor-not-allowed"
                                    : "text-gray-400 dark:text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 cursor-pointer"
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
                        className="inline-flex items-center gap-1.5 px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-semibold text-sm rounded-xl border-none cursor-pointer hover:bg-gray-800 dark:hover:bg-white transition-colors"
                    >
                        <Plus className="w-4 h-4" /> Add Course
                    </button>
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-1.5 px-6 py-3 border border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-400 font-semibold text-sm rounded-xl bg-white dark:bg-transparent cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
                    >
                        <RotateCcw className="w-4 h-4" /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
