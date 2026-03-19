function runQpdfWorker({ action, inputBytes, userPassword, ownerPassword }) {
  const worker = new Worker("/qpdf-worker.js");
  const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  function normalizeWorkerError(err) {
    if (!err) return "Operation failed";
    if (typeof err === "string") return err;
    if (err instanceof Error) return err.message || "Operation failed";
    try {
      return JSON.stringify(err);
    } catch {
      return String(err);
    }
  }

  function toUserFacingMessage(message) {
    const m = (message || "").toLowerCase();
    if (
      m.includes("password") &&
      (m.includes("invalid") || m.includes("incorrect") || m.includes("wrong") || m.includes("needed") || m.includes("required"))
    ) {
      return "Incorrect password (or password required).";
    }
    return message || "Operation failed";
  }

  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      worker.terminate();
      reject(new Error("Operation timed out. Try a smaller PDF."));
    }, 3 * 60 * 1000);

    worker.onmessage = (event) => {
      const data = event.data;
      if (!data || data.id !== id) return;
      clearTimeout(timeout);
      worker.terminate();
      if (data.ok) resolve(data.outputBytes);
      else reject(new Error(toUserFacingMessage(normalizeWorkerError(data.error))));
    };

    worker.onerror = () => {
      clearTimeout(timeout);
      worker.terminate();
      reject(new Error("PDF worker crashed"));
    };

    worker.postMessage(
      { id, action, inputBytes, userPassword, ownerPassword },
      [inputBytes]
    );
  });
}

export async function encryptPdfQpdf(file, password) {
  const inputBytes = await file.arrayBuffer();
  const output = await runQpdfWorker({
    action: "encrypt",
    inputBytes,
    userPassword: password,
    ownerPassword: password,
  });
  return new Blob([output], { type: "application/pdf" });
}

export async function decryptPdfQpdf(file, password) {
  const inputBytes = await file.arrayBuffer();
  const output = await runQpdfWorker({
    action: "decrypt",
    inputBytes,
    userPassword: password || "",
  });
  return new Blob([output], { type: "application/pdf" });
}

