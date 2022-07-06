# API Docs

## `Data` API

API for looking up and retrieving "database" data from the core JSON files, including speaker names, image URLs, chapter data, etc.

### `Data.speaker()`

> `Data.speaker(id)`

Returns the speaker's name associated with the provided ID.

### `Data.image()`

> `Data.image(id [, idx])`

Returns the relative URL of the image resource associated with the provided ID. Optionally provide an index, otherwise index 0 will be returned from the database file.

### `Data.chapter()`

> `Data.chapter(chapter, episode)`

Returns the data associated with a chapter and also stores it in the `State.variables.chapter` object. The object contains the chapter's `name`, `description`, and `parts` as properties; `parts` is the related JSON file name containing the indicated chapter's script data.

### `Data.listChapters()`

> `Data.listChapters()`

Returns a jQuery element containing a list of links for all available chapters that can be played. Rendered by the `<<listchapters>>` macro.

## `Render` API

API for rendering/clearing sprites.

### `Render.sprite()`

> `Render.sprite(position, id, idx, dim, classList)`

Renders a sprite. You can render any number of sprites, but there are only 5 positions they can occupy, meaning you generally shouldn't render more than 5. The positions are, from left to right:

- `"left"`
- `"center-left"`
- `"center"`
- `"center-right"`
- `"right"`

If sprites overlap they stack in such a way that the further left the sprite is, the higher it will be in terms of it's z-index, meaning sprites on the left will always overlap on top of sprites to the right.

To render an image, you must provide a numeric ID (for example, Kiana is `101` and Mei is `201`) and an index for the specific sprite you want (`0` is usually the default "neutral" sprite, and sometimes the only sprite).

You can use the `dim` argument to "darken" the sprite; a dimmed sprite will be filtered in such a way that its drop shadow is removed and its brightness is reduced. 

Finally, you can also provide classes to the rendered `<img>` element the sprite uses. The only built-in class is `boost`, which causes the sprite to be pushed slight toward the top of the scene. You must provide classes as an array of strings.

##### Rendering process

The process for rendering a sprite is comprised of several steps, and can take some time to complete. 

First, the existing sprites are checked; if a sprite with the same ID is identified, it's image resource is also checked. If the image resource is the same, the sprite container is left alone and can contribute to the next scene, though its position might be changed if appropriate. If the image resource is different even though the ID is the same, the sprite's container will still be re-used, and the new sprite will be rendered into the same container with a brief crossfade.

Each sprite container that doesn't match an incoming sprite ID is marked as "expired." Any new sprites that are requested that do not match existing IDs are then added to the scene and positioned as appropriate.

Finally all incoming sprites are shown, and then all "expiring" sprites are moved to the highest z-index layer and faded out and then removed from the scene, creating a fast crossfade effect.

### `Render.clear()`

> `Render.clear()`

This method clears all sprites by completely emptying the sprite container. It is run every time a `"portraits"` instruction is run.

## `Scene` API

`Scene` is a class used to construct and play a visual novel scene.

### `Scene` constructor

> `new Scene(data)`

In general, you should never call this constructor, it is documented here for completeness. Instead, you should create or fetch chapter data using the `Data.chapter()` method, or by directly setting the `State.variables.chapter` variable to contain the appropriate chapter information, then call `Scene.loadScene()`.

### `Scene` static properties and methods

#### `Scene.loadScene()`

> `Scene.loadScene()`

Creates and returns a new `Scene` instance using the data stored in the `State.variables.chapter` variable. The recommended way to create a scene instance is to use the `Data.chapter()` method, or to directly set the `State.variables.chapter` variable, then call this method.

When the scene finishes loading, the instance will be stored in the `State.variables.scene` variable, but you can also use the return value from this method to access the instance.

#### `Scene.cleanup()`

> `Scene.cleanup()`

This method should be run after any scene is completed. It cleans up the scene's data and `null`s everything out.

#### `Scene.activateComicMode()`

#### `Scene.endComicMode()`

#### `Scene.comicModeIsActive()`

#### `Scene.clearPortraits()`

#### `Scene.clearText()`

#### `Scene.clearAllContent()`

#### `Scene.renderSpeaker()`

#### `Scene.renderPortraits()`

#### `Scene.renderCG()`

#### `Scene.renderMessage()`

#### `Scene.processInstruction()`

### `Scene` instance properties and methods

#### `Scene#title`

#### `Scene#description`

#### `Scene#patchesForPortraits`

#### `Scene#instruction()`

#### `Scene#playAudio()`

#### `Scene#renderBG()`

#### `Scene#getAllInstuctions()`

#### `Scene#playInstructionList()`

#### `Scene#play()`

#### `Scene#getAllimageAssets()`

#### `Scene#preload()`

#### `Scene#clone()`

#### `Scene#toJSON()`

## Miscellaneous Functions and Methods

### `window.readJSON()`

### `setup.preload()`

### `setup.parse()`

### `setup.typeSkip()`

### `setup.curtain()`

## Events

The engine emits several events. Most of these are emitted on the `document`, or bubble up to the `document`, so that's the best place to listen for them.

### `:sprite-render-start`

Runs when a sprite begins to render. This event is emitted for every sprite rendered individually.

### `:sprite-render-end`

Runs when a sprite is finished rendering. This event is emitted for every sprite rendered individually.

### `:process-instruction-start`

Run just before an instruction (a single command from a scene script) is evaluated.

### `:process-instruction-end`

Run after an instruction (a single command from a scene script) is completed. For instructions that wait on users, this happens *after* the user interacts, as the instruction is not cleared and the next isn't loaded until that happens.

### `:vn-advance`

Run whenever the user advances in visual novel mode. Advancing happens when the instruction is waiting on the user and the user clicks on the text box or presses space and the next instruction is loaded. Note that if a typing animation is playing, the visual novel *will not be advanced*, instead the typing animation will be skipped, so the `:vn-advance` event can only be emitted after the typing animation ends.