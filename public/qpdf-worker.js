/* eslint-disable no-restricted-globals */

// Classic worker so bundlers don't attempt Node polyfills.
// Assets are copied to /public/wasm by postinstall.

const WASM_BASE = "/wasm/";

let qpdfPromise;

async function getQpdf() {
  if (qpdfPromise) return qpdfPromise;

  qpdfPromise = (async () => {
    importScripts(WASM_BASE + "qpdf.js");

    // `qpdf.js` defines a global `Module` factory function.
    const createModule = self.Module;
    if (typeof createModule !== "function") {
      throw new Error("QPDF module factory not found");
    }

    return await createModule({
      locateFile: (path) => WASM_BASE + path,
      noInitialRun: true,
    });
  })();

  return qpdfPromise;
}

self.onmessage = async (event) => {
  const { id, action, inputBytes, userPassword, ownerPassword } = event.data || {};

  try {
    const qpdf = await getQpdf();

    const inPath = `/in-${id}.pdf`;
    const outPath = `/out-${id}.pdf`;

    qpdf.FS.writeFile(inPath, new Uint8Array(inputBytes));

    let args;
    if (action === "encrypt") {
      const user = userPassword || "";
      const owner = ownerPassword || user;

      // 256-bit encryption, allow everything by default (we can tighten later)
      args = ["--encrypt", user, owner, "256", "--", inPath, outPath];
    } else if (action === "decrypt") {
      const pass = userPassword || "";
      args = ["--password=" + pass, "--decrypt", "--", inPath, outPath];
    } else {
      throw new Error("Unknown action");
    }

    qpdf.callMain(args);

    let outBytes;
    try {
      outBytes = qpdf.FS.readFile(outPath);
    } catch (e) {
      // When qpdf fails (commonly wrong password), it may not create the output file.
      // Emscripten FS throws ErrnoError with code 44 (ENOENT).
      if (e && e.name === "ErrnoError" && e.xa === 44) {
        if (action === "decrypt") {
          throw new Error("Incorrect password (or password required).");
        }
        throw new Error("Failed to generate output PDF.");
      }
      throw e;
    }

    try {
      qpdf.FS.unlink(inPath);
      qpdf.FS.unlink(outPath);
    } catch {}

    self.postMessage({ id, ok: true, outputBytes: outBytes.buffer }, [outBytes.buffer]);
  } catch (err) {
    let message;
    if (typeof err === "string") message = err;
    else if (err && typeof err.message === "string") message = err.message;
    else {
      try {
        message = JSON.stringify(err);
      } catch {
        message = String(err);
      }
    }

    self.postMessage({
      id,
      ok: false,
      error: message,
    });
  }
};

