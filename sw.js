// ═══════════════════════════════════════════════════════════════════
// SAKO Battery Pro · Service Worker v1.0.0
// Strategy:
//   - precache of shell on install (real offline from first load)
//   - cache-first for shell assets
//   - network-first for everything else, fallback to cache
//   - skipWaiting + clientsClaim so first update takes effect
//     without manual reload
// ═══════════════════════════════════════════════════════════════════

const SW_VERSION = 'sako-v1.0.0';
const SHELL_CACHE = `sako-shell-${SW_VERSION}`;
const RUNTIME_CACHE = `sako-runtime-${SW_VERSION}`;

const SHELL_ASSETS = [
    './',
    './index.html',
    './manifest.webmanifest',
    './assets/css/styles.css',
    './assets/js/app.js',
    './assets/icons/icon.svg',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/icon-512-maskable.png'
];

// ─── INSTALL ──────────────────────────────────────────────────
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(SHELL_CACHE).then((cache) => {
            // addAll fails if ANY single URL 404s. We use add one-by-one so
            // a missing icon does not break the whole installation.
            return Promise.all(
                SHELL_ASSETS.map((url) =>
                    cache.add(url).catch((err) => {
                        console.warn('[SW] precache fail:', url, err);
                    })
                )
            );
        }).then(() => self.skipWaiting())
    );
});

// ─── ACTIVATE: clean old caches ───────────────────────────
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== SHELL_CACHE && k !== RUNTIME_CACHE)
                    .map((k) => caches.delete(k))
            )
        ).then(() => self.clients.claim())
    );
});

// ─── FETCH ─────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // GET only · ignore non-http(s) (chrome-extension://, blob:, data:, etc.)
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

    // Cache-first for shell assets (same-origin, navigation, scripts, css)
    const isShellAsset =
        req.mode === 'navigate' ||
        (req.destination === 'script') ||
        (req.destination === 'style') ||
        (req.destination === 'image') ||
        (req.destination === 'manifest') ||
        url.pathname.endsWith('/sw.js');

    if (isShellAsset) {
        event.respondWith(
            caches.match(req).then((cached) => {
                if (cached) return cached;
                return fetch(req).then((res) => {
                    // Cache valid responses for the next visit
                    if (res && res.status === 200) {
                        const copy = res.clone();
                        caches.open(SHELL_CACHE).then((c) => c.put(req, copy));
                    }
                    return res;
                }).catch(() => {
                    // Offline fallback for navigation → return cached index.html
                    if (req.mode === 'navigate') {
                        return caches.match('./index.html');
                    }
                });
            })
        );
        return;
    }

    // Everything else: network-first, fallback to cache, fallback to 503
    event.respondWith(
        fetch(req).then((res) => {
            if (res && res.status === 200 && req.url.startsWith(self.location.origin)) {
                const copy = res.clone();
                caches.open(RUNTIME_CACHE).then((c) => c.put(req, copy));
            }
            return res;
        }).catch(() =>
            caches.match(req).then((cached) => cached || new Response('Offline', { status: 503 }))
        )
    );
});

// ─── Message from page: force skipWaiting ────────────────────
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});
