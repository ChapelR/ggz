(() => {
    // lookup database content
    "use strict";

    let locale = 3; // human translated english by default

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

    function renderLeftSide (id, idx, dim = false) {
        const path = getImageForScene(id, idx);
        const $doll = $("#doll-l img");
        $doll.attr("src", "img/" + path);
        if (dim) {
            $doll.addClass("dim");
        } else {
            $doll.removeClass("dim");
        }
        return $doll.show();
    }

    function renderRightSide (id, idx, dim = false, boost = false) {
        const path = getImageForScene(id, idx);
        const $doll = $("#doll-r img");
        $doll.attr("src", "img/" + path);
        if (dim) {
            $doll.addClass("dim");
        } else {
            $doll.removeClass("dim");
        }
        if (boost || id == 3) {
            $doll.addClass("boost");
        } else {
            $doll.removeClass("boost");
        }
        return $doll.show();
    }

    window.Data = {
        speaker : getSpeakerName,
        image : getImageForScene
    };

    window.Render = {
        image : {
            right : renderRightSide, // id, idx, dim, boost
            left : renderLeftSide // id, idx, dim
        }
    };

})();