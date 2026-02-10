import { CheckCircle, XCircle, Download } from "lucide-react";

export default function ToolResult({ success, message, downloadUrl, downloadName }) {
    return (
        <div
            className={`mt-6 p-6 rounded-2xl border ${success
                    ? "border-emerald-500/20 bg-emerald-500/5"
                    : "border-red-500/20 bg-red-500/5"
                }`}
        >
            <div className="flex items-center gap-3">
                {success ? (
                    <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                ) : (
                    <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                )}
                <p className={`text-[15px] m-0 font-medium ${success ? "text-emerald-400" : "text-red-500"}`}>
                    {message}
                </p>
            </div>

            {success && downloadUrl && (
                <div className="mt-4 flex justify-center">
                    <a
                        href={downloadUrl}
                        download={downloadName || "download"}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-gray-950 font-semibold text-sm rounded-xl hover:bg-emerald-400 transition-colors no-underline"
                    >
                        <Download className="w-4 h-4" /> Download
                    </a>
                </div>
            )}
        </div>
    );
}
