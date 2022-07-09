# API Docs

- [Data API](#data-api)  
- [Render API](#render-api)  
- [Scene API](#scene-api)  
- [Miscellaneous Functions and Methods](#miscellaneous-functions-and-methods)  
- [Events](#events)

## `Data` API

API for looking up and retrieving "database" data from the core JSON files, including speaker names, image URLs, chapter data, etc.

### `Data.speaker()`

`Data.speaker(id)`

Returns the speaker's name associated with the provided ID.

### `Data.image()`

`Data.image(id [, idx])`

Returns the relative URL of the image resource associated with the provided ID. Optionally provide an index, otherwise index 0 will be returned from the database file.

### `Data.chapter()`

`Data.chapter(chapter, episode)`

Returns the data associated with a chapter and also stores it in the `State.variables.chapter` object. The object contains the chapter's `name`, `description`, and `parts` as properties; `parts` is the related JSON file name containing the indicated chapter's script data.

### `Data.listChapters()`

Returns a jQuery element containing a list of links for all available chapters that can be played. Rendered by the `<<listchapters>>` macro.

## `Render` API

API for rendering/clearing sprites.

### `Render.init()`

This is the first step in the sprite rendering process, and should be called anytime a new set of sprites is to be rendered. All `<img>` elements that are used as sprite containers are marked as "expired."

### `Render.sprite()`

`Render.sprite(position, id, idx, dim, boost)`

Renders a sprite. You can render any number of sprites, but there are only 5 positions they can occupy, meaning you generally shouldn't render more than 5. The positions are, from left to right:

- `"left"`
- `"center-left"`
- `"center"`
- `"center-right"`
- `"right"`

If sprites overlap they stack in such a way that the further left the sprite is, the higher it will be in terms of it's z-index, meaning sprites on the left will always overlap on top of sprites to the right.

To render an image, you must provide a numeric ID (for example, Kiana is `101` and Mei is `201`) and an index for the specific sprite you want (`0` is usually the default "neutral" sprite, and sometimes the only sprite).

You can use the `dim` argument to "darken" the sprite; a dimmed sprite will be filtered in such a way that its drop shadow is removed and its brightness is reduced. You can use the `boost` argument to "boost" a sprite so it appears slightly higher than it otherwise would; many "boss" sprites need to be boosted.

When a sprite is about to be rendered, all sprite containers will be compared to the incoming sprite. If a sprite container already has the sprite inside, or a sprite in the same "series" (usually the same charater), that sprite container will be re-used. Re-used sprite containers will no longer be marked "expired" and if a different position is given, the sprite will be smoothly animated into the new position. If no suitable sprite containers exist, a new container will be created and added to the document.

### `Render.clearExpired()`

This is the final part of the rendering process, and should be called after all sprites have been rendered. All sprites marked as "expired" are removed from the scene. These sprites are positioned on top of any newly rendering sprites quickly faded out, which creates a crossfade effect if a new sprite is added to the same position, or simply fades the sprite out if not.

### `Render.clear()`

This method clears all sprites by completely emptying the sprite container. It is run every time a `"portraits"` instruction is run.

### `Render.createContainer()`

Creates and returns a new sprite container (as a JQuery instance). New sprite containers are `<img>` elements that fallback to the special `missing.png` file if they fail to load, and have a few additional properties. This method only creates and returns a new container, it does not add it to the page, or load a sprite into it.

### `Render.path`

This is just a value used by the system to determine a directory (or URL) to use as a base directory to look for sprites. Read-only at runtime.

### The Rendering Process

The rendering process occurs in several steps.

- A "portraits" instruction is received, calling the Scene API's portrait render method.
- `Render.init()` marks all sprite containers currently on the page as "expired."
- Portrait instructions are parsed and each portrait command is iterated over.
- Each portrait command is passed to `Render.sprite()`, which does several things:
  - If any sprite containers are re-used, they are no longer marked "expired."
  - Any new sprite containers created are added to the scene.
  - New and re-used sprite containers are marked "rendering."
  - Re-used sprites with new positions are moved into their new position via an animation.
- `Render.clearExpired()` is called and "expired" sprites are faded out.

## `Scene` API

`Scene` is a class used to construct and play a visual novel scene.

### `Scene` constructor

`new Scene(data)`

In general, you should never call this constructor, it is documented here for completeness. Instead, you should create or fetch chapter data using the `Data.chapter()` method, or by directly setting the `State.variables.chapter` variable to contain the appropriate chapter information, then call `Scene.loadScene()`.

### `Scene` static properties and methods

#### `Scene.loadScene()`

Creates and returns a new `Scene` instance using the data stored in the `State.variables.chapter` variable. The recommended way to create a scene instance is to use the `Data.chapter()` method, or to directly set the `State.variables.chapter` variable, then call this method.

When the scene finishes loading, the instance will be stored in the `State.variables.scene` variable, but you can also use the return value from this method to access the instance.

#### `Scene.cleanup()`

This method should be run after any scene is completed. It cleans up the scene's data and `null`s everything out.

#### `Scene.activateComicMode()`

Turns "comic mode" on. This must be done at the start of a scene. Scenes cannot switch between comic and normal mode; each scene must be run in one mode or the other. In comic mode, the text box is hidden, and clicks to any part of the screen other than the `<nav>` element (the top bar) will advance. No messages or textg content are rendered in comic mode.

#### `Scene.endComicMode()`

When a scene in comic mode ends, this is autmatically called to remove the comic mode UI elements and event handlers.

#### `Scene.comicModeIsActive()`

Returns true is comic mode is currently active.

#### `Scene.clearPortraits()`

Removes all sprites and sprite containers.

#### `Scene.clearText()`

Empties the text box, both the message area and the character name area.

#### `Scene.clearAllContent()`

This method calls both `Scene.clearPortraits()` and `Scene.clearText()`.

#### `Scene.renderSpeaker()`

`Scene.renderSpeaker(instruction)`

Reads `"speaker"` instructions, evaluates them, and renders the requested speaker name into the text box.

#### `Scene.renderPortraits()`

`Scene.renderPortraits(instruction)`

Reads `"portraits"` instructions, evaluates them, and renders the requested sprites into the scene.

#### `Scene.renderCG()`

`Scene.renderCG(instruction)`

Reads `"bg"`/`"cg"` instructions, evaluates them, and renders the indicated background or CG into the scene.

#### `Scene.renderMessage()`

`Scene.renderMessage(instruction)`

Reads `"msg"` instructions, evaluates them, and renders the provided message content into the text box.

#### `Scene.processInstruction()`

`Scene.processInstruction(instruction)`

Reads an instruction, determines what type of instruction it is, and calls the correct rendering method (see above) to evaluate and perform the instruction.

### `Scene` instance properties and methods

#### `Scene#title`

Read-only. The title of the current scene/chapter.

#### `Scene#description`

Read-only. The description of the current scene/chapter.

#### `Scene#patchesForPortraits`

Read-only. Gets patch data for sprites. This is a wonky system used to monkey-patch incorrect game data without having to alter said data. Since this is only relevant to GGZ stuff, I will probably remove this from standalone versions of the engine, as you should just fix your own VN scripts instead of using this feature.

#### `Scene#instructions()`

`Scene#instructions(partNumber)`

Returns an array of all the instructions for the indicated part of the scene. If no part is provided, it grabs the instrucitons for the first part.

#### `Scene#playAudio()`

`Scene#playAudio(partNumber)`

Uses the `media.json` file to find the audio for a given scene part and plays that audio. Used when a new part is started during scene playback.

#### `Scene#renderBG()`

`Scene#renderBG(partNumber)`

Uses the `media.json` file to find the backgrond for a given scene part and renders it. Used when a new part is started during scene playback.

#### `Scene#getAllInstuctions()`

Returns an array of all the instructions in the scene, for all the parts.

#### `Scene#playInstructionList()`

`Scene#playInstructionList(partNumber)`

Begins playback of the indicated part (defaults to the first part) of a scene, looping through all the part's instructions until it reaches the end.

#### `Scene#play()`

Starts playback of the scene. All parts are run one after the other.

#### `Scene#getAllimageAssets()`

Pre-reads the scene's instructions and collects all filepaths for all image assets used, and returns them as an array of strings.

#### `Scene#preload()`

Preloads all of a scene's image assets.

#### `Scene#clone()`

Returns a clone of the scene instance. Clones work a little differently than new scenes do; new scenes process and preload data autmatically, but this isn't done when a scene is cloned, as it assumes that this process has already been completed by the orignal instance. But this can also lead to wonky behavior since clones are actually slightly different than their originals, and some data is not re-processed. If you need that data to be re-processed, or assets to be preloaded, use `new Scene(sceneToClone.data)` instead of this method.

#### `Scene#toJSON()`

Returns a serializable string version of the scene instance. Needs to be eval'd to be de-serilaized/revived.

## Miscellaneous Functions and Methods

### `window.readJSON()`

`readJSON(callback)`

Reads and parses an external JSON file. The file's data is provided to the callback funciton as its first argument.

### `setup.preload()`

`setup.preload(urls, callback)`

When provided URLs referencing image files as an array of strings, pre-downloads them. The callback function is executed after all the files have been preloaded (or have failed to preload).

### `setup.parse()`

`setup.parse(passage)`

When provided the name of a passage, parses it's content as a VN script for a scene. Used by the engine automatically when a passage tagged `scene` is navigated to.

### `setup.typeSkip()`

Skips typing animations.

### `setup.curtain()`

`setup.curtain(callback1, callback2)`

Calls the "curtain," which is an animated transition effect used between "parts" of a VN scene. You can provide two callbacks. The first callback is run when the "curtain" reaches the bottom of the screen. The screen is totally obstructed during this callback, making it a good opportunity to change backgrounds or shuffle sprites around. The second callback is run after the curtain completely raises again, triggered by the end of the animation.

The curtain blocks user interaction and suspends the processing of instrucitons in on-going scenes.

## Events

The engine emits several events. Most of these are emitted on the `document`, or bubble up to the `document`, so that's the best place to listen for them.

### `:sprite-render`

Event properties:
- `element`: This property holds the rendering sprite container's `<img>` element as a JQuery instance.

Runs when a sprite begins to render. This event is emitted for every sprite rendered individually.

### `:sprite-cleanup`

Event properties:
- `element`: This property holds the removed sprite container's `<img>` element as a JQuery instance.

Runs when a sprite is finished rendering. This event is emitted for every sprite rendered individually.

### `render-init`

Runs when the render process starts, after a `"portraits"` instruction is called but before any sprites are rendered.

### `render-end`

Runs when the render process ends, after all sprites for the current `"portraits"` instruction are rendered, before the next instruction is processed.

### `:process-instruction-start`

Run just before an instruction (a single command from a scene script) is evaluated.

### `:process-instruction-end`

Run after an instruction (a single command from a scene script) is completed. For instructions that wait on users, this happens *after* the user interacts, as the instruction is not cleared and the next isn't loaded until that happens.

### `:vn-advance`

Run whenever the user advances in visual novel mode. Advancing happens when the instruction is waiting on the user and the user clicks on the text box or presses space and the next instruction is loaded. Note that if a typing animation is playing, the visual novel *will not be advanced*, instead the typing animation will be skipped, so the `:vn-advance` event can only be emitted after the typing animation ends.

It is **strongly** recommended that you namespace any handlers related to `:vn-advance` and manage them using their namespaces. There are a lot of handlers on this event, so they need to be managed carefully.