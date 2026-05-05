"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Eraser, RotateCcw, AlertTriangle } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { encrypt, decrypt } from "@/lib/crypto/hill";

function gcd(a, b) {
  let x = Math.abs(a), y = Math.abs(b);
  while (y) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function parseMatrix(text) {
  const parts = (text || "")
    .split(/[\s,]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => Number(p));
  if (parts.length !== 4 || parts.some((n) => !Number.isFinite(n))) return null;
  return [
    [parts[0], parts[1]],
    [parts[2], parts[3]],
  ];
}

function matrixDet2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

export default function HillCipherClient() {
  const [mode, setMode] = useState("encrypt");
  const [matrixText, setMatrixText] = useState("3 3 2 5");
  const [input, setInput] = useState("HELP");

  const matrix = useMemo(() => parseMatrix(matrixText), [matrixText]);
  const matrixOk = useMemo(() => {
    if (!matrix) return false;
    const det = matrixDet2(matrix);
    return gcd(det, 26) === 1;
  }, [matrix]);

  const output = useMemo(() => {
    if (!matrix) return "";
    try {
      return mode === "encrypt" ? encrypt(input, matrix) : decrypt(input, matrix);
    } catch {
      return "";
    }
  }, [input, matrix, mode]);

  const demoPlaintext = "HELP";
  const demoMatrixText = "3 3 2 5";

  const setModeSmart = (nextMode) => {
    if (nextMode === mode) return;
    setInput(output);
    setMode(nextMode);
  };

  const demo = () => {
    setMatrixText(demoMatrixText);
    if (mode === "encrypt") {
      setInput(demoPlaintext);
      return;
    }
    const m = parseMatrix(demoMatrixText);
    if (!m) return;
    setInput(encrypt(demoPlaintext, m));
  };

  const swapModeAndInput = () => setModeSmart(mode === "encrypt" ? "decrypt" : "encrypt");

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
    } catch {
      // Clipboard may be blocked; ignore.
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <ToolHeader
          title="Hill Cipher (2×2)"
          description="Encrypt or decrypt using a 2×2 matrix over the alphabet (mod 26)."
          breadcrumbs={[{ label: "Cryptography", href: "/category/crypto" }, { label: "Hill Cipher" }]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              <button
                onClick={() => setModeSmart("encrypt")}
                className={`px-4 py-2 text-sm font-semibold border-none cursor-pointer ${
                  mode === "encrypt"
                    ? "bg-emerald-500 text-white"
                    : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                Encrypt
              </button>
              <button
                onClick={() => setModeSmart("decrypt")}
                className={`px-4 py-2 text-sm font-semibold border-none cursor-pointer ${
                  mode === "decrypt"
                    ? "bg-emerald-500 text-white"
                    : "bg-transparent text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                }`}
              >
                Decrypt
              </button>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Key matrix (a b c d)
              </label>
              <input
                value={matrixText}
                onChange={(e) => setMatrixText(e.target.value)}
                placeholder="e.g. 3 3 2 5"
                className="w-64 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-200 outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          {!matrixOk && (
            <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 mt-0.5" />
              <div>
                <div className="font-semibold">Matrix key must be invertible mod 26</div>
                <div className="text-xs mt-1">
                  Choose a matrix where \(gcd(det, 26) = 1\). Example that works: <span className="font-mono">3 3 2 5</span>.
                </div>
              </div>
            </div>
          )}

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Input (letters only)
              </label>
              <textarea
                rows={6}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-200 outline-none focus:border-emerald-500/50 transition-colors resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Output
              </label>
              <textarea
                rows={6}
                value={output}
                readOnly
                className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-200 outline-none resize-y"
              />
            </div>
          </div>

          <div className="mt-5">
            <ToolActions>
              <ActionButton
                onClick={swapModeAndInput}
                icon={ArrowLeftRight}
              >
                Swap & reverse
              </ActionButton>
              <ActionButton onClick={copyOutput} icon={Copy}>
                Copy output
              </ActionButton>
              <ActionButton variant="secondary" onClick={() => setInput("")} icon={Eraser}>
                Clear
              </ActionButton>
              <ActionButton variant="secondary" onClick={demo} icon={RotateCcw}>
                Load demo
              </ActionButton>
            </ToolActions>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
            Input is normalized to A–Z and padded with X if needed to make even length.
          </div>
        </div>
      </div>
    </div>
  );
}

