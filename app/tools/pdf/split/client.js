"use client";

import { useState, useCallback, useEffect } from "react";
import { Scissors, Download, FileText, Check, Archive, RefreshCw, Layers, LayoutTemplate, Plus, Trash2 } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolDropzone from "@/components/tool/ToolDropzone";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import ToolResult from "@/components/tool/ToolResult";
import { splitPdf } from "@/lib/pdf/split";
import { renderPdfPages } from "@/lib/pdf/render";
import { downloadBlob } from "@/lib/utils/download";
import JSZip from "jszip";

export default function SplitPdfClient() {
    const [file, setFile] = useState(null);
    const [pageImages, setPageImages] = useState([]);
    const [loadingThumbnails, setLoadingThumbnails] = useState(false);

    const [loading, setLoading] = useState(false);
    const [resultFiles, setResultFiles] = useState([]);
    const [error, setError] = useState(null);

    // Sidebar State
    const [tab, setTab] = useState("range"); // "range", "extract"
    const [rangeMode, setRangeMode] = useState("custom"); // "custom", "fixed"
    const [extractMode, setExtractMode] = useState("all"); // "all", "select"

    // Range Options
    const [ranges, setRanges] = useState([{ id: 1, from: 1, to: 1 }]);
    const [fixedCount, setFixedCount] = useState(1);
    const [mergeRanges, setMergeRanges] = useState(false);

    // Extract Options
    const [extractPagesStr, setExtractPagesStr] = useState("");
    const [mergeExtract, setMergeExtract] = useState(false);
    const [selectedExtractPages, setSelectedExtractPages] = useState(new Set());

    const handleFiles = useCallback(async (files) => {
        const selectedFile = files[0];
        setFile(selectedFile);
        setResultFiles([]);
        setError(null);
        setPageImages([]);
        setRanges([{ id: Date.now(), from: 1, to: 1 }]);

        setLoadingThumbnails(true);
        try {
            const imgs = await renderPdfPages(selectedFile, { scale: 1 }); // lower scale for thumbnails
            setPageImages(imgs);
            setRanges([{ id: Date.now(), from: 1, to: imgs.length }]); // Default to full document
        } catch (err) {
            console.error("Failed to render thumbnails", err);
        }
        setLoadingThumbnails(false);
    }, []);

    // Sync input string to selected pages Set (only when necessary or explicitly triggered)
    const updateSelectedPagesFromStr = useCallback((str) => {
        if (tab !== "extract" || extractMode !== "select") return;

        const newSet = new Set();
        const parts = extractPagesStr.split(',').map(p => p.trim()).filter(Boolean);
        const maxPages = pageImages.length || 1000;

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    const s = Math.max(1, Math.min(start, end));
                    const e = Math.min(maxPages, Math.max(start, end));
                    for (let i = s; i <= e; i++) {
                        newSet.add(i);
                    }
                }
            } else {
                const p = Number(part);
                if (!isNaN(p) && p >= 1 && p <= maxPages) {
                    newSet.add(p);
                }
            }
        }
        setSelectedExtractPages(newSet);
    }, [pageImages.length, tab, extractMode]);

    // Initial sync and subsequent explicit syncs
    useEffect(() => {
        updateSelectedPagesFromStr(extractPagesStr);
    }, [extractPagesStr, pageImages.length, tab, extractMode]); // Still using effect for now, but keeping the parsing logic separate

    // Fix: We actually DO NOT want to sync continuously while typing because it interrupts backspacing and formatting.
    // Instead of the useEffect above doing it on every keystroke, we do it in a blurred/debounced way, or we decouple the string from the Set until rendering.

    // Let's rely on the toggle for updating BOTH, but for manual typing, we parse the string ONLY to determine visual highlights, 
    // WITHOUT forcing the string to re-render to the sorted normalized version on every keystroke.

    // NEW LOGIC: 'extractPagesStr' is the source of truth for the input box. 
    // 'selectedExtractPages' is derived from it for highlights.
    useEffect(() => {
        if (tab !== "extract" || extractMode !== "select") return;

        const newSet = new Set();
        const parts = extractPagesStr.split(',').map(p => p.trim()).filter(Boolean);
        const maxPages = pageImages.length || 1000;

        for (const part of parts) {
            if (part.includes('-')) {
                const [start, end] = part.split('-').map(Number);
                if (!isNaN(start) && !isNaN(end)) {
                    const s = Math.max(1, Math.min(start, end));
                    const e = Math.min(maxPages, Math.max(start, end));
                    for (let i = s; i <= e; i++) {
                        newSet.add(i);
                    }
                }
            } else {
                const p = Number(part);
                if (!isNaN(p) && p >= 1 && p <= maxPages) {
                    newSet.add(p);
                }
            }
        }
        // ONLY update the set, DO NOT format the string back. The string is whatever the user typed.
        setSelectedExtractPages(newSet);
    }, [extractPagesStr, pageImages.length, tab, extractMode]);

    // Handle clicking a page thumbnail in "Extract -> Select pages" mode
    const togglePageSelection = (pageNumber) => {
        if (tab !== "extract" || extractMode !== "select") return;

        const newSet = new Set(selectedExtractPages);
        if (newSet.has(pageNumber)) {
            newSet.delete(pageNumber);
        } else {
            newSet.add(pageNumber);
        }

        // Convert Set back to string (only when clicking UI thumbnails)
        const pagesArray = Array.from(newSet).sort((a, b) => a - b);
        const newStr = pagesArray.join(', ');
        setExtractPagesStr(newStr);
        // The useEffect will automatically update the Set, but we can do it here too for instant feedback
        setSelectedExtractPages(newSet);
    };

    const handleSplit = async () => {
        setLoading(true);
        setError(null);
        try {
            const options = {
                mode: tab === "range" ? `${rangeMode}-range` : `extract-${extractMode}`,
                ranges: tab === "range" && rangeMode === "custom" ? ranges.map(r => ({ ...r, from: r.from || 1, to: r.to || 1 })) : [],
                fixedCount: tab === "range" && rangeMode === "fixed" ? (fixedCount || 1) : 1,
                extractPages: tab === "extract" && extractMode === "select" ? extractPagesStr : "",
                merge: tab === "range" && rangeMode === "custom" ? mergeRanges :
                    tab === "extract" && extractMode === "select" ? mergeExtract : false
            };

            const files = await splitPdf(file, options);
            setResultFiles(files);
        } catch (e) {
            setError(e.message || "Failed to split PDF. Check your inputs.");
        }
        setLoading(false);
    };

    const downloadZip = async () => {
        if (resultFiles.length === 0) return;
        if (resultFiles.length === 1) {
            downloadBlob(resultFiles[0].blob, resultFiles[0].name);
            return;
        }

        const zip = new JSZip();
        resultFiles.forEach(f => {
            zip.file(f.name, f.blob);
        });

        const zipBlob = await zip.generateAsync({ type: "blob" });
        downloadBlob(zipBlob, `${file.name.replace(".pdf", "")}-split.zip`);
    };

    const addRange = () => {
        const lastTo = ranges.length > 0 ? ranges[ranges.length - 1].to : 0;
        const newFrom = Math.min(lastTo + 1, pageImages.length || 1);
        const newTo = pageImages.length || 1;
        setRanges([...ranges, { id: Date.now(), from: newFrom, to: newTo }]);
    };

    const updateRange = (id, field, value) => {
        setRanges(ranges.map(r => r.id === id ? { ...r, [field]: value } : r));
    };

    const removeRange = (id) => {
        if (ranges.length === 1) return;
        setRanges(ranges.filter(r => r.id !== id));
    };

    // Helper to calculate expected output files
    const calculateOutputInfo = () => {
        if (!file || pageImages.length === 0) return { count: 0, text: "" };
        const total = pageImages.length;

        let count = 0;
        let text = "";

        if (tab === "range") {
            if (rangeMode === "custom") {
                count = mergeRanges ? 1 : ranges.length;
                text = `${count} PDF${count !== 1 ? 's' : ''} will be created based on your custom ranges.`;
            } else {
                const step = Math.max(1, fixedCount);
                count = Math.ceil(total / step);
                text = `The document will be split every ${step} page(s). ${count} PDF${count !== 1 ? 's' : ''} will be created.`;
            }
        } else {
            if (extractMode === "all") {
                count = total;
                text = `Every page will be extracted into a separate PDF file. ${count} PDFs will be created.`;
            } else {
                count = selectedExtractPages.size;
                if (count === 0) {
                    text = "Please select or enter pages to extract.";
                } else if (mergeExtract) {
                    text = `Selected pages will be merged into 1 PDF file.`;
                    count = 1;
                } else {
                    text = `Selected pages will be converted into separate PDF files. ${count} PDF${count !== 1 ? 's' : ''} will be created.`;
                }
            }
        }
        return { count, text };
    };

    const info = calculateOutputInfo();

    // Render Thumbnails
    const renderPreview = () => {
        if (loadingThumbnails) return <div className="p-12 text-center text-gray-500 w-full animate-pulse">Generating preview thumbnails...</div>;
        if (pageImages.length === 0) return <div className="p-12 text-center text-gray-400 w-full">No preview available</div>;

        const isInteractive = tab === "extract" && extractMode === "select";

        const renderPage = (idx, selected = true) => {
            const pageNum = idx + 1;
            const isSelectedNow = isInteractive ? selectedExtractPages.has(pageNum) : selected;

            return (
                <div
                    key={idx}
                    onClick={() => isInteractive && togglePageSelection(pageNum)}
                    className={`relative flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${isInteractive ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800' : ''} ${isSelectedNow ? 'bg-white dark:bg-gray-800 shadow-md ring-2 ring-rose-500/30 dark:ring-rose-400/30' : 'opacity-40 grayscale hover:grayscale-0 hover:opacity-100'}`}
                >
                    <div className="relative shadow-sm border border-gray-200 dark:border-gray-700 bg-white group">
                        <img src={pageImages[idx]} alt={`Page ${pageNum}`} className="w-[120px] sm:w-[140px] block" />
                        {isSelectedNow && (
                            <div className="absolute -top-2 -right-2 bg-rose-500 text-white rounded-full p-1 shadow-md">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        )}
                        {!isSelectedNow && isInteractive && (
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="bg-white text-gray-900 rounded-full p-2 shadow-lg">
                                    <Plus size={20} strokeWidth={3} />
                                </div>
                            </div>
                        )}
                    </div>
                    <span className={`text-xs font-semibold ${isSelectedNow ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                        {pageNum}
                    </span>
                </div>
            );
        };

        if (tab === "range" && rangeMode === "custom") {
            return divModeCustomRanges();
        } else if (tab === "range" && rangeMode === "fixed") {
            return divModeFixedRanges();
        } else if (tab === "extract" && extractMode === "all") {
            return divModeExtractAll();
        } else if (tab === "extract" && extractMode === "select") {
            return divModeExtractAll(false); // We handle selection inside renderPage
        }

        function divModeCustomRanges() {
            return ranges.map((r, i) => {
                const from = Math.max(1, Math.min(r.from || 1, pageImages.length));
                const to = Math.max(1, Math.min(r.to || 1, pageImages.length));
                const rangeIndices = [];
                for (let j = from; j <= Math.max(from, to); j++) rangeIndices.push(j - 1);

                return (
                    <div key={r.id} className="w-full mb-8 last:mb-0 relative">
                        <div className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl pointer-events-none"></div>
                        <h4 className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 dark:bg-gray-900 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                            Range {i + 1}
                        </h4>
                        <div className="flex flex-wrap gap-6 justify-center p-8">
                            {rangeIndices.map(idx => idx < pageImages.length ? renderPage(idx) : null)}
                        </div>
                    </div>
                );
            });
        }

        function divModeFixedRanges() {
            const groups = [];
            const step = Math.max(1, fixedCount);
            for (let i = 0; i < pageImages.length; i += step) {
                const groupIndices = [];
                for (let j = i; j < Math.min(i + step, pageImages.length); j++) groupIndices.push(j);
                groups.push(groupIndices);
            }

            return groups.map((indices, i) => (
                <div key={i} className="w-full mb-8 last:mb-0 relative">
                    <div className="absolute inset-0 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl pointer-events-none"></div>
                    <h4 className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gray-50 dark:bg-gray-900 px-4 font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider text-xs">
                        Block {i + 1}
                    </h4>
                    <div className="flex flex-wrap gap-6 justify-center p-8">
                        {indices.map(idx => renderPage(idx))}
                    </div>
                </div>
            ));
        }

        function divModeExtractAll(allSelected = true) {
            return (
                <div className="flex flex-wrap gap-6 justify-center w-full">
                    {pageImages.map((_, idx) => renderPage(idx, allSelected))}
                </div>
            );
        }
    };

    return (
        <div className="min-h-screen pb-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-6 pt-10">
                <ToolHeader
                    title="Split PDF"
                    description="Extract pages from your PDF or split it into multiple smaller PDFs."
                    breadcrumbs={[{ label: "PDF Tools", href: "/category/pdf" }, { label: "Split PDF" }]}
                />
            </div>
            <div className="max-w-[1400px] mx-auto px-6">
                {!file ? (
                    <div className="max-w-3xl mx-auto">
                        <ToolDropzone
                            onFiles={handleFiles}
                            accept=".pdf"
                            multiple={false}
                            label="Upload a PDF to split"
                            sublabel="or click to browse from your computer"
                            supportedText="Supported: .PDF"
                        />
                    </div>
                ) : resultFiles.length === 0 ? (
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start">
                        {/* LEFT PANEL - PREVIEW */}
                        <div className="flex-1 min-w-0 w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col h-[600px] lg:h-[800px] shadow-sm transform-gpu transition-all">

                            <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-t-2xl z-10 shrink-0 shadow-sm relative">
                                <div className="flex items-center gap-3 overflow-hidden min-w-0">
                                    <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg text-rose-600 dark:text-rose-400 shrink-0">
                                        <FileText className="w-5 h-5" />
                                    </div>
                                    <div className="min-w-0 overflow-hidden flex-1">
                                        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate m-0" title={file.name}>{file.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 m-0 hidden sm:block mt-1 truncate">
                                            {(file.size / 1024 / 1024).toFixed(2)} MB • {pageImages.length} Pages
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => { setFile(null); setPageImages([]); }}
                                    className="px-4 py-2 text-sm font-medium bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-lg transition-colors shrink-0"
                                >
                                    Change File
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                                {renderPreview()}
                            </div>
                        </div>

                        {/* RIGHT PANEL - SETTINGS */}
                        <div className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6 sticky top-6">

                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden flex flex-col">

                                {/* TABS */}
                                <div className="flex border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
                                    <button
                                        onClick={() => setTab("range")}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${tab === "range" ? "border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                    >
                                        <LayoutTemplate size={18} /> Split by range
                                    </button>
                                    <button
                                        onClick={() => setTab("extract")}
                                        className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 border-b-2 transition-colors ${tab === "extract" ? "border-rose-500 text-rose-600 dark:text-rose-400 bg-white dark:bg-gray-900" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}
                                    >
                                        <Layers size={18} /> Extract pages
                                    </button>
                                </div>

                                <div className="p-6">
                                    {tab === "range" && (
                                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-left-2 duration-300">

                                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                                <button onClick={() => setRangeMode("custom")} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${rangeMode === "custom" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Custom ranges</button>
                                                <button onClick={() => setRangeMode("fixed")} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${rangeMode === "fixed" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Fixed ranges</button>
                                            </div>

                                            {rangeMode === "custom" ? (
                                                <div className="flex flex-col gap-4">
                                                    <div className="max-h-[250px] overflow-y-auto pr-2 flex flex-col gap-3 custom-scrollbar">
                                                        {ranges.map((r, i) => (
                                                            <div key={r.id} className="flex items-center gap-3 group">
                                                                <div className="text-xs font-bold text-gray-400 w-16 uppercase tracking-wider">Range {i + 1}</div>
                                                                <div className="flex items-center flex-1 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-3 py-1.5 shadow-sm focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
                                                                    <input
                                                                        type="number" min={1} max={pageImages.length}
                                                                        value={r.from}
                                                                        onChange={(e) => updateRange(r.id, "from", e.target.value === "" ? "" : parseInt(e.target.value))}
                                                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-center text-gray-900 dark:text-white"
                                                                    />
                                                                    <span className="text-gray-400 px-2 font-medium">-</span>
                                                                    <input
                                                                        type="number" min={1} max={pageImages.length}
                                                                        value={r.to}
                                                                        onChange={(e) => updateRange(r.id, "to", e.target.value === "" ? "" : parseInt(e.target.value))}
                                                                        className="w-full bg-transparent border-none outline-none text-sm font-medium text-center text-gray-900 dark:text-white"
                                                                    />
                                                                </div>
                                                                <button
                                                                    onClick={() => removeRange(r.id)}
                                                                    disabled={ranges.length === 1}
                                                                    className={`p-2 rounded-lg transition-colors ${ranges.length === 1 ? 'opacity-30 cursor-not-allowed' : 'text-gray-400 hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-500/10'}`}
                                                                >
                                                                    <Trash2 size={16} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <button onClick={addRange} className="flex items-center justify-center gap-2 py-2.5 text-sm font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-xl transition-colors">
                                                        <Plus size={16} /> Add Range
                                                    </button>

                                                    <label className="flex items-center gap-3 mt-4 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={mergeRanges}
                                                            onChange={(e) => setMergeRanges(e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merge all ranges in one PDF file</span>
                                                    </label>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Split in page ranges of</span>
                                                        <input
                                                            type="number" min={1} max={pageImages.length}
                                                            value={fixedCount}
                                                            onChange={(e) => setFixedCount(e.target.value === "" ? "" : parseInt(e.target.value))}
                                                            className="w-20 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-rose-500 outline-none text-center font-bold text-gray-900 dark:text-white"
                                                        />
                                                    </div>
                                                </div>
                                            )}

                                        </div>
                                    )}

                                    {tab === "extract" && (
                                        <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-right-2 duration-300">
                                            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
                                                <button onClick={() => setExtractMode("all")} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${extractMode === "all" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Extract all pages</button>
                                                <button onClick={() => setExtractMode("select")} className={`flex-1 py-2 text-[13px] font-semibold rounded-lg transition-all ${extractMode === "select" ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm ring-1 ring-gray-900/5 dark:ring-white/10" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"}`}>Select pages</button>
                                            </div>

                                            {extractMode === "select" && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-2">
                                                        <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Pages to extract</label>
                                                        <input
                                                            type="text"
                                                            placeholder="e.g. 1, 5-8"
                                                            value={extractPagesStr}
                                                            onChange={(e) => setExtractPagesStr(e.target.value)}
                                                            className="w-full bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-3 placeholder-gray-400 text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 outline-none transition-shadow shadow-sm font-medium"
                                                        />
                                                    </div>

                                                    <label className="flex items-center gap-3 mt-2 cursor-pointer p-3 bg-gray-50 dark:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors border border-gray-100 dark:border-gray-700">
                                                        <input
                                                            type="checkbox"
                                                            checked={mergeExtract}
                                                            onChange={(e) => setMergeExtract(e.target.checked)}
                                                            className="w-5 h-5 rounded border-gray-300 text-rose-600 focus:ring-rose-600"
                                                        />
                                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Merge extracted pages into one PDF file</span>
                                                    </label>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800 rounded-xl p-4 flex gap-3 text-sky-800 dark:text-sky-300">
                                <div className="mt-0.5"><Check size={18} className="text-sky-500" /></div>
                                <p className="text-sm font-medium leading-relaxed">{info.text}</p>
                            </div>

                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl p-4 text-red-800 dark:text-red-300 text-sm font-medium">
                                    {error}
                                </div>
                            )}

                            <div className="mt-auto pt-6">
                                <ActionButton
                                    onClick={handleSplit}
                                    loading={loading}
                                    icon={Scissors}
                                    fullWidth
                                    className="py-4 text-lg bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-900/20"
                                >
                                    Split PDF
                                </ActionButton>
                            </div>
                        </div>
                    </div>
                ) : (
                    // RESULT PANEL (Replaces the whole editor when done)
                    <div className="max-w-4xl mx-auto flex flex-col gap-6 animate-in fade-in zoom-in-95 duration-500">
                        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-10 shadow-xl shadow-black/5 text-center flex flex-col items-center gap-6">

                            <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center">
                                <Check size={40} strokeWidth={3} />
                            </div>

                            <div>
                                <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-2">
                                    PDF Split Successfully
                                </h2>
                                <p className="text-gray-500 dark:text-gray-400 font-medium">
                                    Your file has been split into {resultFiles.length} chunk{resultFiles.length !== 1 ? 's' : ''}.
                                </p>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md mt-4">
                                {resultFiles.length > 1 && (
                                    <ActionButton onClick={downloadZip} icon={Archive} fullWidth className="py-3 shadow-lg bg-rose-600 hover:bg-rose-700">
                                        Download All (ZIP)
                                    </ActionButton>
                                )}
                                {resultFiles.length === 1 && (
                                    <ActionButton onClick={() => downloadBlob(resultFiles[0].blob, resultFiles[0].name)} icon={Download} fullWidth className="py-3 shadow-lg bg-rose-600 hover:bg-rose-700">
                                        Download PDF
                                    </ActionButton>
                                )}
                                <ActionButton onClick={() => setResultFiles([])} variant="secondary" icon={RefreshCw} className="py-3">
                                    Back to Editor
                                </ActionButton>
                            </div>

                        </div>

                        {/* Individual Files Listing */}
                        {resultFiles.length > 1 && (
                            <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-lg mb-4 text-gray-900 dark:text-white px-2">Generated Files</h3>
                                <div className="flex flex-col gap-2">
                                    {resultFiles.map((f, i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-colors group">
                                            <div className="flex items-center gap-3">
                                                <FileText className="text-rose-500 opacity-70 group-hover:opacity-100 transition-opacity" size={20} />
                                                <span className="font-medium text-gray-700 dark:text-gray-200">{f.name}</span>
                                            </div>
                                            <button
                                                onClick={() => downloadBlob(f.blob, f.name)}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-semibold rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 shadow-sm transition-all"
                                            >
                                                <Download size={16} /> <span className="hidden sm:inline">Download</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
