const CACHE_NAME = 'amiibo-images-cache-v1';
const imageCache = [];
// Install the Service Worker and cache essential files
self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    // The skipWaiting() allows the service worker to immediately activate after installation
    self.skipWaiting();
});

// Activate the Service Worker
self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
    // Clean up old caches if needed
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if (cache !== CACHE_NAME) {
                        console.log('Service Worker clearing old cache:', cache);
                        return caches.delete(cache);
                    }
                }) 
            );
        }) 
    );
});

// Intercept network requests and cache images
self.addEventListener('fetch', event => {
    const request = event.request;
    // Only cache image requests
    if (request.destination === 'image') {
        event.respondWith(
            caches.match(request)
                .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse; // Serve cached image
                }
                // Otherwise, fetch the image from the network
                return fetch(request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, networkResponse.clone()); // Cache the image
                        return networkResponse; // Serve the network response
                    });
                }); 
            })
        ); 
    }
});