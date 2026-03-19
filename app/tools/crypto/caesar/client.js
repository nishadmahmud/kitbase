"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Eraser, RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

function mod(n, m) {
  return ((n % m) + m) % m;
}

function caesarTransform(text, shift) {
  const s = mod(shift, 26);
  let out = "";
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;
    if (!isUpper && !isLower) {
      out += ch;
      continue;
    }
    const base = isUpper ? 65 : 97;
    const idx = code - base;
    out += String.fromCharCode(base + mod(idx + s, 26));
  }
  return out;
}

export default function CaesarCipherClient() {
  const [mode, setMode] = useState("encrypt");
  const [shiftInput, setShiftInput] = useState("3");
  const [input, setInput] = useState("Attack at dawn!");

  const output = useMemo(() => {
    const parsed = Number.parseInt(shiftInput, 10);
    const s = Number.isFinite(parsed) ? parsed : 0;
    return mode === "encrypt" ? caesarTransform(input, s) : caesarTransform(input, -s);
  }, [input, mode, shiftInput]);

  const demoPlaintext = "Attack at dawn!";

  const setModeSmart = (nextMode) => {
    if (nextMode === mode) return;
    setInput(output);
    setMode(nextMode);
  };

  const demo = () => {
    setShiftInput("3");
    if (mode === "encrypt") {
      setInput(demoPlaintext);
      return;
    }
    setInput(caesarTransform(demoPlaintext, 3));
  };

  const swapModeAndInput = () => {
    setModeSmart(mode === "encrypt" ? "decrypt" : "encrypt");
  };

  const copyOutput = async () => {
    try {
      await navigator.clipboard.writeText(output || "");
    } catch {
      // no-op: clipboard may be blocked
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-950 pb-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <ToolHeader
          title="Caesar Cipher"
          description="Encrypt or decrypt text by shifting letters through the alphabet."
          breadcrumbs={[{ label: "Cryptography", href: "/category/crypto" }, { label: "Caesar Cipher" }]}
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

            <div className="flex items-center gap-3">
              <label className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Shift
              </label>
              <input
                type="number"
                value={shiftInput}
                onChange={(e) => setShiftInput(e.target.value)}
                onBlur={() => {
                  // Normalize on blur (optional), but don't fight the user while typing.
                  if (shiftInput.trim() === "" || shiftInput === "-" || shiftInput === "+") return;
                  const parsed = Number.parseInt(shiftInput, 10);
                  if (!Number.isFinite(parsed)) return;
                  setShiftInput(String(parsed));
                }}
                className="w-24 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-200 outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Input
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
            Works on A–Z letters only; punctuation and spaces are preserved.
          </div>
        </div>
      </div>
    </div>
  );
}

