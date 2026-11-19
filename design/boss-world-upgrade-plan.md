# Legend of Corn — Independent Art, Boss & World Upgrade Track
Date: 2026-11-18
Branch: experiment/legend-of-corn-world-boss-magic-20261118
Base: main (independent of feature/legend-of-corn-boss-art-preview)
Status: Design / source audit checkpoint; no game runtime changes.

## Verified source inventory (main)
- The game is a self-contained `legend-of-corn.html` with Canvas drawing.
- `BIGS` defines eight boss types: GIANT CHICKEN (HP16), SNAPPING TURTLE (18), RUNAWAY TRACTOR (20), FARMER WIFE (20), GIANT OWL (20), GIANT SPIDER (18; arrow vulnerability), SUPER TRACTOR (30), TWO ANGRY FARMERS (13 each; kernel vulnerability). Runtime `bossHp()` may scale these base figures.
- The ninth level uses SUPER CORN MAN (final boss, separately drawn by `drawBoss`); this is nine encounters total, ten individually fought dungeon boss entities because the farmer encounter has two.
- Each level has a distinct `LEVEL_LAYOUTS` room path and `LEVEL_MAP_THEMES`. `drawInterior` already uses nine floor color palettes and checker tilework; existing functionality must be preserved.
- The UI uses both Press Start 2P and Nunito. Pixel-HUD text should be legible on phones; don't blanket-replace body fonts.
- No apparent gameplay mana/spell state found in the main gameplay JS; item lantern/charm/whistle and other abilities already exist and require audit before adding any magic.
- Existing `feature/legend-of-corn-boss-art-preview` adds only `preview/boss-art-pass.js` and `preview/boss-art.html`, +2 commits vs main. Preserve, compare, and avoid blind overwrite.

## Upgrade priorities
1. Art-direction bible: original corn/farm fantasy bosses with limited pixel palettes, silhouette and readable hitboxes; conceptual sprite sheets separately before integration. Do not use copied Nintendo graphics, code, or music.
2. Boss test harness: isolated single-boss arena preview, attack state timeline, hit/hurt frames, touch controls, phase transition, victory/defeat, and test reset. Preserve existing boss HP and vulnerability rules initially.
3. Arena tile language: 32-pixel tile grid as current game's TILE, palette variants for farm, pond, stone cellar, orchard, crypt, silo; collision-honest obstacles and decorative tiles clearly distinguished.
4. Magic exploration: explicit energy meter + casts only after ensuring existing item controls/saves and difficulty. Prototype one simple spell in isolated preview; final mechanics require game design review.
5. UI typography: retain clear body/menu copy at mobile sizes, adopt consistent pixel type for in-world labels / boss bars / item interface, with strong contrast.
6. World/settlement pass after boss proof of concept: path network, readable terrain regions, water edges, foliage clusters, landmark silhouettes, transitions, distinct interiors.

## Non-negotiable preservation
- No change to main or Muse's branch without review. No save-key changes; game uses player-local browser persistence.
- No unverified merge or deployment. Keep original game file byte-identical during first isolated prototype.
- Avoid rewriting entire 18MB HTML before obtaining focused regression coverage.
- Do not add decorative hazards that misrepresent collision or cause invisible damage.
- Preserve boss weaknesses, rewards, eight seeds / final progression, touch controls, and existing world-map navigation.
- Verify at least: each dungeon entrance / boss room, boss death rewards, twin boss completion, final boss, pause/map resume, phone viewport, save reload.

## Next engineering checkpoint
Build an additive standalone boss-lab preview (not game-wide replacement) implementing one complete original boss sprite/animation + arena tiles + attacks, and test against the existing game's expectations before adapting more bosses.
