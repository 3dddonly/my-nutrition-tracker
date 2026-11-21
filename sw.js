const CACHE='my-nutrition-v4';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',event=>event.waitUntil((async()=>{const cache=await caches.open(CACHE);await cache.addAll(ASSETS);await self.skipWaiting()})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{const keys=await caches.keys();await Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)));await self.clients.claim()})()));
self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET')return;
 const url=new URL(event.request.url);
 if(event.request.mode==='navigate'){
  event.respondWith((async()=>{try{const response=await fetch(event.request);const cache=await caches.open(CACHE);cache.put('./index.html',response.clone());return response}catch(error){return (await caches.match('./index.html'))||Response.error()}})());
  return;
 }
 event.respondWith((async()=>{const cached=await caches.match(event.request);if(cached)return cached;try{const response=await fetch(event.request);if(response.ok&&url.origin===location.origin){const cache=await caches.open(CACHE);cache.put(event.request,response.clone())}return response}catch(error){return cached||Response.error()}})());
});
