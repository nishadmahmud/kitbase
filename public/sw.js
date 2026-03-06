const CACHE_NAME = "kitbase-v2";

// Precache main shell + all tool routes so the app is broadly usable offline
const PRECACHE_URLS = [
  "/",
  "/logo.svg",
  "/icon.svg",
  "/globe.svg",
  "/og-image.png",
  "/about",
  "/privacy",
  "/terms",
  "/all-tools",
  "/category/pdf",
  "/category/image",
  "/category/dev",
  "/category/text",
  "/category/design",
  "/category/security",
  "/category/calculator",
  "/category/productivity",
  "/tools/calculator/gpa",
  "/tools/calculator/interest",
  "/tools/calculator/loan",
  "/tools/calculator/percentage",
  "/tools/calculator/unit",
  "/tools/design/color-converter",
  "/tools/design/gradient-generator",
  "/tools/dev/base64",
  "/tools/dev/diff",
  "/tools/dev/html-entities",
  "/tools/dev/json-csv",
  "/tools/dev/json-formatter",
  "/tools/dev/qr-code",
  "/tools/dev/regex-tester",
  "/tools/dev/sql-formatter",
  "/tools/dev/url-encoder",
  "/tools/dev/xml-formatter",
  "/tools/file/checksum",
  "/tools/file/metadata",
  "/tools/image/compress",
  "/tools/image/convert",
  "/tools/image/crop",
  "/tools/image/filters",
  "/tools/image/resize",
  "/tools/markdown/to-pdf",
  "/tools/markdown/viewer",
  "/tools/pdf/compress",
  "/tools/pdf/from-image",
  "/tools/pdf/merge",
  "/tools/pdf/protect",
  "/tools/pdf/reorder",
  "/tools/pdf/sign",
  "/tools/pdf/split",
  "/tools/pdf/to-image",
  "/tools/pdf/unlock",
  "/tools/pdf/watermark",
  "/tools/productivity/pomodoro",
  "/tools/productivity/stopwatch",
  "/tools/productivity/world-clock",
  "/tools/security/hash-generator",
  "/tools/security/password-generator",
  "/tools/security/token-generator",
  "/tools/text/case-converter",
  "/tools/text/cleaner",
  "/tools/text/lorem",
  "/tools/text/transform",
  "/tools/text/word-counter",
  "/tools/visualization/chart-generator",
  "/tools/visualization/eda",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Skip non-same-origin requests (analytics, fonts CDN, etc.)
  if (url.origin !== self.location.origin) return;

  // Static assets (JS, CSS, images, fonts) → cache-first
  if (
    url.pathname.match(
      /\.(js|css|png|jpg|jpeg|svg|gif|webp|ico|woff2?|ttf|eot)$/
    )
  ) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
      )
    );
    return;
  }

  // HTML navigations → network-first with cache fallback
  if (request.headers.get("accept")?.includes("text/html")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
});
