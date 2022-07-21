(() => {
    // layout engine
    "use strict";

    window.LOCKOUT_TIME = 300;
    window.TYPING_SPEED = 25;
    const PRELOAD = true; // force users to wait for a synchronous chapter load
    let START = 1;

    const AVGTEXT_PATH = "./data/";
    const LAUNCH_IN_COMIC_MODE = ["./data/pre0.json", "./data/post0.json"];

    function getDataPath (path) {
        if (path[0] === ".") {
            return path;
        }
        return `${AVGTEXT_PATH}${path}`
    }

    function fetchMediaContent (fileName) {
        // prevent undefined, remove need for cloning
        return Object.assign({}, setup.media[fileName] || {});
    }

    function processScript (script) {
        // get list of script pieces
        const nums = Object.keys(script);
        const parts = nums.length;
        START = Number(nums[0]);
        return Array.from({length: parts}, (_, i) => i + START);
    }

    // translation notes
    const TN_NOTE = /\((TN|JP|CN):(.*)\)/; // (TN:...), (CN:...), (JP:...)
    function parseLineForTN (line) {
        const match = TN_NOTE.exec(line);
        if (!match) {
            return { tn : "", line };
        }
        // remove notes from line
        return { tn : match[2], line : line.replace(TN_NOTE, "") };
    }

    function createNote (note) {
        note = String(note).trim();
        if (note) {
            // create link for note
            const $tnote = $(document.createElement("a"))
                .append("i")
                .addClass("tn")
                .appendTo("#vn-box")
                .ariaClick( { label : "Translation Note" }, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    Dialog.setup("Translation Note", "t8n-note");
                    Dialog.wiki(note);
                    Dialog.open();
                });
            // automatically delete note on advance
            $(document).one(":vn-advance.tn-note-clear", () => {
                $tnote.remove();
            });
        }
    }

    // remove/change portraits via a patch
    const portraitPatches = new Map();
    function createPortraitPatch (file, part, side, idxStart, idxEnd, data) {
        // i should probably allow an array of patches...but meh
        portraitPatches.set(file, {
            part,
            side, // right/left
            start : idxStart,
            end : idxEnd,
            data
        });
    }

    // remove corrupted mei from chapter 4
    createPortraitPatch("type-1-1-chapter-6-15.json", 15, "right", 55, Infinity, ["", 0, false]);

    class Scene {
        constructor (chapterData, script, seq) {
            const self = this;

            this.data = clone(chapterData);
            this.media = fetchMediaContent(chapterData.parts);
            this.loaded = false;
            this.comicMode = false;

            if (LAUNCH_IN_COMIC_MODE.includes(chapterData.parts)) {
                this.comicMode = true;
            }
            
            if (script) {
                // cloning, not loading
                this.script = clone(script);
                this.seq = clone(seq);
                this.loaded = true;
            } else {
                // first time load!
                if (Story.has(chapterData.parts)) {
                    // load and parse passage script
                    this.script = clone(setup.parse(chapterData.parts));
                    this.seq = processScript(this.script);
                    State.variables.part = START;
                    if (PRELOAD) { // force preloading of assets?
                        self.preload(() => {
                            self.loaded = true;
                            $(document).trigger(":scene-loaded");
                        });
                    } else {
                        self.preload(); // start loading assets asynchronously
                        self.loaded = true;
                        $(document).trigger(":scene-loaded"); // show start button
                    }
                } else {
                    readJSON(getDataPath(chapterData.parts), data => {
                        const script = clone(data);
                        self.script = script;
                        self.seq = processScript(script);
                        State.variables.part = START;
                        if (PRELOAD) { // force preloading of assets?
                            self.preload(() => {
                                self.loaded = true;
                                $(document).trigger(":scene-loaded");
                            });
                        } else {
                            self.preload(); // start loading assets asynchronously
                            self.loaded = true;
                            $(document).trigger(":scene-loaded"); // show start button
                        }
                    });
                }
            }

        }

        static loadScene () {
            if (!State.variables.chapter || !State.variables.chapter.parts) {
                throw new Error("Could not load chapter data.");
            }
            // create scene
            State.variables.scene = new Scene(State.variables.chapter);
            return State.variables.scene;
        }

        static cleanup () {
            State.variables.scene = null;
        }

        // basic scene info
        get title () {
            return this.data.name;
        }

        get description () {
            return this.data.description;
        }

        // comic mode
        static activateComicMode () {
            $("#comic-mode").addClass("active");
        }
        
        static endComicMode () {
            $("#comic-mode").removeClass("active");
        }

        static comicModeIsActive () {
            return $("#comic-mode").hasClass("active");
        }

        // apply patches
        get patchesForPortraits () {
            return portraitPatches.has(this.data.parts) ? portraitPatches.get(this.data.parts) : null;
        }

        // retrieve part instructions
        instructions (part = 1) {
            let str = String(part);
            return this.script[str];
        }

        music (part = 1) {
            if (!this.media.music) {
                return null;
            }
            return this.media.music[part - START];
        }

        playAudio (part = 1) {
            const track = this.music(part);
            if (track) {
                SimpleAudio.stop();
                SimpleAudio.tracks.get(track).loop(true).play();
            } else if (part === 1) {
                // stop menu audio, but don't play anything
                SimpleAudio.stop();
            }
        }

        bg (part = 1) {
            if (!this.media.bg) {
                return null;
            }
            return this.media.bg[part - START];
        }

        renderBG (part = 1) {
            $("body").css("background-image", "");
            const image = this.bg(part);
            if (image) {
                $("body").css("background-image", "url('tex/"  + image +  "_1280x720.png')");
            }
        }

        // instructions
        getAllInstructions () {
            let ins = [];
            this.seq.forEach( set => {
                ins = ins.concat(this.script[set]);
            });
            return ins;
        }

        static speaker (instruction) {
            // get speaker name
            return Data.speaker(instruction[1]);
        }

        static renderSpeaker (instruction) {
            const speaker = Scene.speaker(instruction);
            return $("#name").empty().show().wiki(speaker || "");
        }

        static renderPortraits (instruction, idx, instance) {
            // read instructions
            let left = instruction[1];
            let right = instruction[2];

            // startup render process
            Render.init();

            // process "new" style code
            if (setup.isValidPosition(left[3])) {
                // this portrait instruction has positional data!
                const portraits = clone(instruction);
                portraits.deleteAt(0);
                portraits.forEach( port => {
                    if (setup.isValidPosition(port[3]) && port[0] !== "") {
                        Render.sprite(port[3], port[0], port[1], port[2]);
                    }
                });
            } else {
                // patch data (gross code, don't look!)
                const patch = instance.patchesForPortraits;
                if (patch && State.variables.part === patch.part && idx >= patch.start && idx <= patch.end) {
                    if (patch.side === "right") {
                        right = clone(patch.data);
                    } else {
                        left = clone(patch.data);
                    }
                }

                // render
                if (left[0]) {
                    Render.sprite("center-left", left[0], left[1], left[2]);
                }
                if (right[0]) {
                    Render.sprite("center-right", right[0], right[1], right[2]);
                }
            }

            // complete render process by clearing expired sprite containers
            Render.clearExpired();
        }

        static clearSprites () {
            Render.clear();
        }

        static clearText () {
            $("#content, #name").empty();
        }

        static clearAllContent () {
            Scene.clearSprites();
            Scene.clearText();
        }

        static fetchCG (id) {
            return `cg/${id}.png`;
        }

        static renderCG (instruction) {
            const cg = Scene.fetchCG(instruction[1]);
            Scene.clearSprites();
            $("body").css("background-image", `url("${cg}")`);
            return cg;
        }

        static message (instruction) {
            // this should be locale based, not hard-coded (TODO)
            if (!instruction[5]) {
                return instruction[2];
            }
            return instruction[5];
        }

        static renderMessage (instruction) {
            const msg = parseLineForTN(Scene.message(instruction).replace(/\/\/n/g, ' '));
            if (msg.tn) {
                // do something with translation notes, eventually...
                createNote(msg.tn);
            }
            return $("#content").empty().wiki(`<<type ${TYPING_SPEED}ms start ${LOCKOUT_TIME}ms>><html>${msg.line}</html><</type>>`);
        }

        static processInstruction (instruction, idx, instance) {
            switch (instruction[0]) {
                case "speaker":
                    Scene.renderSpeaker(instruction, idx);
                    return false;
                case "portraits":
                    Scene.renderPortraits(instruction, idx, instance);
                    return false;
                case "bg":
                    Scene.renderCG(instruction, idx);
                    TYPING = false;
                    return true;
                case "msg":
                default:
                    Scene.renderMessage(instruction, idx);
                    return true; // wait for user to advance
            }
        }

        playInstructionList (list, idx = 0) {
            if (idx === list.length) {
                // next part or end of chapter
                State.variables.part++;
                this.play(State.variables.part);
                return;
            }
            let ins = clone(list[idx]);
            $(document).trigger({
                type : ":process-instruction-start",
                instruction : ins,
                number : idx,
                self : this
            });
            let wait = Scene.processInstruction(ins, idx, this);
            idx ++;
            if (wait) {
                $(document).one(":vn-advance.vn-mode", () => {
                    $(document).trigger({
                        type : ":process-instruction-end",
                        instruction : ins,
                        number : idx,
                        self : this
                    });
                    this.playInstructionList(list, idx);
                });
            } else {
                $(document).trigger({
                    type : ":process-instruction-end",
                    instruction : ins,
                    number : idx,
                    self : this
                });
                this.playInstructionList(list, idx);
            }
        }

        startNextPartMedia (part) {
            this.renderBG(part);
            this.playAudio(part);
            return this;
        }

        play (part = START) {
            if (part === START && this.comicMode) {
                Scene.activateComicMode();
            }
            if (this.seq.includes(part)) {
                let list = this.instructions(part);
                if (part !== START) {
                    Scene.clearAllContent();
                    setup.curtain(() => {
                        // curtain midpoint callback
                        this.startNextPartMedia(part);
                    }, () => {
                        // callback to continue playback after the curtain.
                        this.playInstructionList(list, 0);
                    });
                } else {
                    this.startNextPartMedia(part)
                        .playInstructionList(list, 0);
                }
            } else {
                if (Scene.comicModeIsActive()) {
                    Scene.endComicMode();
                }
                SimpleAudio.stop();
                Engine.play("Chapter End");
            }
        }

        // preload content
        getPortraitList () {
            let images = [];
            let ins = this.getAllInstructions();
            ins = ins.filter( command => {
                return command[0] === "portraits";
            }).forEach( portIns => {
                images.push(portIns[1]);
                images.push(portIns[2]);
            });
            return images.filter( img => {
                return img && img[0] !== "";
            });
        }

        getAllPortraitPaths () {
            let portraits = this.getPortraitList().map( id => {
                return Render.path + Data.image(id[0], id[1]);
            });
            return [...new Set(portraits)];
        }

        getCGList () {
            let images = [];
            const ins = this.getAllInstructions();
            ins.filter( command => {
                return command[0] === "bg";
            }).forEach( cgIns => {
                images.push(cgIns[1]);
            });
            return images.filter( img => {
                return !!img;
            });
        }

        getAllCGPaths () {
            return this.getCGList().map( id => {
                return Scene.fetchCG(id);
            });
        }

        getBGList () {
            if (!this.media.bg) {
                return [];
            }
            return this.media.bg.filter( img => {
                return !!img;
            });
        }

        getAllBGPaths () {
            let tex = this.getBGList().map( id => {
                return `tex/${id}_1280x720.png`;
            });
            return [...new Set(tex)];
        }

        getAllImageAssets () {
            return this.getAllBGPaths().concat(this.getAllPortraitPaths(), this.getAllCGPaths());
        }

        preload (cb) {
            setup.preload(this.getAllImageAssets(), cb);
        }

        // for SC state
        clone () {
            return new Scene(this.data, this.script, this.seq);
        }

        // for SC state
        toJSON () {
            return JSON.reviveWrapper('new Scene(' + JSON.stringify(this.data) + ')');
        }
    }

    window.Scene = Object.freeze(Scene);

    $(document).on(":passagedisplay", () => {
        $(document).off(":vn-advance.vn-mode");
        Scene.endComicMode();
    });

})();