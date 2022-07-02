(() => {
    // image preload
    "use strict";

    function preloadImage (url, cb) {
        const img = new Image();
        img.onload = cb;
        img.onerror = cb;
        img.src = url;
    }

    function preloadAll (urls, cb) {
        let loaded = 0;
        const toBeLoaded = urls.length;
        urls.forEach( function (url) {
            preloadImage( url, function () {
                loaded++;
                if (loaded === toBeLoaded) {
                    cb && cb();
                }
            });
        });
    }

    function screenLoad (urls) {
        const lock = LoadScreen.lock();
        preloadAll(urls, () => { LoadScreen.unlock(lock); });
    }

    setup.preload = preloadAll;
    
})();