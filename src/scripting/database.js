(() => {
    // lookup database content
    "use strict";

    let locale = 3; // human translated english for speaker names by default

    function returnLocalVersion (array, override) {
        if (!array || !(array instanceof Array) || !array.length) {
            return "";
        }
        let ret = array[override || locale];
        if (!ret || ret === "XXX") {
            ret = array[0];
        }
        return ret;
    }

    function getSpeakerName (id) {
        if (typeof id !== "number") {
            id = Number(id);
        }
        return returnLocalVersion(setup.database.speakers[String(id)]);
    }

    function getImageForScene (id, idx = 0) {
        if (!id) {
            return null;
        }
        const array = setup.database.portraits[String(id)];
        if (!array || !(array instanceof Array) || !array.length) {
            return null;
        }
        if (!idx || typeof idx !== "number" || Number.isNaN(idx)) {
            idx = 0;
        }
        return array[idx];
    }

    window.Data = {
        speaker : getSpeakerName,
        image : getImageForScene
    };

})();