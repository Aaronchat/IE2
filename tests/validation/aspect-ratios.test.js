import test from "node:test";
import assert from "node:assert/strict";
import { ASPECT_RATIOS } from "../../data/aspect-ratios/aspect-ratios.js";
import { validateAspectRatios } from "../../engine/validation/aspect-ratios.js";

test("Aspect Ratio validation accepts exactly the two approved ratios", () => {
  assert.deepEqual(validateAspectRatios(), { recordCount: 2 });
  assert.deepEqual(ASPECT_RATIOS.items.map((record) => record.name), ["9:16", "9:19.5"]);
});
