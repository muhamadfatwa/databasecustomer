const CACHE = 'furnicrm-v2';
const FILES = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];

// Install: cache semua file
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)));
  self.skipWaiting(); // langsung aktif tanpa tunggu tab ditutup
});

// Activate: hapus cache lama
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()) // ambil alih semua tab
  );
});

// Fetch: network first, fallback ke cache
self.addEventListener('fetch', e => {
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Simpan response terbaru ke cache
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
