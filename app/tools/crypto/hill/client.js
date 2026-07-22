"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Eraser, RotateCcw, AlertTriangle } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";
import { encrypt, decrypt, isInvertible, determinant } from "@/lib/crypto/hill";

function parseMatrix(text) {
  const parts = (text || "")
    .split(/[\s,]+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => Number(p));

  if (parts.length < 4 || parts.some((n) => !Number.isFinite(n))) return null;

  const n = Math.round(Math.sqrt(parts.length));
  if (n < 2 || n * n !== parts.length) return null;

  const matrix = [];
  for (let r = 0; r < n; r++) {
    matrix.push(parts.slice(r * n, r * n + n));
  }
  return matrix;
}

export default function HillCipherClient() {
  const [mode, setMode] = useState("encrypt");
  const [matrixText, setMatrixText] = useState("3 3 2 5");
  const [input, setInput] = useState("HELP");

  const matrix = useMemo(() => parseMatrix(matrixText), [matrixText]);
  const matrixOk = useMemo(() => isInvertible(matrix), [matrix]);
  const n = matrix?.length ?? 0;
  const det = useMemo(() => (matrix ? determinant(matrix) : null), [matrix]);

  const output = useMemo(() => {
    if (!matrix || !matrixOk) return "";
    try {
      return mode === "encrypt" ? encrypt(input, matrix) : decrypt(input, matrix);
    } catch {
      return "";
    }
  }, [input, matrix, matrixOk, mode]);

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
          title="Hill Cipher"
          description="Encrypt or decrypt using an n×n key matrix over the alphabet (mod 26)."
          breadcrumbs={[{ label: "Cryptography", href: "/category/crypto" }, { label: "Hill Cipher" }]}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10 flex flex-col gap-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm dark:shadow-2xl dark:shadow-black/20 transition-colors">
          <div className="flex flex-wrap items-start justify-between gap-3">
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

            <div className="flex flex-col gap-1 flex-1 min-w-[16rem] max-w-md">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Key matrix ({n >= 2 ? `${n}×${n}` : "n×n"} — enter n² numbers)
              </label>
              <textarea
                rows={4}
                value={matrixText}
                onChange={(e) => setMatrixText(e.target.value)}
                placeholder={"3 3 2 5\nor one row per line:\n6 24 1\n13 16 10\n20 17 15"}
                className="w-full bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-200 outline-none focus:border-emerald-500/50 transition-colors font-mono text-sm resize-y"
              />
            </div>
          </div>

          {!matrix && matrixText.trim() !== "" && (
            <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">Could not parse a square matrix</div>
                <div className="text-xs mt-1">
                  Enter exactly n² numbers (n ≥ 2), spaces or new lines between them. Example 3×3:
                  <pre className="mt-1 font-mono whitespace-pre-wrap">{`6 24 1
13 16 10
20 17 15`}</pre>
                </div>
              </div>
            </div>
          )}

          {matrix && !matrixOk && (
            <div className="mt-4 flex items-start gap-2 text-sm text-amber-700 dark:text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4">
              <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />
              <div>
                <div className="font-semibold">Matrix is not invertible mod 26</div>
                <div className="text-xs mt-1">
                  Your {n}×{n} matrix was read fine (rows/new lines are OK), but{" "}
                  <span className="font-mono">det = {det}</span> and{" "}
                  <span className="font-mono">gcd(det, 26)</span> must be 1.
                  Try a working 3×3:
                  <pre className="mt-1 font-mono whitespace-pre-wrap">{`6 24 1
13 16 10
20 17 15`}</pre>
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
            Input is normalized to A–Z and padded with X so length is a multiple of n
            {n >= 2 ? ` (${n})` : ""}.
          </div>
        </div>
      </div>
    </div>
  );
}
