"use client";

import { useState, useMemo } from "react";
import { Plus, Trash2, RotateCcw, GraduationCap } from "lucide-react";
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
        <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "40px 24px" }}>
            <ToolHeader
                title="GPA Calculator"
                description="Calculate your Grade Point Average instantly with an easy-to-use course table."
                breadcrumbs={[{ label: "Calculators", href: "/category/calculator" }, { label: "GPA Calculator" }]}
            />

            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                {/* GPA Display */}
                <div style={{
                    backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "20px",
                    padding: "36px", textAlign: "center", marginBottom: "32px",
                }}>
                    <p style={{ fontSize: "13px", color: "#6b7280", margin: "0 0 8px", textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>Your GPA</p>
                    <p style={{ fontSize: "56px", fontWeight: 800, color: "#4f8cff", margin: "0 0 8px", lineHeight: 1 }}>{gpa.toFixed(2)}</p>
                    <p style={{ fontSize: "16px", color: "#9aa0aa", margin: 0 }}>
                        {letterGrade} · {totalCredits} credit{totalCredits !== 1 ? "s" : ""}
                    </p>
                </div>

                {/* Course Table */}
                <div style={{ backgroundColor: "#171a21", border: "1px solid #2a2f3a", borderRadius: "16px", overflow: "hidden", marginBottom: "24px" }}>
                    {/* Header */}
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 48px", gap: "12px", padding: "14px 20px", borderBottom: "1px solid #2a2f3a" }}>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Course</span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Grade</span>
                        <span style={{ fontSize: "12px", fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Credits</span>
                        <span></span>
                    </div>
                    {/* Rows */}
                    {courses.map((course, i) => (
                        <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 120px 100px 48px", gap: "12px", padding: "10px 20px", borderBottom: i < courses.length - 1 ? "1px solid #1e2230" : "none", alignItems: "center" }}>
                            <input
                                type="text"
                                placeholder={`Course ${i + 1}`}
                                value={course.name}
                                onChange={(e) => updateCourse(i, "name", e.target.value)}
                                style={{ padding: "8px 12px", fontSize: "14px", backgroundColor: "#1a1e27", border: "1px solid #2a2f3a", borderRadius: "8px", color: "#e6e8ee", outline: "none" }}
                            />
                            <select
                                value={course.grade}
                                onChange={(e) => updateCourse(i, "grade", e.target.value)}
                                style={{ padding: "8px 12px", fontSize: "14px", backgroundColor: "#1a1e27", border: "1px solid #2a2f3a", borderRadius: "8px", color: "#e6e8ee", outline: "none", cursor: "pointer" }}
                            >
                                {gradeOptions.map((g) => <option key={g} value={g}>{g}</option>)}
                            </select>
                            <input
                                type="number"
                                value={course.credits}
                                onChange={(e) => updateCourse(i, "credits", e.target.value)}
                                min={0}
                                max={12}
                                style={{ padding: "8px 12px", fontSize: "14px", backgroundColor: "#1a1e27", border: "1px solid #2a2f3a", borderRadius: "8px", color: "#e6e8ee", outline: "none", textAlign: "center" }}
                            />
                            <button
                                onClick={() => removeCourse(i)}
                                disabled={courses.length <= 1}
                                style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "36px", height: "36px", borderRadius: "8px", border: "none", cursor: courses.length <= 1 ? "not-allowed" : "pointer", backgroundColor: "transparent", color: courses.length <= 1 ? "#2a2f3a" : "#6b7280" }}
                            >
                                <Trash2 style={{ width: "16px", height: "16px" }} />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", justifyContent: "center", gap: "12px" }}>
                    <button
                        onClick={addCourse}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            padding: "12px 24px", backgroundColor: "#4f8cff", color: "white",
                            fontWeight: 600, fontSize: "14px", borderRadius: "10px", border: "none", cursor: "pointer",
                        }}
                    >
                        <Plus style={{ width: "16px", height: "16px" }} /> Add Course
                    </button>
                    <button
                        onClick={reset}
                        style={{
                            display: "inline-flex", alignItems: "center", gap: "6px",
                            padding: "12px 24px", border: "1px solid #2a2f3a", color: "#9aa0aa",
                            fontWeight: 600, fontSize: "14px", borderRadius: "10px", backgroundColor: "transparent", cursor: "pointer",
                        }}
                    >
                        <RotateCcw style={{ width: "16px", height: "16px" }} /> Reset
                    </button>
                </div>
            </div>
        </div>
    );
}
