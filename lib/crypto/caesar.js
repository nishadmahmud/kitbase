function mod(n, m) {
  return ((n % m) + m) % m;
}

function transform(text, shift) {
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

export function encrypt(text, shift) {
  return transform(text, Number.isFinite(shift) ? shift : 0);
}

export function decrypt(text, shift) {
  return transform(text, -(Number.isFinite(shift) ? shift : 0));
}
