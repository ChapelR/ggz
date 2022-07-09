# Version 0.3.0

## Technical
- Rewrote and reimplemented sprite rendering. The engine now supports any number of sprites, which can be assigned to one of five positions. Sprites now transition more smoothly between indexed image sources using crossfades, quickly fade when removed from the scene, smoothly transition in and out of dimmed mode, and can be smoothly translated across the screen to different positions.
- Changed default sprite positions to more evenly use the available screen real estate.
- Added "offsets" to specific sprites to position them correctly. Characters are often positioned in slightly different places within the PNG transparency, often times even the same character will have sprites with slight deviations to the left or right. I added offsets to compensate for these inconsistencies in sprites where they seemed to be unintentional (some sprites with these different positions are clearly intended to be the way they are as a brute-force method of positioning).
- Redesigned chapter select menu to better utilize available screen space, and to allow users to swap between episode lists for each chapter. The menu should remember the last chapter you've played and automatically display that episode list.
- Added `(CN:...)` and `(JP:...)` to recognized syntax for translator's notes.
- Added script custom parsing. Will probably fork this into a separate VN engine eventually, but it's still very tied to GGZ-style data and very opinionated in that regard.
- Added "debugging mode" (which is activated automatically on localhost) and some debugging tools and test scenes.
- Several code-side improvements and changes.

## Content
- Altered the main VN mode font (for numbers only). I liked the font for letters, but not for numbers.
- Added "Sakura" boss chapter. Not sure where this fits in the story, but it was short and easy to add, and I wanted to add *something* to the content to justify releasing an update.

## Meta
- Improved build process and added code compression.
- Started rough outline of API docs.

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