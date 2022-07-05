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

    // refresh -> delete game session data
    $(window).on("unload", () => {
        SugarCube.session.clear();
    });

})();