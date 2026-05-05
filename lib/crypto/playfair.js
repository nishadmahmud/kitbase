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

function transform(text, key, isDecrypt) {
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
      const delta = isDecrypt ? -1 : 1;
      const na = square[ra * 5 + ((ca + delta + 5) % 5)];
      const nb = square[rb * 5 + ((cb + delta + 5) % 5)];
      return [na, nb];
    }
    if (ca === cb) {
      const delta = isDecrypt ? -1 : 1;
      const na = square[((ra + delta + 5) % 5) * 5 + ca];
      const nb = square[((rb + delta + 5) % 5) * 5 + cb];
      return [na, nb];
    }
    const na = square[ra * 5 + cb];
    const nb = square[rb * 5 + ca];
    return [na, nb];
  });

  return outPairs.map((p) => p.join("")).join("");
}

export function encrypt(text, key) {
  return transform(text, key, false);
}

export function decrypt(text, key) {
  return transform(text, key, true);
}
