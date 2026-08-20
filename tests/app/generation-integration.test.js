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
    tattoos: [],
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
      "effects.effects-imperfections": { mode: "default", values: [] },
      "effects.film-age": { mode: "default", value: null },
    },
    themes: { "themes.selection": { mode: "none", value: null } },
    covers: {
      "covers.type": unset(),
      "covers.style": unset(),
      "covers.era": unset(),
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

test("Age range and exact age selections produce explicit prompt language", () => {
  const rangeUi = baseUi();
  rangeUi.character["character.age"] = manual("age-range-30-39");
  assert.ok(runUiGeneration({ uiState: rangeUi, randomState: new RandomRuntimeState() }).prompt.includes("in her thirties"));

  const exactUi = baseUi();
  exactUi.character["character.age"] = manual("age-27");
  assert.ok(runUiGeneration({ uiState: exactUi, randomState: new RandomRuntimeState() }).prompt.includes("27 years old"));
});

test("Buxom resolves as a Character default", () => {
  const ui = baseUi();
  ui.character["character.chest-description"] = { mode: "default", value: "Buxom" };
  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() });
  assert.ok(generation.prompt.includes("buxom"));
  assert.equal(generation.result.selection.selections.character["chest-description"].mode, "default");
});

test("None converts correctly", () => {
  const ui = baseUi();
  ui["time-of-day"]["time-of-day.selection"] = { mode: "none", value: null };
  ui.camera["effects.film-age"] = { mode: "none", value: null };
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

test("Condition attaches independently to bottoms, outerwear, hosiery, and lingerie", () => {
  const ui = baseUi();
  ui.clothing["clothing.bottoms.mini-skirts.selection"] = manual("pleated-mini-skirt", "mini-skirts");
  ui.clothing["clothing.bottoms.advanced.condition"] = manual("ripped");
  ui.clothing["clothing.outerwear.jackets.selection"] = manual("fitted-leather-jacket", "jackets");
  ui.clothing["clothing.outerwear.advanced.condition"] = manual("weathered");
  ui.clothing["clothing.hosiery.stockings.selection"] = manual("patterned-stockings", "stockings");
  ui.clothing["clothing.hosiery.advanced.condition"] = manual("oil-stained");
  ui.clothing["clothing.lingerie.underwear-lingerie.selection"] = manual("matching-lingerie-set", "underwear-lingerie");
  ui.clothing["clothing.lingerie.advanced.condition"] = manual("blood-stained");
  const prompt = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt;
  for (const fragment of ["ripped pleated mini skirt", "weathered fitted leather jacket", "oil-stained patterned stockings", "blood-stained matching lingerie set"]) {
    assert.ok(prompt.includes(fragment), fragment);
  }
});

test("Condition works for each standalone primary garment structure", () => {
  const cases = [
    ["dresses", "sundresses", "spaghetti-strap-sundress", "blood-stained spaghetti-strap sundress"],
    ["one-piece", "coveralls-boilersuits", "workwear-jumpsuit", "blood-stained workwear jumpsuit"],
    ["sleepwear", "pajama-sets", "silk-button-front-pajama-set", "blood-stained silk button-front pajama set"],
  ];
  for (const [section, groupId, garment, expected] of cases) {
    const ui = baseUi();
    ui.clothing[`clothing.${section}.${groupId}.selection`] = manual(garment, groupId);
    ui.clothing[`clothing.${section}.advanced.condition`] = manual("blood-stained");
    assert.ok(runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt.includes(expected), section);
  }
});

test("Condition applies to a selected Swimwear garment", () => {
  const ui = baseUi();
  ui.clothing["clothing.swimwear.bikini-tops.selection"] = manual("underwire-bikini-top", "bikini-tops");
  ui.clothing["clothing.swimwear.advanced.condition"] = manual("ripped");
  assert.ok(runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt.includes("ripped underwire bikini top"));
});

test("manual bikini top combines with a normal denim mini skirt", () => {
  const ui = baseUi();
  ui.clothing["clothing.swimwear.bikini-tops.selection"] = manual("string-bikini-top", "bikini-tops");
  ui.clothing["clothing.bottoms.mini-skirts.selection"] = manual("denim-mini-skirt", "mini-skirts");
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.clothing.primary, {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: {
      top: { mode: "manual", id: "string-bikini-top", groupId: "bikini-tops" },
      bottom: { mode: "manual", id: "denim-mini-skirt", groupId: "mini-skirts" },
    },
  });
  const prompt = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt;
  assert.ok(prompt.includes("string bikini top"));
  assert.ok(prompt.includes("denim mini skirt"));
});

test("Swimwear UI combines one independently selected top and bottom", () => {
  const ui = baseUi();
  ui.clothing["clothing.swimwear.bikini-tops.selection"] = manual("string-bikini-top", "bikini-tops");
  ui.clothing["clothing.swimwear.bikini-bottoms.selection"] = manual("brazilian-bikini-bottom", "bikini-bottoms");
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.clothing.primary, {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: {
      top: { mode: "manual", id: "string-bikini-top", groupId: "bikini-tops" },
      bottom: { mode: "manual", id: "brazilian-bikini-bottom", groupId: "bikini-bottoms" },
    },
  });
  const prompt = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt;
  assert.ok(prompt.includes("string bikini top"));
  assert.ok(prompt.includes("Brazilian bikini bottom"));
});

test("Swimwear UI rejects two manual selections for the same assembly slot", () => {
  const ui = baseUi();
  ui.clothing["clothing.swimwear.bikini-tops.selection"] = manual("string-bikini-top", "bikini-tops");
  ui.clothing["clothing.swimwear.two-piece-swim-tops.selection"] = manual("cropped-swim-top", "two-piece-swim-tops");
  assert.throws(() => uiStateToGenerationControls(ui), /only one Swimwear top/);
});

test("Package selection converts to the existing package path", () => {
  const ui = baseUi();
  ui.clothing["clothing.packages.sci-fi.selection"] = manual("space-suit", "sci-fi");
  assert.deepEqual(uiStateToGenerationControls(ui).clothing.primary, {
    mode: "manual", path: "package", selection: { mode: "manual", id: "space-suit", groupId: "sci-fi" },
  });
});

test("Twin Peaks package emits its fixed uniform components", () => {
  const ui = baseUi();
  ui.clothing["clothing.packages.occupations.selection"] = manual("twin-peaks-waitress-uniform", "occupations");
  assert.ok(runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() }).prompt.includes(
    "Twin Peaks waitress uniform (white Twin Peaks tank top, plaid shorts, waitress utility belt)",
  ));
});

test("Camera defaults and Effects selections convert correctly", () => {
  const ui = baseUi();
  ui.camera["effects.effects-imperfections"] = multi({ value: "grain", groupId: "effects-imperfections" }, { value: "dust", groupId: "effects-imperfections" });
  const controls = uiStateToGenerationControls(ui);
  assert.deepEqual(controls.camera.framing, { mode: "default" });
  assert.deepEqual(controls.effects["effects-imperfections"], { mode: "manual", ids: ["grain", "dust"] });
});

test("Themes UI adapts None, Manual stacks, and Random without merging other domains", () => {
  const noneControls = uiStateToGenerationControls(baseUi());
  assert.deepEqual(noneControls.themes, { mode: "none" });

  const manualUi = baseUi();
  manualUi.themes["themes.selection"] = unset();
  manualUi.themes["themes.colors.selection"] = multi(
    { value: "red", groupId: "colors" },
    { value: "white", groupId: "colors" },
  );
  manualUi.themes["themes.holidays-events.selection"] = multi({ value: "christmas", groupId: "holidays-events" });
  const generation = runUiGeneration({ uiState: manualUi, randomState: new RandomRuntimeState() });
  assert.deepEqual(generation.controls.themes, { mode: "manual", selections: [
    { id: "red", groupId: "colors" },
    { id: "white", groupId: "colors" },
    { id: "christmas", groupId: "holidays-events" },
  ] });
  assert.ok(generation.prompt.endsWith("Theme: red white Christmas"));

  const randomUi = baseUi();
  randomUi.themes["themes.selection"] = { mode: "random", value: null };
  assert.deepEqual(uiStateToGenerationControls(randomUi).themes, { mode: "random" });
  assert.equal(hasRandomControl(uiStateToGenerationControls(randomUi)), true);
});
