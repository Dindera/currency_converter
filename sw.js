const cacheName = "currency_converter_v1";
const convertCache = "currency_converter_idb";
const cacheAll = [cacheName, convertCache];
// const REPO = '';///currency_converter

/*
Install caches in storage
*/
self.addEventListener("install", event => {
    console.log("Service Worker Installing");
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
              
                // REPO + "/index.html",
                // REPO + "/sw.js",
                // REPO + "/public/css/styles.css",
                // REPO + "/public/js/converter.js",
                // REPO + "/public/js/indexedb/idb.js",
                // REPO + "/public/css/favicon.png",
                // "https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css",
                // "https://free.currencyconverterapi.com/api/v5/countries",
                // "https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y"

              
                "index.html",
                "sw.js",
                "public/css/styles.css",
                "public/js/converter.js",
                "public/js/indexedb/idb.js",
                "public/css/favicon.png",
                "https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css",
                "https://free.currencyconverterapi.com/api/v5/countries",
                "https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y"
            ]);
        })
    );
});

// event for activate when new cache name is discovered
self.addEventListener("activate", event => {
    console.log('StarACT');
    self.clients.claim();
    console.log('AAACLMDONE');
    event.waitUntil(
        caches.keys().then(cacheFiles => {
            return Promise.all(
                cacheFiles
                    .filter(cacheName => {
                        return (
                            cacheName.startsWith("currency_") && !cacheAll.includes(cacheName)
                        );
                    })
                    .map(cacheName => {
                        return caches.delete(cacheName);
                    })
            );
        })
    );
});


self.addEventListener("fetch", event => {
    let getUrl = new URL(event.request.url);

    if (getUrl.origin === location.origin) {
        console.log("fetching url :" + getUrl.pathname);
        //handles only index 
        if (getUrl.pathname === "/" || getUrl === "/currency_converter" + "/") {
            console.log('INDXAAAAA', getUrl.pathname);
            event.respondWith(caches.match(REPO + "/index.html"));
        }
        else {// handle other request from  this site
            console.log('OTHRSAAAAA', getUrl.pathname);
            event.respondWith(caches.match(event.request));
        }
        return;
    }

    //this only handles external request alone
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            } else {
                console.log(
                    event.request.url + " not found in cache fetching from network."
                );
                return fetch(event.request);
            }
        })
    );
});



self.addEventListener("message", event => {
    if (event.data.action === "skipWaiting") {
        self.skipWaiting();
    }
});
