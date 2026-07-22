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

function isSquareMatrix(matrix) {
  if (!Array.isArray(matrix) || matrix.length < 2) return false;
  const n = matrix.length;
  return matrix.every(
    (row) =>
      Array.isArray(row) &&
      row.length === n &&
      row.every((v) => Number.isFinite(v))
  );
}

function minor(matrix, skipRow, skipCol) {
  return matrix
    .filter((_, r) => r !== skipRow)
    .map((row) => row.filter((_, c) => c !== skipCol));
}

/** Laplace expansion determinant (any n×n). */
export function determinant(matrix) {
  const n = matrix.length;
  if (n === 1) return matrix[0][0];
  if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];

  let det = 0;
  for (let c = 0; c < n; c++) {
    const sign = c % 2 === 0 ? 1 : -1;
    det += sign * matrix[0][c] * determinant(minor(matrix, 0, c));
  }
  return det;
}

function adjugate(matrix) {
  const n = matrix.length;
  const adj = Array.from({ length: n }, () => Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      const sign = (i + j) % 2 === 0 ? 1 : -1;
      // cofactor of (j,i) → transpose into adj[i][j]
      adj[i][j] = sign * determinant(minor(matrix, j, i));
    }
  }
  return adj;
}

/** Inverse of matrix mod 26, or null if not invertible. */
export function matrixInverse(matrix) {
  if (!isSquareMatrix(matrix)) return null;
  const det = determinant(matrix);
  const invDet = invMod(det, 26);
  if (invDet == null) return null;

  const adj = adjugate(matrix);
  const n = matrix.length;
  return adj.map((row) => row.map((v) => mod(invDet * v, 26)));
}

export function isInvertible(matrix) {
  if (!isSquareMatrix(matrix)) return false;
  return invMod(determinant(matrix), 26) != null;
}

function matrixMultiplyVec(M, v) {
  const n = M.length;
  const out = Array(n).fill(0);
  for (let r = 0; r < n; r++) {
    let sum = 0;
    for (let c = 0; c < n; c++) sum += M[r][c] * v[c];
    out[r] = mod(sum, 26);
  }
  return out;
}

function cleanLetters(text) {
  return (text || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function transform(text, matrix, isDecrypt) {
  if (!isSquareMatrix(matrix)) {
    throw new Error("Key must be a square n×n matrix with n ≥ 2.");
  }

  const n = matrix.length;
  const m = isDecrypt ? matrixInverse(matrix) : matrix;
  if (!m) throw new Error("Matrix is not invertible mod 26. Choose a different key.");

  const letters = cleanLetters(text);
  let padded = letters;
  while (padded.length % n !== 0) padded += "X";

  let out = "";
  for (let i = 0; i < padded.length; i += n) {
    const P = [];
    for (let j = 0; j < n; j++) P.push(padded.charCodeAt(i + j) - 65);
    const C = matrixMultiplyVec(m, P);
    for (let j = 0; j < n; j++) out += String.fromCharCode(65 + C[j]);
  }
  return out;
}

export function encrypt(text, matrix) {
  return transform(text, matrix, false);
}

export function decrypt(text, matrix) {
  return transform(text, matrix, true);
}
