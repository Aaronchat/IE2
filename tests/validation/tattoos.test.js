import test from "node:test";
import assert from "node:assert/strict";
import { TATTOO_GENERIC_STYLES, TATTOO_PLACEMENTS } from "../../data/tattoos/config.js";
import { validateTattoos } from "../../engine/validation/tattoos.js";

test("Tattoo validation accepts the approved initial data", () => {
  const result = validateTattoos();
  assert.equal(result.placementCount, 8);
  assert.equal(result.genericStyleCount, 10);
  assert.ok(result.patternCount > 20);
});

test("Tattoo data exposes the exact approved initial Generic styles", () => {
  assert.deepEqual(TATTOO_GENERIC_STYLES.map((entry) => entry.name), [
    "Traditional", "Neo-Traditional", "Japanese", "Tribal", "Blackwork", "Fine-Line", "Watercolor", "Realism", "Geometric", "Biomechanical",
  ]);
  assert.ok(TATTOO_PLACEMENTS.find((entry) => entry.id === "left-arm").patterns.some((entry) => entry.id === "full-sleeve"));
});
