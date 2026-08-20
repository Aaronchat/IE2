import test from "node:test";
import assert from "node:assert/strict";
import { TATTOO_PLACEMENTS } from "../../data/tattoos/config.js";

test("Abdomen exposes upper/lower small and large patterns for Random Tattoos", () => {
  const ids = TATTOO_PLACEMENTS.find((entry) => entry.id === "abdomen").patterns.map((entry) => entry.id);
  for (const id of ["upper-small", "upper-large", "lower-small", "lower-large"]) assert.ok(ids.includes(id));
});
