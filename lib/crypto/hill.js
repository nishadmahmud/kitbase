function mod(n, m) {
  return ((n % m) + m) % m;
}

function egcd(a, b) {
  if (b === 0) return { g: a, x: 1, y: 0 };
  const { g, x, y } = egcd(b, a % b);
  return { g, x: y, y: x - Math.floor(a / b) * y };
}

function invMod(a, m) {
  const { g, x } = egcd(mod(a, m), m);
  if (g !== 1) return null;
  return mod(x, m);
}

function matrixDet2(m) {
  return m[0][0] * m[1][1] - m[0][1] * m[1][0];
}

function matrixInv2(m) {
  const det = matrixDet2(m);
  const invDet = invMod(det, 26);
  if (invDet == null) return null;
  return [
    [mod(invDet * m[1][1], 26), mod(invDet * -m[0][1], 26)],
    [mod(invDet * -m[1][0], 26), mod(invDet * m[0][0], 26)],
  ];
}

function cleanLetters(text) {
  return (text || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function transform(text, matrix, isDecrypt) {
  const letters = cleanLetters(text);
  const m = isDecrypt ? matrixInv2(matrix) : matrix;
  if (!m) throw new Error("Matrix is not invertible mod 26. Choose a different key.");

  const padded = letters.length % 2 === 0 ? letters : letters + "X";
  let out = "";

  for (let i = 0; i < padded.length; i += 2) {
    const a = padded.charCodeAt(i) - 65;
    const b = padded.charCodeAt(i + 1) - 65;
    const x = mod(m[0][0] * a + m[0][1] * b, 26);
    const y = mod(m[1][0] * a + m[1][1] * b, 26);
    out += String.fromCharCode(65 + x) + String.fromCharCode(65 + y);
  }
  return out;
}

export function encrypt(text, matrix) {
  return transform(text, matrix, false);
}

export function decrypt(text, matrix) {
  return transform(text, matrix, true);
}
