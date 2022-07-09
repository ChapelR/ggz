(() => {
    "use strict";

    setup.allPositions = ["p0", "p1", "p2", "p3", "p4"];

    const RENDER_PATH = "img/";

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
        const $img = $("#sprites").find(`img[data-id="${String(id)}"]`);
        return $img[0] ? $img : null;
    }

    function spriteChanged ($img, id, idx) {
        // determine if sprite is already rendered to image element
        return $img.attr("data-id") === String(id) && $img.attr("data-idx") === String(idx);
    }

    function createSpriteContainer () {
        return $(document.createElement("img"))
            .on("error", function () {
                const $self = $(this);
                console.error(`No image file @ ${$self.attr("src")}.`)
                $self.attr("src", "img/missing.png");
            });
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
                element : $self
            });
        });
        // remove rendering class (give 50ish ms for rendering)
        setTimeout( () => {
            $("#sprites img.rendering").removeClass("rendering");
            $(document).trigger(":render-end");
        }, Engine.minDomActionDelay || 50);
    }

    function initRenderProcess () {
        // start up render process, by marking existing sprites as expired
        $("#sprites img").addClass("expired");
        $(document).trigger(":render-init");
    }

    function renderSprite (position, id, idx, dim, boost) {
        const path = Data.image(id, idx);
        let $img = null;

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
                    "src" : RENDER_PATH + path,
                    "data-idx" : idx
                });
            }
        } else {
            $img = createSpriteContainer() // returns new image element w/ fallback
                .attr({
                    "src" : RENDER_PATH + path,
                    "data-id" : id,
                    "data-idx" : idx
                })
                .addClass("rendering")
                .appendTo("#sprites");
        }

        // set positional class on image
        getPositionClass(position, $img);

        // set additional classes as appropriate
        if (!!dim) {
            $img.addClass("dim");
        } else {
            $img.removeClass("dim");
        }
        if ((id == 3 && !boost) || !!boost) { // always "boost" corrupted mei
            $img.addClass("boost");
        } else if (!boost) {
            $img.removeClass("boost");
        }

        $(document).trigger({
            type : ":sprite-render",
            element : $img
        });
    }

    window.Render = Object.freeze({
        init : initRenderProcess,
        createContainer : createSpriteContainer,
        sprite : renderSprite,
        clear : clearSprites,
        clearExpired : clearMarkedSprites,
        path : RENDER_PATH
    });

    // rendering process:
        // 1. call Render.init()
        // 2. parse portrait instructions and iterate over them
        // 3. call Render.sprite() on each portrait insruction
        // 4. call Render.clearExpired() to finish rendering process

})();