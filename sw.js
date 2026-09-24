const V="daftar-v3";
const SHELL=["./","index.html","manifest.json","https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.1/dist/umd/supabase.js","icon.svg","maskable.svg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting()))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  if(u.hostname.endsWith("supabase.co"))return; // live data always goes to the network
  if(e.request.mode==="navigate"){
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(V).then(c=>c.put("index.html",cp));return r}).catch(()=>caches.match("index.html")));
    return;
  }
  if(u.origin===location.origin||u.hostname==="cdn.jsdelivr.net"||u.hostname==="fonts.googleapis.com"||u.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.match(e.request).then(hit=>{
      const net=fetch(e.request).then(r=>{if(r.ok||r.type==="opaque"){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r}).catch(()=>hit);
      return hit||net;
    }));
  }
});
