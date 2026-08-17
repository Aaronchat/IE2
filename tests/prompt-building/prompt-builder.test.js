import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { selectGeneration } from "../../engine/selection/index.js";
import { resolveGeneration } from "../../engine/resolution/index.js";
import { buildPrompt, PROMPT_SECTION_ORDER } from "../../engine/prompt-building/index.js";

function resolve(controls = {}, random = {}) {
  return resolveGeneration(selectGeneration({ controls, random }));
}

function withCharacter(overrides = {}) {
  return {
    ethnicity: { mode: "manual", value: "Caucasian" },
    ...overrides,
  };
}

test("same resolved state produces the same structured result and final prompt", () => {
  const state = resolve({ location: { mode: "manual", id: "beach", groupId: "general-locations" } });
  assert.deepEqual(buildPrompt(state), buildPrompt(state));
});

test("canonical section ordering is fixed", () => {
  assert.deepEqual(PROMPT_SECTION_ORDER, ["character", "clothing", "footwear", "accessories", "location", "atmosphere", "timeOfDay", "camera", "effects", "themes"]);
});

test("Character uses approved deterministic formatting and includes Name first", () => {
  const state = resolve({ character: withCharacter({
    name: { mode: "manual", value: "Emily" },
    "hair-length": { mode: "manual", value: "Long" },
    "hair-color": { mode: "manual", value: "Blonde" },
    "eye-color": { mode: "manual", value: "Blue" },
    makeup: { mode: "manual", value: "Pin-Up" },
    "skin-tone": { mode: "manual", value: "Fair" },
    freckles: { mode: "manual", value: "Off" },
    build: { mode: "manual", value: "Natural" },
    "chest-adjective": { mode: "manual", value: "Very" },
    "chest-description": { mode: "manual", value: "Busty" },
    "hip-width": { mode: "manual", value: "Wide" },
    waist: { mode: "manual", value: "Well Defined" },
  }) });
  assert.deepEqual(buildPrompt(state).sections.character, ["Emily", "Caucasian", "long hair", "blonde hair", "blue eyes", "pin-up makeup", "fair skin", "natural build", "very busty", "wide hips", "well defined waist"]);
  assert.equal(buildPrompt(state).prompt.startsWith("Emily, Caucasian"), true);
});

test("Character chest without an adjective emits the description alone and Freckles Off stays silent", () => {
  const state = resolve({ character: withCharacter({
    "chest-description": { mode: "manual", value: "Busty" },
    freckles: { mode: "manual", value: "Off" },
  }) });
  assert.deepEqual(buildPrompt(state).sections.character, ["Caucasian", "busty"]);
});

test("empty optional sections create no broken punctuation", () => {
  const state = resolve({ timeOfDay: { mode: "none" }, atmosphere: { mode: "none" } });
  const result = buildPrompt(state);
  assert.equal(result.prompt.includes(", ,"), false);
  assert.equal(result.prompt.startsWith(","), false);
  assert.equal(result.prompt.endsWith(","), false);
});

test("user-selected None emits no positive fragment and remains distinguishable", () => {
  const state = resolve({ atmosphere: { mode: "none" }, timeOfDay: { mode: "none" } });
  const result = buildPrompt(state);
  assert.deepEqual(result.sections.atmosphere, []);
  assert.deepEqual(result.sections.timeOfDay, []);
  assert.ok(result.omissions.some((x) => x.section === "atmosphere" && x.state === "user-none"));
  assert.ok(result.omissions.some((x) => x.section === "timeOfDay" && x.state === "user-none"));
});

test("Resolution-suppressed indoor Atmosphere emits no fragment and preserves suppression distinction", () => {
  const state = resolve({
    location: { mode: "manual", id: "coffee-shop", groupId: "general-locations" },
    atmosphere: { mode: "manual", ids: ["sunny"] },
  });
  const result = buildPrompt(state);
  assert.deepEqual(result.sections.atmosphere, []);
  assert.ok(result.omissions.some((x) => x.section === "atmosphere" && x.state === "resolution-suppressed"));
});

test("outdoor Atmosphere survives and two legal selections emit in catalog order", () => {
  const state = resolve({
    location: { mode: "manual", id: "beach", groupId: "general-locations" },
    atmosphere: { mode: "manual", ids: ["breezy", "sunny"] },
  });
  assert.deepEqual(buildPrompt(state).sections.atmosphere, ["sunny", "breezy"]);
});

test("Time of Day emits in its canonical position", () => {
  const state = resolve({
    location: { mode: "manual", id: "beach", groupId: "general-locations" },
    atmosphere: { mode: "manual", ids: ["sunny"] },
    timeOfDay: { mode: "manual", id: "sunset" },
  });
  const result = buildPrompt(state);
  assert.deepEqual(result.sections.timeOfDay, ["at sunset"]);
  assert.ok(result.prompt.indexOf("sunny") < result.prompt.indexOf("at sunset"));
  assert.ok(result.prompt.indexOf("at sunset") < result.prompt.indexOf("captured with a Canon EOS R5"));
});

test("Camera defaults emit authoritative prompts in stable control order while Spatial-Safe default None stays silent", () => {
  const result = buildPrompt(resolve()).sections.camera;
  assert.deepEqual(result, [
    "captured with a Canon EOS R5",
    "digital photography",
    "50mm standard lens",
    "balanced focus",
    "full-body framing",
    "at eye level",
    "straight-on subject view",
    "direct portrait viewpoint",
  ]);
});

test("manual/default provenance does not alter Camera phrase ordering", () => {
  const controls = { camera: {
    "camera-body": { mode: "manual", id: "canon-eos-r5" },
    "capture-medium": { mode: "manual", id: "digital" },
    "lens-look": { mode: "manual", id: "50mm-standard" },
    "focus-depth": { mode: "manual", id: "balanced-focus" },
    framing: { mode: "manual", id: "full-body" },
    "camera-angle": { mode: "manual", id: "eye-level" },
    "subject-view": { mode: "manual", id: "straight-on-view" },
    "viewer-pov": { mode: "manual", id: "direct-portrait-view" },
  } };
  assert.deepEqual(buildPrompt(resolve(controls)).sections.camera, buildPrompt(resolve()).sections.camera);
});

test("Effects stack in control order and multi-select catalog order", () => {
  const state = resolve({ effects: {
    "effects-imperfections": { mode: "manual", ids: ["scratches", "grain"] },
    "film-age": { mode: "manual", id: "damaged-archive" },
  } });
  assert.deepEqual(buildPrompt(state).sections.effects, ["film grain", "surface scratches", "damaged archival image"]);
});

test("Effects default None states are silent and preserved as default-none omissions", () => {
  const result = buildPrompt(resolve());
  assert.deepEqual(result.sections.effects, []);
  assert.ok(result.omissions.some((x) => x.section === "effects" && x.control === "effects-imperfections" && x.state === "default-none"));
  assert.ok(result.omissions.some((x) => x.section === "effects" && x.control === "film-age" && x.state === "default-none"));
});

test("Themes emit one compact final fragment after Effects", () => {
  const result = buildPrompt(resolve({
    effects: { "film-age": { mode: "manual", id: "damaged-archive" } },
    themes: { mode: "manual", selections: [
      { id: "halloween" },
      { id: "christmas" },
    ] },
  }));
  assert.deepEqual(result.sections.effects, ["damaged archival image"]);
  assert.deepEqual(result.sections.themes, ["Theme: Christmas and Halloween"]);
  assert.ok(result.prompt.indexOf("damaged archival image") < result.prompt.indexOf("Theme: Christmas and Halloween"));
  assert.ok(result.prompt.endsWith("Theme: Christmas and Halloween"));
});

test("Theme stacks use compact catalog order without dominance semantics", () => {
  const colors = buildPrompt(resolve({ themes: { mode: "manual", selections: [{ id: "white" }, { id: "red" }] } }));
  assert.deepEqual(colors.sections.themes, ["Theme: red and white"]);

  const aesthetics = buildPrompt(resolve({ themes: { mode: "manual", selections: [
    { id: "noir" }, { id: "gothic" }, { id: "western" },
  ] } }));
  assert.deepEqual(aesthetics.sections.themes, ["Theme: Gothic Western Noir"]);
});

test("Theme None emits nothing and remains distinguishable", () => {
  const result = buildPrompt(resolve({ themes: { mode: "none" } }));
  assert.deepEqual(result.sections.themes, []);
  assert.equal(result.prompt.includes("Theme:"), false);
  assert.ok(result.omissions.some((entry) => entry.section === "themes" && entry.state === "user-none"));
});

test("Built Outfit emits its authoritative garment prompts in structure order", () => {
  const state = resolve({ clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { id: "skinny-jeans", groupId: "jeans" } },
  } } });
  assert.deepEqual(buildPrompt(state).sections.clothing.slice(0, 2), ["fitted tank top", "skinny jeans"]);
});

test("Top Advanced details wrap the garment in stable prompt order", () => {
  const state = resolve({ clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { id: "fitted-tank-top", groupId: "tank-tops" }, bottom: { mode: "none" } },
    details: { top: {
      color: { mode: "manual", id: "burnt-orange" },
      fabric: { mode: "manual", id: "cotton" },
      condition: { mode: "manual", id: "blood-stained" },
      graphic: { mode: "manual", id: "longhorn-emblem" },
    } },
  } } });
  assert.deepEqual(buildPrompt(state).sections.clothing, ["blood-stained burnt-orange cotton fitted tank top with a Longhorn emblem"]);
});

test("Package emits only the authoritative Package prompt and does not emit Package-local components", () => {
  const state = resolve({ clothing: { primary: { mode: "manual", path: "package", id: "basketball-uniform", groupId: "athletic" } } });
  const primary = state.selections.clothing.primary.value.package;
  const result = buildPrompt(state);
  assert.deepEqual(result.sections.clothing, [primary.prompt]);
  for (const component of primary.components ?? []) assert.equal(result.prompt.includes(component.name), false);
});

test("Footwear emits exactly once and Accessories multi-select uses deterministic catalog order", () => {
  const state = resolve({
    footwear: { mode: "manual", id: "cowboy-boots", groupId: "boots" },
    accessories: { mode: "manual", selections: [
      { id: "leather-gloves", groupId: "gloves" },
      { id: "crossbody-bag", groupId: "bags" },
    ] },
  });
  const result = buildPrompt(state);
  assert.equal(result.sections.footwear.length, 1);
  assert.deepEqual(result.sections.accessories, ["crossbody bag", "leather gloves"]);
  assert.equal(result.fragments.filter((x) => x === result.sections.footwear[0]).length, 1);
});

test("structured sections flatten exactly to fragments and final prompt", () => {
  const result = buildPrompt(resolve({
    location: { mode: "manual", id: "beach", groupId: "general-locations" },
    timeOfDay: { mode: "manual", id: "sunset" },
  }));
  const flattened = PROMPT_SECTION_ORDER.flatMap((section) => result.sections[section]);
  assert.deepEqual(result.fragments, flattened);
  assert.equal(result.prompt, flattened.join(", "));
});

test("Prompt Building rejects structurally invalid input instead of repairing it", () => {
  assert.throws(() => buildPrompt(null), /resolved generation state/);
  assert.throws(() => buildPrompt({ selections: {} }), /Character selections/);
});

test("Prompt Building does not invoke Selection, Resolution, Random completion, or mutate Random state", () => {
  const state = resolve({ character: { ethnicity: { mode: "random" } } }, { seed: 42 });
  const before = state.randomState.snapshot();
  buildPrompt(state);
  assert.deepEqual(state.randomState.snapshot(), before);

  const source = fs.readFileSync(new URL("../../engine/prompt-building/index.js", import.meta.url), "utf8");
  assert.equal(/selectGeneration|resolveGeneration|completeGeneration\s*\(/u.test(source), false);
});

test("Clothing None omits only that top-bottom slot from the prompt", () => {
  const state = resolve({ clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { mode: "none" }, bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" } },
  } } });
  const result = buildPrompt(state);
  assert.deepEqual(result.sections.clothing, ["skinny jeans"]);
  assert.ok(result.omissions.some((entry) => entry.section === "clothing" && entry.control === "tops" && entry.state === "user-none"));
});
