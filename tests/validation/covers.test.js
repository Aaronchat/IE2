import test from "node:test";
import assert from "node:assert/strict";

import { COVER_TYPES } from "../../data/covers/cover-types.js";
import { COVER_STYLE_GROUPS } from "../../data/covers/styles.js";
import { COVER_ERAS } from "../../data/covers/eras.js";
import { COVERS_CONFIG } from "../../data/covers/config.js";
import { validateCovers } from "../../engine/validation/covers.js";

const catalogs = () => structuredClone({ types: COVER_TYPES, styles: COVER_STYLE_GROUPS, eras: COVER_ERAS });

test("initial Covers catalogs and contextual configuration validate", () => {
  assert.deepEqual(validateCovers(), { typeCount: 5, styleCount: 12, eraCount: 8 });
});

test("Covers validation rejects Random as data and unapproved Movie Poster styles", () => {
  const randomRecord = catalogs();
  randomRecord.types.items[0] = { id: "random", name: "Random", prompt: "random" };
  assert.throws(() => validateCovers(randomRecord), /approved Covers catalog|Random/);

  const invented = catalogs();
  invented.styles.push({ id: "movie-poster-styles", name: "Movie Poster Style", defaults: { enabled: true, selectionWeight: 1 }, items: [] });
  assert.throws(() => validateCovers(invented), /exactly four|Movie Poster styles/);
});

test("Covers validation rejects changed contextual mappings", () => {
  const config = structuredClone(COVERS_CONFIG);
  config.styleGroupByType.novel = "album-styles";
  assert.throws(() => validateCovers(catalogs(), config), /contextual Style mappings/);
});
