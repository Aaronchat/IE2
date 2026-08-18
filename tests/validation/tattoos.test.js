import test from "node:test";
import assert from "node:assert/strict";

import { TATTOO_GENERIC_STYLES, TATTOO_PLACEMENTS } from "../../data/tattoos/config.js";
import { validateTattoos } from "../../engine/validation/tattoos.js";

test("Tattoo data validates against official body regions and the approved initial catalog", () => {
  const result = validateTattoos();
  assert.equal(result.placementCount, 8);
  assert.equal(result.patternCount, 36);
  assert.equal(result.genericStyleCount, 10);
  assert.deepEqual(TATTOO_GENERIC_STYLES.map((record) => record.name), [
    "Traditional", "Neo-Traditional", "Japanese", "Tribal", "Blackwork",
    "Fine-Line", "Watercolor", "Realism", "Geometric", "Biomechanical",
  ]);
  assert.ok(TATTOO_PLACEMENTS.some((placement) => placement.id === "left-arm" && placement.patterns.some((pattern) => pattern.id === "full-sleeve")));
});
