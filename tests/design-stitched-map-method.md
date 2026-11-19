# The Stitched Map Method — learned 2026-11-18 (Michael's lesson, from the LttP Player's Guide)

**The rule: a game map is not a chart ABOUT the world. It is the world itself,
screen by screen, joined into one picture.** The Nintendo Player's Guide maps
look real because they are stitched from the game's own screens — same cliffs,
same trees, same water, at small scale. A hand-drawn diagram (flat region
colors + icons + labels) reads as a diagram no matter how you decorate it.

## How to build one (the v39 way, reusable in any tile/screen game)
1. **Paint from the game's own data.** For each screen, load it through the
   game's real loader, then paint its actual contents (ground checker, every
   obstacle/feature at its true position) scaled into the map cell. Never
   invent map art the fields don't have.
2. **Snapshot and restore.** Loading screens has side effects (here:
   loadOwScreen charts every field it loads and re-routes the music). Snapshot
   everything the loader touches (position, mode, visited set, player spot),
   restore after, reload the player's real context, restart the right music.
   The map must never change the game.
3. **Fog stays honest.** Unvisited screens are not painted at all — the
   stitch only covers charted ground, so discovery still means something.
4. **Cache by state signature.** Rebuilding 128 screens costs ~200–500ms.
   Cache the stitched canvas keyed on (world, visited count, found count,
   completion counts); reuse it until the signature changes.
5. **Markers are a separate layer.** Badges, you-are-here, secret markers and
   region names draw AFTER the stitch — and the old chart icons stand down
   wherever the real building is painted, or they cover it.
6. **The map tells the truth about density.** If the map looks empty, the
   FIELDS are empty — the fix is world content (cliff faces, packed woods),
   not map decoration. Diagnose the map, treat the world.

First shipped in Legend of Corn v39 (paintFieldTiles39 / stitchMap39 in
legend-of-corn.html; tests: harness-v39).
