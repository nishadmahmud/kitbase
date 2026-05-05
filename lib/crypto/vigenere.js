function isLetterCode(code) {
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122);
}

function charToA0(code) {
  const upper = code >= 65 && code <= 90;
  const base = upper ? 65 : 97;
  return { base, idx: code - base };
}

function normalizeKey(key) {
  return (key || "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function transform(text, key, isDecrypt) {
  const k = normalizeKey(key);
  if (!k) return "";

  let out = "";
  let ki = 0;
  for (const ch of text) {
    const code = ch.charCodeAt(0);
    if (!isLetterCode(code)) {
      out += ch;
      continue;
    }
    const { base, idx } = charToA0(code);
    const kShift = k.charCodeAt(ki % k.length) - 65;
    const shift = isDecrypt ? -kShift : kShift;
    const next = (idx + shift + 26 * 10) % 26;
    out += String.fromCharCode(base + next);
    ki += 1;
  }
  return out;
}

export function encrypt(text, key) {
  return transform(text, key, false);
}

export function decrypt(text, key) {
  return transform(text, key, true);
}
