"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight, Copy, Eraser, RotateCcw } from "lucide-react";
import ToolHeader from "@/components/tool/ToolHeader";
import ToolActions, { ActionButton } from "@/components/tool/ToolActions";

function normalizeKey(key) {
  const cleaned = (key || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .replace(/J/g, "I");
  const seen = new Set();
  let out = "";
  for (const ch of cleaned) {
    if (!seen.has(ch)) {
      seen.add(ch);
      out += ch;
    }
  }
  return out;
}

function buildSquare(key) {
  const k = normalizeKey(key);
  const seen = new Set(k.split(""));
  let alpha = "";
  for (let i = 0; i < 26; i++) {
    const ch = String.fromCharCode(65 + i);
    if (ch === "J") continue;
    if (!seen.has(ch)) alpha += ch;
  }
  const square = (k + alpha).slice(0, 25);
  const pos = new Map();
  for (let i = 0; i < 25; i++) pos.set(square[i], i);
  return { square, pos };
}

function chunkDigraphs(text) {
  const cleaned = (text || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "")
    .replace(/J/g, "I");
  const pairs = [];
  let i = 0;
  while (i < cleaned.length) {
    const a = cleaned[i];
    const b = cleaned[i + 1];
    if (!b) {
      pairs.push([a, "X"]);
      break;
    }
    if (a === b) {
      pairs.push([a, "X"]);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }
  return pairs;
}

function playfairTransform(text, key, decrypt) {
  const { square, pos } = buildSquare(key);
  if (!square) return "";

  const pairs = chunkDigraphs(text);
  const outPairs = pairs.map(([a, b]) => {
    const ia = pos.get(a);
    const ib = pos.get(b);
    if (ia == null || ib == null) return [a, b];
    const ra = Math.floor(ia / 5), ca = ia % 5;
    const rb = Math.floor(ib / 5), cb = ib % 5;

    if (ra === rb) {
      const delta = decrypt ? -1 : 1;
      const na = square[ra * 5 + ((ca + delta + 5) % 5)];
      const nb = square[rb * 5 + ((cb + delta + 5) % 5)];
      return [na, nb];
    }
    if (ca === cb) {
      const delta = decrypt ? -1 : 1;
      const na = square[((ra + delta + 5) % 5) * 5 + ca];
      const nb = square[((rb + delta + 5) % 5) * 5 + cb];
      return [na, nb];
    }
    // rectangle swap columns
    const na = square[ra * 5 + cb];
    const nb = square[rb * 5 + ca];
    return [na, nb];
  });

  return outPairs.map((p) => p.join("")).join("");
}

export default function PlayfairCipherClient() {
  const [mode, setMode] = useState("encrypt");
  const [key, setKey] = useState("MONARCHY");
  const [input, setInput] = useState("INSTRUMENTS");

  const { square } = useMemo(() => buildSquare(key), [key]);
  const output = useMemo(() => playfairTransform(input, key, mode === "decrypt"), [input, key, mode]);

  const demoPlaintext = "INSTRUMENTS";
  const demoKey = "MONARCHY";

  const setModeSmart = (nextMode) => {
    if (nextMode === mode) return;
    setInput(output);
    setMode(nextMode);
  };

  const demo = () => {
    setKey(demoKey);
    if (mode === "encrypt") {
      setInput(demoPlaintext);
      return;
    }
    setInput(playfairTransform(demoPlaintext, demoKey, false));
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
          title="Playfair Cipher"
          description="Encrypt or decrypt using a 5×5 digraph cipher square generated from a keyword."
          breadcrumbs={[{ label: "Cryptography", href: "/category/crypto" }, { label: "Playfair Cipher" }]}
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
                Keyword
              </label>
              <input
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="e.g. MONARCHY"
                className="w-56 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-xl px-3 py-2 text-gray-900 dark:text-gray-200 outline-none focus:border-emerald-500/50 transition-colors"
              />
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 grid grid-cols-1 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Input
                </label>
                <textarea
                  rows={5}
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
                  rows={5}
                  value={output}
                  readOnly
                  className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl px-4 py-3 text-gray-900 dark:text-gray-200 outline-none resize-y"
                />
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 lg:sticky lg:top-24">
              <div className="flex items-baseline justify-between gap-3 mb-3">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  5×5 Key Square
                </div>
                <div className="text-[11px] text-gray-400">I/J combined</div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 36px)", gap: "6px" }}>
                {Array.from({ length: 25 }).map((_, idx) => {
                  const ch = square[idx] || "";
                  return (
                    <div
                      key={idx}
                      style={{ width: 36, height: 36 }}
                      className="rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center font-bold text-gray-900 dark:text-gray-100 select-none text-sm"
                    >
                      {ch}
                    </div>
                  );
                })}
              </div>

              <div className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                Tip: try keyword <span className="font-mono">MONARCHY</span> and input <span className="font-mono">INSTRUMENTS</span>.
              </div>
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
            Input is normalized (A–Z, J→I). Repeated letters in a pair are split with X; odd length is padded with X.
          </div>
        </div>
      </div>
    </div>
  );
}

