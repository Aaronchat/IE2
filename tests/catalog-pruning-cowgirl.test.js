import test from "node:test";
import assert from "node:assert/strict";

import { LOCATION_RANDOM_BUCKETS } from "../engine/selection/random/locations.js";
import { ATMOSPHERE_RANDOM_BUCKETS } from "../engine/selection/random/atmosphere.js";
import { PACKAGE_ORGANIZATIONAL_GROUPS } from "../engine/selection/random/packages.js";

const flatItems = (groups) => groups.flatMap((group) => group.items);

test("retired cyberpunk locations are not in the active location catalog", () => {
  const ids = new Set(flatItems(LOCATION_RANDOM_BUCKETS).map((record) => record.id));
  assert.equal(ids.has("cyberpunk-city"), false);
  assert.equal(ids.has("rainy-neon-alley"), false);
});

test("retired neon weather is not in the active atmosphere catalog", () => {
  const ids = new Set(flatItems(ATMOSPHERE_RANDOM_BUCKETS).map((record) => record.id));
  for (const id of ["neon-rain", "neon-fog", "neon-mist", "neon-snow"]) {
    assert.equal(ids.has(id), false, `${id} should be retired`);
  }
});

test("Cowgirl expands to outfit parts and Cow Costume stays separate", () => {
  const packages = flatItems(PACKAGE_ORGANIZATIONAL_GROUPS);
  const cowgirl = packages.find((record) => record.id === "cowgirl");
  const cowCostume = packages.find((record) => record.id === "cow-costume");

  assert.ok(cowgirl);
  assert.equal(
    cowgirl.prompt,
    "cowgirl outfit (cowboy boots, denim shorts, plaid tied-up shirt, cowboy hat)",
  );
  assert.ok(cowCostume);
  assert.equal(cowCostume.prompt, "cow costume");
});

test("sci-fi exosuit packages remain available", () => {
  const ids = new Set(flatItems(PACKAGE_ORGANIZATIONAL_GROUPS).map((record) => record.id));
  assert.equal(ids.has("tactical-exosuit"), true);
});
