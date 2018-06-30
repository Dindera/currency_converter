
let cacheName = "currency_converter_v1";
let convertCache = 'currency_converter_ids'
let cacheAll = [cacheName, convertCache];



self.addEventListener("install", event => {
    console.log('Service Worker Installing');
    event.waitUntil(
            caches.open(cacheName).then((cache) => { //catch that promise
                            console.log('Service Worker Caching files');
                           return cache.addAll([
                               './index.html',
                               './public/css/styles.css',
                               './public/js/converter.js',
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
       if(getUrl.pathname === '/'){
           event.respondWith(caches.match('/index.html'));
           return;
       }
    }
       event.respondWith(caches.match(event.request).then(response => {
                 if(response) {	
                        //  console.log(`Found ${getUrl} from cache, refresh to update`);
                                 return response;
                                }else {
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