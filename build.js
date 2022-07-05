const jetpack = require("fs-jetpack");
const CleanCSS = require("clean-css");
const Terser = require("terser");

const cssOptions = {};

const jsOptions = {};

const files = {
    // order is important
    js : [
        "preload.js",
        "audio.js",
        "cfg.js",
        "files.js",
        "database.js",
        "load-chapter.js",
        "parser.js",
        "engine.js",
        "interface.js"
    ],
    css : [
        "basic.css",
        "loader.css",
        "select.css",
        "vn.css",
        "mobile.css"
    ]
};

const jsPath = "src/scripting/";
const cssPath = "src/styles/";
const outputPath = "twee/compiled/";

function compileCSS () {
    const css = files.css.map( fileName => {
        return jetpack.read(`${cssPath}${fileName}`);
    }).join("\n\n");

    jetpack.write(`${outputPath}build.css`, new CleanCSS(cssOptions).minify(css).styles, { atomic : true });
}

function compileJS () {
    const js = files.js.map( fileName => {
        return jetpack.read(`${jsPath}${fileName}`);
    }).join("\n\n");

    Terser.minify(js, jsOptions).then(result => {
        if (result.error) {
            console.error(result.error);
        }
    
        jetpack.write(`${outputPath}build.js`, result.code, { atomic : true });
    });
}

// run
compileCSS();
compileJS();