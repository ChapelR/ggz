(() => {
    "use strict";

    // state
    State.variables.completed = [];

    // config
    Config.saves.autoload = true;
    Config.saves.autosave = ["save"];
    Config.history.maxStates = 1;
    Config.loadDelay = 1000; // one extra second to help me out

    // saves
    Save.onLoad.add(save => {
        save.state.history[0].title = "Start";
        save.state.history[0].variables.scene = null;
    });

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
        }
        rawFile.send(null);
    }

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
    });
    readJSONwLoadScreen("data/media.json", data => {
        setup.media = clone(data);
    });

})();