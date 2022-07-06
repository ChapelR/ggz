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