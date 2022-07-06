(() => {
    "use strict";

    function renderLeftSide (id, idx, dim = false) {
        const path = Data.image(id, idx);
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
        const path = Data.image(id, idx);
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

    window.Render = {
        image : {
            right : renderRightSide, // id, idx, dim, boost
            left : renderLeftSide // id, idx, dim
        }
    };


})();