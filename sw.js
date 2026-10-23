// Red primero: si la PC responde, siempre se usa la versión nueva de la interfaz.
// Sin conexión se usa la copia guardada. Antes se servía siempre la copia vieja.
const CACHE='pocket-deck-0.9.4';
const ASSETS=['/live-update.js','/','/app.js','/pairing-code.js','/style.css','/manifest.webmanifest','/icon-192.png','/icon-512.png','/fonts/MatchaStyle.ttf'];
self.addEventListener('install',e=>e.waitUntil((async()=>{const c=await caches.open(CACHE);for(const url of ASSETS){const r=await fetch(url,{cache:'reload',credentials:'same-origin'});if(!r.ok||r.redirected)throw Error('Shell unavailable');await c.put(url,r);}if(!self.registration.active)await self.skipWaiting();})()));
self.addEventListener('activate',e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k.startsWith('pocket-deck-')&&k!==CACHE)await caches.delete(k);await self.clients.claim();})()));
self.addEventListener('message',e=>{if(e.data?.type==='SKIP_WAITING')self.skipWaiting();});
async function networkFirst(request,key){const c=await caches.open(CACHE);try{const r=await fetch(request,{cache:'no-store'});if(r.ok&&!r.redirected)await c.put(key,r.clone());return r;}catch(err){const cached=await c.match(key);if(cached)return cached;throw err;}}
self.addEventListener('fetch',e=>{const u=new URL(e.request.url);if(e.request.method!=='GET'||u.origin!==self.location.origin||u.pathname.startsWith('/api/'))return;if(e.request.mode==='navigate'&&u.pathname==='/'){e.respondWith(networkFirst(e.request,'/'));return;}if(ASSETS.includes(u.pathname))e.respondWith(networkFirst(e.request,u.pathname));});
