

self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('v1').then(function(cache) {
        return cache.addAll([
          // '/sw-test/',
          // '/sw-test/index.html',
          // '/sw-test/style.css',
          // '/sw-test/app.js',
          // '/sw-test/image-list.js',
          // '/sw-test/star-wars-logo.jpg',
          // '/sw-test/gallery/bountyHunters.jpg',
          // '/sw-test/gallery/myLittleVader.jpg',
          // '/sw-test/gallery/snowTroopers.jpg'

          '/currency_converter/',
          '/currency_converter/index.html',
          '/currency_converter/converter.js',
          '/currency_converter/public/css/styles.css',
          

        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(caches.match(event.request).then(function(response) {
      // caches.match() always resolves
      // but in case of success response will have value
      if (response !== undefined) {
        return response;
      } else {
        return fetch(event.request).then(function (response) {
          // response may be used only once
          // we need to save clone to put one copy in cache
          // and serve second one
          let responseClone = response.clone();
          
          caches.open('v1').then(function (cache) {
            cache.put(event.request, responseClone);
          });
          return response;
        }).catch(function () {
          return caches.match('/public/css');
        });
      }
    }));
  });
  