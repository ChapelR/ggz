(() => {
    "use strict";

    const DATABASE_PATH = "./database.json";
    const CHAPTERS_PATH = "./chapters.json";
    const MEDIA_PATH = "./data/media.json";

    // json
    window.readJSON = function readJSON (file, callback) {
        const rawFile = new XMLHttpRequest();
        rawFile.overrideMimeType("application/json");
        rawFile.open("GET", file, true);
        rawFile.responseType = "json";
        rawFile.onreadystatechange = function() {
            if (rawFile.readyState === 4 && rawFile.status == "200") {
                callback(rawFile.response);
            }
        };
        rawFile.send(null);
    };

    function readJSONwLoadScreen (file, cb) {
        const lock = LoadScreen.lock();
        readJSON(file, data => {
            cb(data);
            LoadScreen.unlock(lock);
        });
    }

    // load database files, w/ load screen
    readJSONwLoadScreen(DATABASE_PATH, data => {
        setup.database = clone(data);
    });
    readJSONwLoadScreen(CHAPTERS_PATH, data => {
        setup.chapters = clone(data);
        // patch in prologue "comics"
        setup.chapters.story.main[0].episodes = [
            {
                "name": "Prologue Part 1",
                "parts": "./data/pre0.json"
            },
            {
                "name": "Prologue Part 2",
                "parts": "./data/prologue.json"
            },
            {
                "name": "Prologue Part 3",
                "parts": "./data/post0.json"
            }
        ];
    });
    readJSONwLoadScreen(MEDIA_PATH, data => {
        setup.media = clone(data);
    });
})();