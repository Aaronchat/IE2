import test from "node:test";
import assert from "node:assert/strict";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { uiStateToGenerationControls, hasRandomControl, runUiGeneration } from "../../app/generation-adapter.js";

const manual = (value, groupId = null) => ({ mode: "manual", value: { value, groupId } });
const multi = (...values) => ({ mode: "manual", values });
const unset = () => ({ mode: "unselected", value: null });

function baseUi() {
  return {
    character: { "character.ethnicity": { mode: "default", value: "Caucasian" } },
    clothing: { "clothing.primary-random": unset() },
    footwear: { "footwear.selection": unset() },
    accessories: { "accessories.selection": { mode: "unselected", value: null, values: [] } },
    location: { "location.selection": unset() },
    atmosphere: { "atmosphere.selection": { mode: "unselected", value: null, values: [] } },
    "time-of-day": { "time-of-day.selection": unset() },
    camera: {
      "camera.camera-body": { mode: "default", value: "canon-eos-r5" },
      "camera.capture-medium": { mode: "default", value: "digital" },
      "camera.lens-look": { mode: "default", value: "50mm-standard" },
      "camera.focus-depth": { mode: "default", value: "balanced-focus" },
      "camera.framing": { mode: "default", value: "full-body" },
      "camera.camera-angle": { mode: "default", value: "eye-level" },
      "camera.subject-view": { mode: "default", value: "straight-on-view" },
      "camera.viewer-pov": { mode: "default", value: "direct-portrait-view" },
      "camera.spatial-safe-framing": { mode: "default", value: null },
    },
    effects: {
      "effects.effects-imperfections": { mode: "default", values: [] },
      "effects.film-age": { mode: "default", value: null },
    },
  };
}

test("manual UI state converts into valid Generation input", () => {
  const ui = baseUi();
  ui.location["location.general-locations.selection"] = manual("beach", "general-locations");
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.location, { mode: "manual", id: "beach", groupId: "general-locations" });
});

test("default UI state preserves defaults instead of turning them manual", () => {
  const controls = uiStateToGenerationControls(baseUi());
  assert.deepEqual(controls.character.ethnicity, { mode: "default" });
  assert.deepEqual(controls.camera["camera-body"], { mode: "default" });
  assert.deepEqual(controls.camera["spatial-safe-framing"], { mode: "default" });
  assert.deepEqual(controls.effects["film-age"], { mode: "default" });
});

test("None converts correctly", () => {
  const ui = baseUi();
  ui["time-of-day"]["time-of-day.selection"] = { mode: "none", value: null };
  ui.effects["effects.film-age"] = { mode: "none", value: null };
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.timeOfDay, { mode: "none" });
  assert.deepEqual(controls.effects["film-age"], { mode: "none" });
});

test("Random converts correctly", () => {
  const ui = baseUi();
  ui.footwear["footwear.selection"] = { mode: "random", value: null };
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.footwear, { mode: "random" });
  assert.equal(hasRandomControl(controls), true);
});

test("multi-select converts correctly for Character Features and Accessories", () => {
  const ui = baseUi();
  ui.character["character.features"] = multi("Fox Ears", "Fox Tail");
  ui.accessories["accessories.eyewear.selection"] = multi({ value: "aviator-sunglasses", groupId: "eyewear" });
  ui.accessories["accessories.earrings.selection"] = multi({ value: "stud-earrings", groupId: "earrings" });
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.character.features, { mode: "manual", values: ["Fox Ears", "Fox Tail"] });
  assert.deepEqual(controls.accessories, { mode: "manual", selections: [
    { id: "aviator-sunglasses", groupId: "eyewear" },
    { id: "stud-earrings", groupId: "earrings" },
  ] });
});

test("grouped Clothing Top + Bottom becomes one Built Outfit", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.tank-tops.selection"] = manual("fitted-tank-top", "tank-tops");
  ui.clothing["clothing.bottoms.jeans.selection"] = manual("skinny-jeans", "jeans");
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.clothing.primary, {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: {
      top: { mode: "manual", id: "fitted-tank-top", groupId: "tank-tops" },
      bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" },
    },
  });
});

test("Top Advanced details adapt and generate as part of the selected top", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.tank-tops.selection"] = manual("fitted-tank-top", "tank-tops");
  ui.clothing["clothing.tops.advanced.color"] = manual("burnt-orange");
  ui.clothing["clothing.tops.advanced.fabric"] = manual("cotton");
  ui.clothing["clothing.tops.advanced.condition"] = manual("blood-stained");
  ui.clothing["clothing.tops.advanced.graphic"] = manual("longhorn-emblem");
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() });
  assert.ok(generation.prompt.includes("blood-stained burnt-orange cotton fitted tank top with a Longhorn emblem"));
});

test("Random Top Advanced detail is deterministic and requests a seed", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.tank-tops.selection"] = manual("fitted-tank-top", "tank-tops");
  ui.clothing["clothing.tops.advanced.color"] = { mode: "random", value: null };
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 123 });
  assert.equal(generation.seed, 123);
  assert.match(generation.prompt, /(red|burnt-orange|black|white) fitted tank top/u);
});

test("Top Advanced details cannot silently apply without a top", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.advanced.color"] = manual("red");
  assert.throws(() => uiStateToGenerationControls(ui), /require a selected or Random top/);
});

test("Package selection converts to the existing package path", () => {
  const ui = baseUi();
  ui.clothing["clothing.packages.sci-fi.selection"] = manual("space-suit", "sci-fi");
  assert.deepEqual(uiStateToGenerationControls(ui).clothing.primary, {
    mode: "manual", path: "package", selection: { mode: "manual", id: "space-suit", groupId: "sci-fi" },
  });
});

test("Camera defaults and Effects selections convert correctly", () => {
  const ui = baseUi();
  ui.effects["effects.effects-imperfections"] = multi({ value: "grain", groupId: "effects-imperfections" }, { value: "dust", groupId: "effects-imperfections" });
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.camera.framing, { mode: "default" });
  assert.deepEqual(controls.effects["effects-imperfections"], { mode: "manual", ids: ["grain", "dust"] });
});

test("adapted controls pass through prepareGeneration and return the final prompt", () => {
  const ui = baseUi();
  ui.location["location.general-locations.selection"] = manual("beach", "general-locations");
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() });
  assert.equal(typeof generation.prompt, "string");
  assert.ok(generation.prompt.includes("beach"));
  assert.equal(generation.prompt, generation.result.prompt.prompt);
});

test("Random UI generation receives a seed and uses it normally", () => {
  const ui = baseUi();
  ui.character["character.ethnicity"] = { mode: "random", value: null };
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 123456789 });
  assert.equal(generation.seed, 123456789);
  assert.equal(generation.result.selection.selections.character.ethnicity.mode, "random");
});

test("same explicit UI seed plus equivalent starting Random state is reproducible", () => {
  const ui = baseUi();
  ui.character["character.ethnicity"] = { mode: "random", value: null };
  const a = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 42 });
  const b = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 42 });
  assert.deepEqual(a.result.selection.selections, b.result.selection.selections);
  assert.deepEqual(a.result.randomState.snapshot(), b.result.randomState.snapshot());
  assert.equal(a.prompt, b.prompt);
});

test("the same RandomRuntimeState instance can be reused between UI generations", () => {
  const ui = baseUi();
  ui.character["character.ethnicity"] = { mode: "random", value: null };
  const state = new RandomRuntimeState();
  const first = runUiGeneration({ uiState: ui, randomState: state, createSeed: () => 7 });
  const second = runUiGeneration({ uiState: ui, randomState: state, createSeed: () => 8 });
  assert.equal(first.result.randomState, state);
  assert.equal(second.result.randomState, state);
  assert.equal(Object.values(state.snapshot().lifetime).reduce((a, b) => a + b, 0), 2);
});

test("successful UI generation advances lifecycle exactly once", () => {
  const state = new RandomRuntimeState();
  let completions = 0;
  const original = state.completeGeneration.bind(state);
  state.completeGeneration = () => { completions += 1; original(); };
  runUiGeneration({ uiState: baseUi(), randomState: state });
  assert.equal(completions, 1);
});

test("failed UI generation does not receive an extra completion call", () => {
  const ui = baseUi();
  ui.location["location.general-locations.selection"] = manual("not-a-real-location", "general-locations");
  const state = new RandomRuntimeState();
  let completions = 0;
  state.completeGeneration = () => { completions += 1; };
  assert.throws(() => runUiGeneration({ uiState: ui, randomState: state }), /Unknown Location id/);
  assert.equal(completions, 0);
});

test("invalid conflicting UI selection errors instead of silently inventing a choice", () => {
  const ui = baseUi();
  ui.clothing["clothing.dresses.sundresses.selection"] = manual("spaghetti-strap-sundress", "sundresses");
  ui.clothing["clothing.packages.sci-fi.selection"] = manual("space-suit", "sci-fi");
  assert.throws(() => uiStateToGenerationControls(ui), /only one primary clothing structure or Package/);
});

test("Chest Adjective Random continues to fail closed", () => {
  const ui = baseUi();
  ui.character["character.chest-adjective"] = { mode: "random", value: null };
  assert.throws(
    () => runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 99 }),
    /weights are not approved/,
  );
});

test("non-Random generations do not create a seed but still reuse Random state", () => {
  const state = new RandomRuntimeState();
  let seedCalls = 0;
  const generation = runUiGeneration({ uiState: baseUi(), randomState: state, createSeed: () => { seedCalls += 1; return 1; } });
  assert.equal(seedCalls, 0);
  assert.equal(generation.seed, null);
  assert.equal(generation.result.randomState, state);
});

test("Clothing None omits one top-bottom slot while preserving the other", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.selection"] = { mode: "none", value: null };
  ui.clothing["clothing.bottoms.jeans.selection"] = manual("skinny-jeans", "jeans");
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.clothing.primary, {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: {
      top: { mode: "none" },
      bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" },
    },
  });
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() });
  assert.ok(generation.prompt.includes("skinny jeans"));
  assert.equal(generation.result.prompt.sections.clothing.some((fragment) => fragment.includes("tank top")), false);
  assert.ok(generation.result.prompt.omissions.some((entry) => entry.section === "clothing" && entry.control === "tops" && entry.state === "user-none"));
});

test("Clothing section Random works at the parent level without garment-family Random", () => {
  const ui = baseUi();
  ui.clothing["clothing.tops.selection"] = { mode: "random", value: null };
  ui.clothing["clothing.bottoms.selection"] = { mode: "none", value: null };
  const controls = uiStateToGenerationControls(ui);
  assert.equal(controls.clothing.primary.outfit.top.mode, "random");
  assert.equal(controls.clothing.primary.outfit.bottom.mode, "none");
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState(), createSeed: () => 31415 });
  assert.equal(generation.result.selection.selections.clothing.primary.value.builtOutfit.slotModes.top, "random");
  assert.equal(generation.result.selection.selections.clothing.primary.value.builtOutfit.slotModes.bottom, "none");
});
