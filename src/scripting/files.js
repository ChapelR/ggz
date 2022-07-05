(() => {
    "use strict";

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
    readJSONwLoadScreen("database.json", data => {
        setup.database = clone(data);
    });
    readJSONwLoadScreen("chapters.json", data => {
        setup.chapters = clone(data);
        // patch in prologue "comics"
        setup.chapters.story.main[0].episodes = [
            {
                "name": "Prologue Part 1",
                "parts": "pre0.json"
            },
            {
                "name": "Prologue Part 2",
                "parts": "prologue.json"
            },
            {
                "name": "Prologue Part 3",
                "parts": "post0.json"
            }
        ];
    });
    readJSONwLoadScreen("data/media.json", data => {
        setup.media = clone(data);
    });
})();