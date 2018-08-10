//For adding the ServiceWorker, these resource were immensely valuable
//https://developers.google.com/web/ilt/pwa/lab-caching-files-with-service-worker
//https://serviceworke.rs/strategy-network-or-cache_service-worker_doc.html

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
    './js/restaurant_info.js'
];

self.addEventListener('install', function(evt) {
    console.log('The service worker is being installed.');
    evt.waitUntil(precache()); //Asking the SW to keep installing until the returning promise resolves
});

//Use the cache on fetch, update entry with latest contents from server
self.addEventListener('fetch', function(evt) {
    console.log('The service worker is serving the asset.');
    evt.respondWith(fromNetwork(evt.request, 400).catch(function () {
        return fromCache(evt.request); //Try the network and if that fails, go for the cache
    }));
});

//Open a cache and add an array of assets to it
function precache() {
    return caches.open(restaurantsCache).then(function (cache) {
      return cache.addAll(cacheFiles);
    });
};

//Promise rejected if network fails or response not served before timeout
function fromNetwork(request, timeout) {
    return new Promise(function (fulfill, reject) {
        var timeoutId = setTimeout(reject, timeout); //Reject in case of timeout
        fetch(request).then(function (response) { //Fulfill in case of success
            clearTimeout(timeoutId);
            fulfill(response);
        }, reject); //Reject if network fetch rejects
    });
};

//Open the cache where assets are stored and search for requested resource
//In case of no matching, promise resolves with "undefined"
function fromCache(request) {
    return caches.open(restaurantsCache).then(function (cache) {
        return cache.match(request).then(function (matching) {
        return matching || Promise.reject('no-match');
        });
    });
};