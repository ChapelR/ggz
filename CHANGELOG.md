# Version 0.2.1

## Technical
- Added `(CN:...)` and `(JP:...)` to recognized syntax for translator's notes.
- Added script custom parsing. Will probably fork this into a separate VN engine eventually.

## Meta
- Improved build process.

# Version 0.2.0

## Technical
- Added patching tools to arbitrarily change portraits in scenes. This was used to fix chapter 4, where corrupted Mei is never normally removed from the scene.
- The engine now parses TNs, but they are simply culled before rendering. I need to find a way to make them available to players.
- Created "comic mode" to play CGs with no text box and allow clicking the entire screen (except the `<nav>` element) to advance to the next CG. Comic mode scenes must be identified in the code, the JSON files no nothing of them. You cannot switch between VN-mode and comic mode, each scene must be one or the other.
- Added the "curtain," which marks transitions between "parts" of a scene.
- Removed assets that weren't being used from the game archive.
- Minor tweaks and improvements.

## Content
- Added additional missing prologue content as separate episodes.
- Added chapters: Extra 2, Chapter 4, Chapter 5, and Extra 3. I believe this is the rest of the re-translated chapters currently available from the GGZ interpreter project.
- Altered certain backgrounds and music to better fit the game environments.

## Meta
- Added credits to the re-translation team at [Hoyostans](https://hoyostans.be/) to the game, README, and Itch.io page.