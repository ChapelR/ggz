(() => {
    // parse passage content as a scene
    "use strict";

    const PART_MARKER = /#+/g;
    const DIRECTIVE_MARKER = /(.*)>(.*)/;
    const NEW_LINE = /\n+/;
    const PORTRAIT_SEP = /\]\s*?\[/g; // split portrait data

    function ex (err, msg) {
        console.error(err.message);
        throw new Error(msg);
    }

    // use a nav override to load a passage nav'd to as a scene
    Config.navigation.override = function (dest) {
        // passages tagged "scene" are VN scripts
        if (tags(dest).includes("scene")) {
            // load the scene
            State.variables.chapter = { parts : dest };
            // return the loading passage
            return "Loading Passage";
        }
    };

    function retrieveData (psg) {
        return Story.get(psg).text;
    }

    function parseBlocks (data) {
        return data.split(PART_MARKER).map( part => {
            return part.trim();
        }).filter(part => {
            return !!part;
        });
    }

    function splitLines (part) {
        return part
            // clean new lines
            .replace(/\r/g, "\n")
            // return individual lines
            .split(NEW_LINE)
            // clean up
            .map( part => { return part.trim(); })
            .filter(part => { return !!part; });
    }

    function readLine (line) {
        const matches = DIRECTIVE_MARKER.exec(line);
        let dir = matches[1].trim().toLowerCase();
        let data = matches[2].trim();
        return {
            directive : dir || "msg",
            data
        };
    }

    /*
        DIRECTIVES

        BASIC MESSAGES:
            -- can optionally omit the "msg" command
            msg> Content
            > Content
        
        PORTRAITS:
            -- two bracketed "arrays", comma separated; must have both!
            -- empty portrait commans defaults to ["", 0, false]
            portraits> [id, idx, dim] [id, idx, dim]
            portraits> [] [id, idx, dim]
        
        CG/BG:
            -- the CG (bg) command
            cg> filename
            bg> filename
        
        SPEAKER:
            -- identifies speaker
            speaker> content

    */

    function processNumber (num) {
        num = Number(num);
        if (typeof num !== "number" || Number.isNaN(num)) {
            return 0;
        }
        return num;
    }

    function processString (str) {
        str = String(str);
        return str.trim();
    }

    function processBoolean (str) {
        str = String(str).trim().toLowerCase();
        return str === "true";
    }

    function isQuotes (str) {
        return str === "\"\"";
    }

    function stripBrackets (str) {
        return str
            .replace("[", "")
            .replace("]", "");
    }

    // function processPortData (arr) {
    //     let id = arr[0];
    //     let idx = processNumber(arr[1]);
    //     let dim = processBoolean(arr[2]);
    //     let pos = processString(arr[3]);
    //     if (isQuotes(id)) {
    //         id = "";
    //     } else {
    //         id = processNumber(id);
    //     }
    //     return [id, idx, dim];
    // }

    // function portraitData (data) {
    //     const matches = PORTRAIT_DATA.exec(data);
    //     let left = matches[1].trim();
    //     let right = matches[2].trim();
    //     if (!left) {
    //         left = "[\"\", 0, false]";
    //     }
    //     if (!right) {
    //         right = "[\"\", 0, false]";
    //     }
    //     left = stripBrackets(left).split(",")
    //         .map( part => { return part.trim(); });
    //     right = stripBrackets(right).split(",")
    //         .map( part => { return part.trim(); });
        
    //     return [ processPortData(left), processPortData(right) ];
        
    // }

    function processPortParts (arr) {
        let id = arr[0];
        let idx = processNumber(arr[1]);
        let dim = processBoolean(arr[2]);
        let pos = arr[3] ? processString(arr[3]).replace(/\"/g, "") : null;
        if (isQuotes(id)) {
            id = "";
        } else {
            id = processNumber(id);
        }
        const ret = [id, idx, dim];
        if (pos) {
            ret.push(pos);
        }
        return ret;
    }

    function portraitData (data) {
        try {
            return data
                .split(PORTRAIT_SEP)
                .map( p => {
                    if (!p || !p.trim()) {
                        return ["", 0, false];
                    }
                    p = p.trim().replace("[", "").replace("]", "").trim();
                    if (!p || !p.trim()) {
                        return ["", 0, false];
                    }
                    let array = p.split(",").map( part => { return part.trim(); });
                    return processPortParts(array);
                });
        } catch (err) {
            ex(err, "Could not process portrait data: " + data);
        }
    }

    function processDirectiveData (command) {
        switch (command.directive) {
            case "bg":
            case "cg":
                // background command
                return ["bg", processString(command.data)];
            case "speaker":
                // speaker command
                return ["speaker", processNumber(command.data)];
            case "portraits":
                // portraits command
                return ["portraits"].concat(portraitData(command.data));
            case "msg":
            case "":
                // msg command
                return ["msg", 0, processString(command.data)];
            default:
                // bad command
                ex({ message : "Could not process directives." }, "Could not process directives.");
        }
    }

    function parse (psg) {
        try {
            const data = retrieveData(psg);
            const ret = {}; // package up
            parseBlocks(data).forEach( (part, idx) => {
                let seqNum = String(idx + 1); // "1", "2", "3", etc
                let script = [];

                splitLines(part).forEach( line => {
                    script.push(processDirectiveData(readLine(line)));
                });

                ret[seqNum] = script;
            });
            return ret;
        } catch (err) {
            ex(err, "Error in script parsing.");
        }
    }

    setup.parse = parse;

})();