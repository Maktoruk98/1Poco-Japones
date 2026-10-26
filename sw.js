// Primero intenta la red (para recibir siempre la última versión) y,
// si no hay conexión, sirve la copia guardada.
const CACHE = "upmj-v10";
const FILES = ["./", "index.html", "styles.css", "data.js", "firebase-config.js", "line.js", "app.js", "cloud.js", "icon.svg", "manifest.webmanifest", "intro.mp3"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener("fetch", (e) => {
  // Solo cacheamos nuestros archivos y las librerías de Firebase; las llamadas
  // a la nube (inicio de sesión, base de datos) van siempre directas.
  const url = new URL(e.request.url);
  if (e.request.method !== "GET" || (url.origin !== location.origin && !["www.gstatic.com", "fonts.googleapis.com", "fonts.gstatic.com"].includes(url.hostname))) return;
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(e.request, copy));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
