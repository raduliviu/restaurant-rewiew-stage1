//For adding the ServiceWorker, this resource was immensely valuable
//https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker

var restaurantsCache = 'cache-v1';
var cacheFiles = [
    './',
    './index.html',
    './restaurant.html',
    './css/styles.css',
    './data/restaurants.json',
    './img/1.jpg',
    './img/2.jpg',
    './img/3.jpg',
    './img/4.jpg',
    './img/5.jpg',
    './img/6.jpg',
    './img/7.jpg',
    './img/8.jpg',
    './img/9.jpg',
    './img/10.jpg',
    './js/dbhelper.js',
    './js/main.js',
    './js/restaurant_info.js',
];

//Here I am creating the cache and adding the files to the cache
self.addEventListener('install', function(event) {
    console.log('Attempting to install service worker and cache static assets');
    event.waitUntil(
      caches.open(restaurantsCache)
      .then(function(cache) {
        return cache.addAll(cacheFiles);
      })
    );
  });

self.addEventListener('fetch', function(event) {
console.log('Fetch event for ', event.request.url);
event.respondWith(
//Here we check if we already have cached the requested resource
//If we do, we return it, if we do not, then we request it from the network
    caches.match(event.request).then(function(response) {
    if (response) {
        console.log('Found ', event.request.url, ' in cache');
        return response;
    }
    console.log('Network request for ', event.request.url);
    return fetch(event.request)
    
    //Here we are putting returned responses into the cache
    .then(function(response) {
        
        return caches.open(restaurantsCache).then(function(cache) {
            if (event.request.url.indexOf('test') < 0) {
            cache.put(event.request.url, response.clone());
            }
            return response;
        });
        });

    }).catch(function(error) {

    console.log(error);

    })
);
});

//Here we delete the outdated cache
self.addEventListener('activate', function(event) {
    console.log('Activating new service worker...');
  
    var cacheWhitelist = [restaurantsCache];
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });