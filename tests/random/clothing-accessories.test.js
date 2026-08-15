import test from "node:test";
import assert from "node:assert/strict";

import { RandomRuntimeState } from "../../engine/selection/random/state.js";
import {
  CLOTHING_PATH_POLICY,
  BUILT_OUTFIT_STRUCTURES,
  SLEEPWEAR_RANDOM_BUCKETS,
  SWIMWEAR_CATALOG_GROUPS,
  HOSIERY_CATALOG_GROUPS,
  selectRandomClothingPath,
  selectRandomBuiltOutfitStructure,
  selectRandomTopBottom,
  selectRandomSwimwear,
  selectRandomHosiery,
  selectRandomOuterwear,
} from "../../engine/selection/random/clothing.js";
import { selectRandomFootwear } from "../../engine/selection/random/footwear.js";
import {
  ACCESSORY_COUNT_WEIGHTS,
  selectRandomAccessories,
} from "../../engine/selection/random/accessories.js";
import {
  PACKAGE_ORGANIZATIONAL_GROUPS,
  selectRandomPackage,
} from "../../engine/selection/random/packages.js";

test("Clothing path preserves approved 75/25 base policy and special decay", () => {
  assert.deepEqual(CLOTHING_PATH_POLICY, [
    { id: "built-outfit", baseWeight: 75, selectedStrength: 90, recovery: 5 },
    { id: "package", baseWeight: 25, selectedStrength: 25, recovery: 5 },
  ]);

  const builtState = new RandomRuntimeState();
  assert.equal(selectRandomClothingPath({ rng: () => 0, state: builtState }), "built-outfit");
  assert.equal(builtState.decay.getBucketStrength("clothing:path:built-outfit"), 90);

  const packageState = new RandomRuntimeState();
  assert.equal(selectRandomClothingPath({ rng: () => 0.99, state: packageState }), "package");
  assert.equal(packageState.decay.getBucketStrength("clothing:path:package"), 25);
});

test("Built Outfit structures are equal base choices with approved 25/50/75/100 recovery", () => {
  assert.deepEqual(
    BUILT_OUTFIT_STRUCTURES.map((entry) => entry.id),
    ["top-bottom", "dress", "one-piece", "swimwear", "sleepwear"],
  );

  const state = new RandomRuntimeState();
  const structure = selectRandomBuiltOutfitStructure({ rng: () => 0, state });
  assert.equal(structure, "top-bottom");
  assert.equal(state.decay.getBucketStrength("clothing:structure:top-bottom"), 25);
  assert.equal(state.lifetime.get("clothing:structure:top-bottom"), 1);
  state.completeGeneration();
  assert.equal(state.decay.getBucketStrength("clothing:structure:top-bottom"), 50);
});

test("Top + Bottom chooses category bucket before individual garment", () => {
  const state = new RandomRuntimeState();
  const outfit = selectRandomTopBottom({ rng: () => 0, state });
  assert.ok(outfit.top?.id);
  assert.ok(outfit.bottom?.id);
  assert.ok(state.decay.bucket.size >= 2);
  assert.equal(state.decay.getItemStrength(`clothing:${outfit.top.id}`), 25);
  assert.equal(state.decay.getItemStrength(`clothing:${outfit.bottom.id}`), 25);
});

test("Lingerie is excluded from Random Sleepwear", () => {
  assert.equal(
    SLEEPWEAR_RANDOM_BUCKETS.some((group) => group.id === "underwear-lingerie"),
    false,
  );
});

test("Swimwear and Hosiery fail closed without Clothing-owned hooks", () => {
  assert.equal(SWIMWEAR_CATALOG_GROUPS.length, 6);
  assert.equal(HOSIERY_CATALOG_GROUPS.length, 3);

  assert.throws(
    () => selectRandomSwimwear({
      rng: () => 0,
      state: new RandomRuntimeState(),
    }),
    /swimwearResolver/,
  );

  assert.throws(
    () => selectRandomHosiery({
      outfit: {},
      rng: () => 0,
      state: new RandomRuntimeState(),
    }),
    /hosieryEligibilityResolver/,
  );

  let observedGroups = 0;
  const resolved = selectRandomSwimwear({
    rng: () => 0,
    state: new RandomRuntimeState(),
    swimwearResolver: ({ catalogGroups }) => {
      observedGroups = catalogGroups.length;
      return { resolvedBy: "clothing" };
    },
  });
  assert.equal(observedGroups, 6);
  assert.deepEqual(resolved, { resolvedBy: "clothing" });

  const noHosiery = selectRandomHosiery({
    outfit: {},
    rng: () => 0,
    state: new RandomRuntimeState(),
    hosieryEligibilityResolver: () => [],
  });
  assert.equal(noHosiery, null);
});

test("Outerwear uses approved static 15/85 activation", () => {
  assert.equal(selectRandomOuterwear({ rng: () => 0, state: new RandomRuntimeState() }), null);
  assert.ok(selectRandomOuterwear({ rng: () => 0.99, state: new RandomRuntimeState() })?.id);
});

test("Footwear always has category-first Random selection available", () => {
  const state = new RandomRuntimeState();
  const footwear = selectRandomFootwear({ rng: () => 0, state });
  assert.ok(footwear.id);
  assert.ok([...state.decay.bucket.keys()].some((key) => key.startsWith("footwear:bucket:")));
  assert.equal(state.decay.getItemStrength(`footwear:${footwear.id}`), 25);
});

test("Accessories use 25/50/25 counts and distinct categories for a two-accessory draw", () => {
  assert.deepEqual(ACCESSORY_COUNT_WEIGHTS, [
    { count: 0, weight: 25 },
    { count: 1, weight: 50 },
    { count: 2, weight: 25 },
  ]);

  const values = [0.9, 0, 0, 0, 0];
  let index = 0;
  const rng = () => values[index++] ?? 0;
  const selected = selectRandomAccessories({ rng, state: new RandomRuntimeState() });

  assert.equal(selected.length, 2);
  assert.notEqual(selected[0].category, selected[1].category);
});

test("Packages use a flat pool rather than organizational Random buckets", () => {
  assert.equal(PACKAGE_ORGANIZATIONAL_GROUPS.length, 6);
  const state = new RandomRuntimeState();
  const selected = selectRandomPackage({ rng: () => 0, state });
  assert.ok(selected.id);
  assert.equal(state.decay.bucket.size, 0);
  assert.equal(state.decay.getItemStrength(`package:${selected.id}`), 25);
});
