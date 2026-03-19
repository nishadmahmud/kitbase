/* eslint-disable no-restricted-globals */

// Classic worker (importScripts) so bundlers don't try to polyfill Node modules.
// We copy `gs.js` + `gs.wasm` into /public/wasm at install time.

const VENDOR_BASE = "/wasm/";

let gsPromise;

function presetToPdfSettings(preset) {
  switch (preset) {
    case "screen":
      return "/screen";
    case "printer":
      return "/printer";
    case "prepress":
      return "/prepress";
    case "ebook":
    default:
      return "/ebook";
  }
}

async function getGhostscript() {
  if (gsPromise) return gsPromise;

  gsPromise = (async () => {
    // Emscripten UMD attaches to `exports.Module` in "exports object" environments.
    self.exports = {};

    const locateFile = (path) => VENDOR_BASE + path;

    // Tell Emscripten where to fetch gs.wasm from (some builds read from global Module,
    // others only honor overrides passed to the factory function).
    self.Module = { locateFile };

    importScripts(VENDOR_BASE + "gs.js");

    const createModule = self.exports && self.exports.Module;
    delete self.exports;

    if (typeof createModule !== "function") {
      throw new Error("Ghostscript module factory not found");
    }

    // The factory returns a promise-like ready module in this build.
    // Pass locateFile override so gs.wasm is loaded from /wasm/gs.wasm.
    return await createModule({ locateFile });
  })();

  return gsPromise;
}

self.onmessage = async (event) => {
  const { id, inputBytes, preset } = event.data || {};

  try {
    const gs = await getGhostscript();

    const inPath = `/in-${id}.pdf`;
    const outPath = `/out-${id}.pdf`;

    gs.FS.writeFile(inPath, new Uint8Array(inputBytes));

    const pdfSettings = presetToPdfSettings(preset);
    const args = [
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=${pdfSettings}`,
      "-dDetectDuplicateImages=true",
      "-dCompressFonts=true",
      "-dNOPAUSE",
      "-dBATCH",
      "-dQUIET",
      `-sOutputFile=${outPath}`,
      inPath,
    ];

    gs.callMain(args);

    const outBytes = gs.FS.readFile(outPath);

    try {
      gs.FS.unlink(inPath);
      gs.FS.unlink(outPath);
    } catch {}

    self.postMessage({ id, ok: true, outputBytes: outBytes.buffer }, [outBytes.buffer]);
  } catch (err) {
    self.postMessage({
      id,
      ok: false,
      error: err instanceof Error ? err.message : String(err),
    });
  }
};

