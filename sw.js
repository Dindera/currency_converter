
const cacheName = "currency_converter_v1";
const convertCache = 'currency_converter_idb'
const cacheAll = [cacheName, convertCache];

/*
Install caches in storage
*/
self.addEventListener("install", (event) => {
    console.log('Service Worker Installing');
    event.waitUntil(
            caches.open(cacheName).then((cache) => { 
                
                        return cache.addAll([
                               'index.html',
                               'public/css/styles.css',
                               'public/js/converter.js',
                               'public/js/indexedb/idb.js',
                               'https://stackpath.bootstrapcdn.com/bootstrap/4.1.0/css/bootstrap.min.css',
                               'https://free.currencyconverterapi.com/api/v5/countries',
                               'https://free.currencyconverterapi.com/api/v5/convert?q=USD_PHP&compact=y',
                               
                              
                           ]);
                        })
                    ); 
});



self.addEventListener('activate', (event) => {
    event.waitUntil(
                  caches.keys().then((cacheFiles) => {
                return Promise.all(
                    cacheFiles.filter(cacheName => {
                        return cacheName.startsWith('currency_') && 
                        !cacheAll.includes(cacheName);
                      }).map(cacheName => {
                        return caches.delete(cacheName);
                      })
                );
             })
        );
    })

self.addEventListener("fetch", (event) => {
    let getUrl = new URL(event.request.url);
   
    if(getUrl.origin === location.origin){
        console.log('fetching url :' + getUrl.pathname);
       if(getUrl.pathname === '/'){
           event.respondWith(caches.match('index.html'));
         
       }
       return;
    }
       event.respondWith(
             caches.match(event.request).then(response => {
                 if(response) {	
                                 return response;
                                } else {
                                    console.log(event.request.url+" not found in cache fetching from network.");
                                    return fetch(event.request);
                                }
                            })
                        );
           });

          
 self.addEventListener('message', (event)=> {
            if (event.data.action === 'skipWaiting') {
              self.skipWaiting();
            }
          });