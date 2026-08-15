import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";
import { resolveGeneration } from "../../engine/resolution/index.js";
import { resolveRandomSwimwear, resolveRandomHosieryEligibility } from "../../engine/resolution/clothing-compatibility.js";
import { SWIMWEAR_CATALOG_GROUPS, HOSIERY_CATALOG_GROUPS, selectRandomGarmentFromGroups } from "../../engine/selection/random/clothing.js";
import { RandomRuntimeState } from "../../engine/selection/random/state.js";

const location = (id, groupId = "general-locations") => ({ mode: "manual", id, groupId });
const atmosphere = (...ids) => ({ mode: "manual", ids });
function resolve(controls) { return resolveGeneration(selectGeneration({ controls })); }
function status(result, region, side = null) { return result.finalCoverage.find((x) => x.region === region && (x.side ?? null) === side)?.status; }
function tattoo(result, region, side = null) { return result.tattooVisibility.find((x) => x.region === region && (x.side ?? null) === side)?.allowed; }

for (const [id, expectedNone] of [["coffee-shop", true], ["beach", false], ["coffee-shop-large-window", false]]) {
  test(`Location ${id} applies approved Atmosphere environment behavior`, () => {
    const r = resolve({ location: location(id), atmosphere: atmosphere("sunny") });
    assert.equal(r.selections.atmosphere.value.length === 0, expectedNone);
  });
}

test("Resolution-created Atmosphere None preserves original provenance", () => {
  const r = resolve({ location: location("coffee-shop"), atmosphere: atmosphere("sunny") });
  assert.equal(r.selections.atmosphere.mode, "manual");
  assert.equal(r.selections.atmosphere.resolution.action, "resolved-to-none");
  assert.equal(r.selections.atmosphere.resolution.originalValue[0].id, "sunny");
  const userNone = resolve({ location: location("coffee-shop"), atmosphere: { mode: "none" } });
  assert.equal(userNone.selections.atmosphere.mode, "none");
  assert.equal(userNone.selections.atmosphere.resolution, undefined);
});

test("Rainy Neon Alley rejects Clear and permits Non-Clear/Wind; Snowy Village has no invented restriction", () => {
  assert.throws(() => resolve({ location: location("rainy-neon-alley", "event-scene-locations"), atmosphere: atmosphere("sunny") }), /blocked/);
  assert.doesNotThrow(() => resolve({ location: location("rainy-neon-alley", "event-scene-locations"), atmosphere: atmosphere("light-rain") }));
  assert.doesNotThrow(() => resolve({ location: location("rainy-neon-alley", "event-scene-locations"), atmosphere: atmosphere("breezy") }));
  assert.doesNotThrow(() => resolve({ location: location("snowy-village"), atmosphere: atmosphere("sunny") }));
});

test("Atmosphere rejects prohibited pairs and same phenomenon groups, preserving legal pairs", () => {
  assert.throws(() => resolve({ atmosphere: atmosphere("sunny", "light-rain") }), /incompatible/);
  assert.throws(() => resolve({ atmosphere: atmosphere("breezy", "strong-winds") }), /cannot stack/);
  assert.throws(() => resolve({ atmosphere: atmosphere("light-fog", "dense-fog") }), /cannot stack/);
  assert.doesNotThrow(() => resolve({ atmosphere: atmosphere("sunny", "breezy") }));
  assert.doesNotThrow(() => resolve({ atmosphere: atmosphere("light-rain", "breezy") }));
});

test("Built Outfit and Package structures survive Resolution distinctly", () => {
  const built = resolve({ clothing: { primary: { mode: "manual", path: "built-outfit", structure: "top-bottom", outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { id: "skinny-jeans", groupId: "jeans" } } } } });
  assert.equal(built.selections.clothing.primary.value.path, "built-outfit");
  const pkg = resolve({ clothing: { primary: { mode: "manual", path: "package", id: "basketball-uniform", groupId: "athletic" } } });
  assert.equal(pkg.selections.clothing.primary.value.path, "package");
  assert.equal(status(pkg, "groin"), "covered");
});

test("Coverage merges Clothing, Footwear, Accessories conservatively and drives tattoo visibility", () => {
  const r = resolve({
    clothing: { primary: { mode: "manual", path: "built-outfit", structure: "top-bottom", outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { id: "skinny-jeans", groupId: "jeans" } } } },
    footwear: { mode: "manual", id: "cowboy-boots", groupId: "boots" },
    accessories: { mode: "manual", selections: [{ id: "leather-gloves", groupId: "gloves" }] },
  });
  assert.equal(status(r, "foot", "left"), "covered");
  assert.equal(status(r, "lower-leg", "left"), "covered");
  assert.equal(status(r, "wrist", "left"), "partiallyCovered");
  assert.equal(tattoo(r, "wrist", "left"), false);
  assert.equal(tattoo(r, "foot", "left"), false);
  assert.equal(tattoo(r, "face", "left"), true);
});

test("Manual Lingerie is preserved and contributes coverage", () => {
  const r = resolve({ clothing: { lingerie: { mode: "manual", id: "bra-and-panty-set", groupId: "underwear-lingerie" } } });
  assert.equal(r.selections.clothing.lingerie.mode, "manual");
  assert.notEqual(status(r, "groin"), "uncovered");
});

test("Approved Swimwear resolver completes top/bottom and leaves one-piece complete", () => {
  const pair = resolveRandomSwimwear({ rng: () => 0, state: new RandomRuntimeState(), catalogGroups: SWIMWEAR_CATALOG_GROUPS, selectRandomGarmentFromGroups });
  assert.equal(pair.length, 2);
  const onePieceFirst = [SWIMWEAR_CATALOG_GROUPS[4]];
  const single = resolveRandomSwimwear({ rng: () => 0, state: new RandomRuntimeState(), catalogGroups: onePieceFirst, selectRandomGarmentFromGroups });
  assert.equal(single.length, 1);
});

test("Approved Hosiery eligibility allows dresses, skirts/skorts only", () => {
  const eligible = (builtOutfit) => resolveRandomHosieryEligibility({ outfit: { path: "built-outfit", builtOutfit }, catalogGroups: HOSIERY_CATALOG_GROUPS });
  const dress = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "built-outfit", structure: "dress", outfit: { id: "spaghetti-strap-sundress", groupId: "sundresses" } } } } }).selections.clothing.primary.value.builtOutfit;
  assert.equal(eligible(dress).length, 3);
  const skirt = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "built-outfit", structure: "top-bottom", outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { id: "mini-skirt", groupId: "mini-skirts" } } } } } }).selections.clothing.primary.value.builtOutfit;
  assert.equal(eligible(skirt).length, 3);
  const jeans = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "built-outfit", structure: "top-bottom", outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { id: "skinny-jeans", groupId: "jeans" } } } } } }).selections.clothing.primary.value.builtOutfit;
  assert.equal(eligible(jeans).length, 0);
});

test("Selection uses approved Clothing resolvers by default without changing explicit override hooks", () => {
  assert.doesNotThrow(() => selectGeneration({ controls: { clothing: { primary: { mode: "random" } } }, random: { seed: 7 } }));
  const custom = selectGeneration({ controls: { clothing: { primary: { mode: "random" } } }, random: { seed: 7, swimwearResolver: () => Object.freeze([{ id: "custom" }]) } });
  assert.ok(custom.selections.clothing.primary);
});
