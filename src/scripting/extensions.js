(() => {
    // jquery extensions for sprites
    "use strict";

    function getProcess (element) {
        return $(element).attr("data-process");
    }

    function setProcess (element, process) {
        $(element).attr("data-process", process);
        return element;
    }

    Object.assign($.fn, {
        // rendering process
        process : function () {
            // return process
            return getProcess(this);
        },
        expired : function () {
            // mark sprite containers as expired
            return setProcess(this, "expired");
        },
        rendering : function () {
            // mark sprite containers as rendering
            return setProcess(this, "rendering");
        },
        idle : function () {
            // mark sprite containers as idle
            return setProcess(this, "idle");
        },
        // sprite dimming
        dim : function (bool) {
            if (bool === undefined) {
                bool = true;
            }
            if (!!bool) {
                this.addClass("dim");
            } else {
                this.removeClass("dim");
            }
            return this;
        }
    });
})();