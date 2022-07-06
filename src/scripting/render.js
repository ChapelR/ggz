(() => {
    "use strict";

    const allPositions = ["p0", "p1", "p2", "p3", "p4"];

    const spritePositions = {
        "left" : "p0",
        "center-left": "p1",
        "center": "p2",
        "center-right": "p3",
        "right": "p4"
    };

    function getPositionClass (name, img) {
        const cls = spritePositions[name];
        if (img) {
            $(img)
                .removeClass(allPositions)
                .addClass(cls);
        }
        return cls;
    }

    function clearSprites () {
        return $("#sprites").empty();
    }

    function renderSprite (position, id, idx, dim, classList = []) {
        const path = Data.image(id, idx);
        const $img = $(document.createElement("img"))
            .attr("src", "img/" + path);
        getPositionClass(position, $img);
        if (!(classList instanceof Array)) {
            classList = [];
        }
        if (!!dim) {
            classList.push("dim");
        }
        if (id == 3 && !classList.includes("boost")) { // always "boost" corrupted mei
            classList.push("boost");
        }
        if (classList.length) {
            $img.addClass(classList);
        }
        $("#sprites").append($img);
    }

    // function renderLeftSide (id, idx, dim = false) {
    //     const path = Data.image(id, idx);
    //     const $doll = $("#doll-l img");
    //     $doll.attr("src", "img/" + path);
    //     if (dim) {
    //         $doll.addClass("dim");
    //     } else {
    //         $doll.removeClass("dim");
    //     }
    //     return $doll.show();
    // }

    // function renderRightSide (id, idx, dim = false, boost = false) {
    //     const path = Data.image(id, idx);
    //     const $doll = $("#doll-r img");
    //     $doll.attr("src", "img/" + path);
    //     if (dim) {
    //         $doll.addClass("dim");
    //     } else {
    //         $doll.removeClass("dim");
    //     }
    //     if (boost || id == 3) {
    //         $doll.addClass("boost");
    //     } else {
    //         $doll.removeClass("boost");
    //     }
    //     return $doll.show();
    // }

    window.Render = {
        sprite : renderSprite,
        clear : clearSprites
    };


})();