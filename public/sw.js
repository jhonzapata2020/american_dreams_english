// Service Worker para American Dream English PWA
const CACHE_NAME = 'ade-pwa-v2'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      )
    }).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // NUNCA interceptar ni cachear rutas dinámicas, dashboards, campus, auth ni llamadas a APIs o Supabase
  if (
    event.request.method !== 'GET' ||
    url.pathname.startsWith('/dashboard') ||
    url.pathname.startsWith('/admin') ||
    url.pathname.startsWith('/campus') ||
    url.pathname.startsWith('/docente') ||
    url.pathname.startsWith('/teacher') ||
    url.pathname.startsWith('/login') ||
    url.pathname.startsWith('/api') ||
    url.hostname.includes('supabase.co')
  ) {
    return
  }

  // Para recursos estáticos públicos únicamente
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
