(() => {
    // parse passage content as a scene
    "use strict";

    const PART_MARKER = /#+/g;
    const DIRECTIVE_MARKER = /(.*)>(.*)/;
    const NEW_LINE = /\n+/;
    const PORTRAIT_DATA = /\[(.*?)\]\s*\[(.*?)\]/;

    // use a nav override to load a passage nav'd to as a scene
    // Config.navigation.override = function (passage) {
    //     // passages tagged "scene" are VN scripts
    //     if (tags(passage).includes("scene")) {
    //         // SOMEHOW load the scene (TODO)
            
    //         // nav to scene start
    //         Engine.play("Chapter Start");
    //     }
    // };

    function retrieveData (psg) {
        return Story.get(passageName).text;
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

    function processPortData (arr) {
        let id = arr[0];
        let idx = processNumber(arr[1]);
        let dim = processBoolean(arr[2]);
        if (isQuotes(id)) {
            id = "";
        } else {
            id = processNumber(id);
        }
        return [id, idx, dim];
    }

    function portraitData (data) {
        const matches = PORTRAIT_DATA.exec(data);
        let left = matches[1].trim();
        let right = matches[2].trim();
        if (!left) {
            left = "[\"\", 0, false]";
        }
        if (!right) {
            right = "[\"\", 0, false]";
        }
        left = left.split(",")
            .map( part => { return part.trim(); });
        right = right.split(",")
            .map( part => { return part.trim(); });
        
        return [ processPortData(left), processPortData(right) ];
        
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
                return ["portraits", portraitData(command.data) ];
            case "msg":
            case "":
                // msg command
                return ["msg", 0, processString(command.data)];
            default:
                // bad command
                console.error("Bad command:", command);
                return null;
        }
    }

    function parse (psg) {
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
    }

    setup.parse = parse;

})();