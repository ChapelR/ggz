(() => {
    "use strict";

    window.TYPING = false;
    window.RECLICK_LOCK = false;
    const CURTAIN_TIMERS = [500, 500]; // transition (from css) and wait time

    const SPLASH_SCREENS = 6; // 0-based, so less one

    // curtain
    const $curtain = $("#curtain");
    setup.curtain = function curtain (mid, end) {
        $curtain.addClass("closed");
        setTimeout( () => {
            /* jshint ignore:start */
            mid && mid();
            /* jshint ignore:end */
            $curtain.removeClass("closed");
            setTimeout( () => {
                /* jshint ignore:start */
                end && end();
                /* jshint ignore:end */
            }, CURTAIN_TIMERS[0]);
        }, CURTAIN_TIMERS[0] + CURTAIN_TIMERS[1]);
    };

    setup.typeSkip = function typeSkip () {
        // activate the "skip key" to skip typing animations
        const skipKeyEv = jQuery.Event('keydown', {
            key : Config.macros.typeSkipKey
        });
        
        $(document.documentElement).trigger(skipKeyEv);
    };

    // top bar clickables
    $("#menu").ariaClick({ label : "Open menu" }, () => {
        $("#drawer").toggleClass("hidden");
        if ($("#drawer").hasClass("hidden")) {
            SimpleAudio.tracks.get("open").play();
        } else {
            SimpleAudio.tracks.get("close").play();
        }
    });
    $("#sound").ariaClick({ label : "Mute/unmute audio" }, () => {
        SimpleAudio.tracks.get("tab").play();
        if ($("#sound").hasClass("on")) {
            $("#sound img").attr("src", "icons/sound_on.svg");
            SimpleAudio.mute(true);
        } else {
            $("#sound img").attr("src", "icons/sound_off.svg");
            SimpleAudio.mute(false);
        }
        $("#sound").toggleClass("on");
    });
    $("#text").ariaClick({ label : "Show/hide text" }, () => {
        SimpleAudio.tracks.get("tab").play();
        if ($("#text").hasClass("on") && ($(".shaded-box")[0] || $("#vn-box")[0])) {
            $("#text img").attr("src", "icons/text_show.svg");
            $(".shaded-box, #vn-box").hide();
        } else {
            $("#text img").attr("src", "icons/text_hide.svg");
            $(".shaded-box, #vn-box").show();
        }
        $("#text").toggleClass("on");
    });
    $("#fullscreen").ariaClick({ label : "Enter/exit fullscreen" }, () => {
        SimpleAudio.tracks.get("tab").play();
        Fullscreen.toggle({ navigationUI : "show" });
        if (Fullscreen.isFullscreen()) {
            $("#fullscreen img").attr("src", "icons/fullscreen_on.svg");
            $("#fullscreen").addClass("on");
        } else {
            $("#fullscreen img").attr("src", "icons/fullscreen_off.svg");
            $("#fullscreen").addClass("off");
        }
    });
    $("#help").ariaClick({ label : "Display help" }, () => {
        SimpleAudio.tracks.get("tab").play();
        Dialog.setup("Help", "help");
        Dialog.wiki(Story.get("Help").text);
        Dialog.open();
    });

    // passage transition upkeep
    $(document).on(':passagedisplay', () => {
        TYPING = false;

        if (tags().includes("menu")) {
            $("#menu").hide();
        } else {
            $("#menu").show();
        }
        
        $("#drawer").addClass("hidden");
        if (tags().includes("splash")) {
            $(document.body).css("background-image", `url("splash/${random(SPLASH_SCREENS)}.jpg")`);
        } else {
            $(document.body).css("background-image", "");
        }

    });

    // bind click sound to buttons
    $(document).on(":passageend", () => {
        $("button").on("click", () => {
            SimpleAudio.tracks.get("select").play();
        });
    });

    // set global TYPING flag
    $(document).on(":typingstart", () => { TYPING = true; });
    $(document).on(":typingcomplete", () => { TYPING = false; });

    function activate (kp) {
        // lockout clicks for a split second
        setTimeout( () => {
            RECLICK_LOCK = false;
        }, LOCKOUT_TIME);
        if (RECLICK_LOCK) {
            return;
        }
        RECLICK_LOCK = true;
        
        SimpleAudio.tracks.get("select").play();
        if (TYPING && !kp) {
            setup.typeSkip();
            return;
        }
        if (!TYPING && $("#vn-box")[0]) {
            $(document).trigger(":vn-advance");
        }
    }

    $(document).on("click", "#vn-box, #comic-mode.active", e => {
        e.preventDefault();
        activate();
    });

    $(document).on("keydown", e => {
        if (e.key === " ") {
            e.preventDefault();
            activate(true);
        }
    });

    $(document).on(":vn-advance", () => { 
        // move to next part, see engine.js
        TYPING = true;
    });

    // play some audio when possible
    $(document).one("click mousedown keydown touchstart", () => {
        if(passage() === "Start") {
            SimpleAudio.tracks.get("001").loop(true).play();
        }
    });

})();