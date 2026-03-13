--Service Worker for Citizen Witness Kenya
// Offline caching and background sync for evidence uploads

const CACHE_NAME = 'citizen-witness-v2';
const APP_SHELL = [
    '/',
    '/index.html',
];

// Install: cache app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
    );
    self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
        )
    );
    self.clients.claim();
});

// Fetch: serve from cache, network fallback
self.addEventListener('fetch', (event) => {
    // Don't intercept Supabase or Cloudinary API calls
    const url = new URL(event.request.url);
    if (url.hostname.includes('supabase.co') ||
        url.hostname.includes('cloudinary.com') ||
        url.hostname.includes('nominatim') ||
        url.pathname.startsWith('/api')) {
        return;
    }
    event.respondWith(
        caches.match(event.request).then(cached => cached || fetch(event.request))
    );
});

// Background Sync: retry queued uploads
self.addEventListener('sync', (event) => {
    if (event.tag === 'upload-queue') {
        event.waitUntil(processUploadQueue());
    }
});

async function processUploadQueue() {
    // Read queued items from IndexedDB
    const db = await openDB();
    const tx = db.transaction('upload_queue', 'readwrite');
    const store = tx.objectStore('upload_queue');
    const items = await store.getAll();

    for (const item of items) {
        try {
            // Attempt upload
            const formData = new FormData();
            formData.append('file', item.blob);
            formData.append('upload_preset', item.uploadPreset);
            const res = await fetch(
                `https://api.cloudinary.com/v1_1/${item.cloudName}/${item.mediaType}/upload`,
                { method: 'POST', body: formData }
            );
            if (res.ok) {
                const data = await res.json();
                // Notify all clients of completion
                const clients = await self.clients.matchAll();
                clients.forEach(c => c.postMessage({ type: 'UPLOAD_COMPLETE', id: item.id, url: data.secure_url }));
                await store.delete(item.id);
            }
        } catch {
            // Keep in queue for next sync
        }
    }
}

function openDB() {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open('citizen-witness', 1);
        req.onupgradeneeded = (e) => {
            const db = e.target.result;
            if (!db.objectStoreNames.contains('upload_queue')) {
                db.createObjectStore('upload_queue', { keyPath: 'id' });
            }
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror = e => reject(e.target.error);
    });
}
