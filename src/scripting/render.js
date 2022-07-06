(() => {
    "use strict";

    setup.allPositions = ["p0", "p1", "p2", "p3", "p4"];

    const spritePositions = {
        "left" : "p0",
        "center-left": "p1",
        "center": "p2",
        "center-right": "p3",
        "right": "p4"
    };

    const positionNames = Object.keys(spritePositions);

    const ANIMATION_TIME = 200; // in ms

    setup.isValidPosition = function isValidPosition (pos) {
        return pos && typeof pos === "string" && positionNames.includes(pos);
    };

    function getPositionClass (name, img) {
        const cls = spritePositions[name];
        if (img) {
            const $img = (img instanceof $) ? img : $(img);
            if (!$img.hasClass(cls)) {
                $img
                    .removeClass(setup.allPositions)
                    .addClass(cls);
            }
        }
        return cls;
    }

    function getSpriteElement (id) {
        // retrieve img element based on sprite id
        const $img = $("#sprites").find("img[data-id='" + String(id) + "']");
        return $img[0] ? $img : null;
    }

    function spriteChanged ($img, id, idx) {
        // determine if sprite is already rendered to image element
        return $img.attr("data-id") === String(id) && $img.attr("data-idx") === String(idx);
    }

    function clearSprites () {
        return $("#sprites").empty();
    }

    function clearMarkedSprites () {
        $("#sprites img.expired").fadeOut(ANIMATION_TIME, function () {
            // remove after animation completes
            const $self = $(this);
            $self.remove();

            $(document).trigger({
                type : ":sprite-cleanup",
                removed : $self
            });
        });
        // remove rendering class after a sec
        setTimeout( () => {
            $("#sprites img.rendering").removeClass("rendering");
        }, Engine.minDomActionDelay || 50);
    }

    function initRenderProcess () {
        // start up render process, by marking existing sprites as expired
        $("#sprites img").each( function () {
            const $self = $(this);
            if (!$self.hasClass("rendering")) {
                $self.addClass("expired");
            }
        });
    }

    function renderSprite (position, id, idx, dim, classList = []) {
        const path = Data.image(id, idx);
        let $img = null;

        $(document).trigger({
            type : ":sprite-render-start",
            sprite : { id, idx, dim, classList, path }
        });

        // first, attempt to reuse an image element if possible:
        $img = getSpriteElement(id);

        if ($img) {
            // do not clear image
            $img
                .removeClass("expired")
                .addClass("rendering");
            if (spriteChanged($img, id, idx)) {
                // render new image content
                $img.attr({
                    "src" : "img/" + path,
                    "data-idx" : idx
                });
            }
        } else {
            // create new image container
            $img = $(document.createElement("img"))
                .attr({
                    "src" : "img/" + path,
                    "data-id" : id,
                    "data-idx" : idx
                })
                .addClass("rendering")
                .appendTo("#sprites");
        }

        // set positional class on image
        getPositionClass(position, $img);

        // set additional classes as appropriate
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

        $(document).trigger({
            type : ":sprite-render-end",
            element : $img
        });
    }

    window.Render = {
        init : initRenderProcess,
        sprite : renderSprite,
        clear : clearSprites,
        clearExpired : clearMarkedSprites
    };


})();