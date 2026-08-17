import assert from "node:assert/strict";
import test from "node:test";
import { CHARACTER_NAMES } from "../../data/character/names.js";
import {
  activeCharacterEthnicity,
  applyManualGuardrails,
  applyModeGuardrails,
  canAddManualSelection,
  eligibleNameGroups,
} from "../../app/ui-guardrails.js";

const manual = (...values) => ({ mode: "manual", values });
const random = () => ({ mode: "random", values: [] });
const none = () => ({ mode: "none", values: [] });
const unselected = () => ({ mode: "unselected", values: [] });

test("Primary Outfit Random clears primary clothing section actions and family selections", () => {
  const state = new Map([
    ["clothing.primary-random", random()],
    ["clothing.tops.selection", none()],
    ["clothing.tops.tank-tops.selection", manual({ value: "top" })],
    ["clothing.bottoms.jeans.selection", manual({ value: "bottom" })],
  ]);
  applyModeGuardrails(state, "clothing.primary-random", "random");
  assert.deepEqual(state.get("clothing.tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.tops.tank-tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.bottoms.jeans.selection"), unselected());
});

test("manual Top/Bottom family choice clears standalone primary clothing but preserves its pair", () => {
  const state = new Map([
    ["clothing.primary-random", random()],
    ["clothing.tops.selection", none()],
    ["clothing.tops.tank-tops.selection", unselected()],
    ["clothing.bottoms.jeans.selection", manual({ value: "bottom" })],
    ["clothing.dresses.sundresses.selection", manual({ value: "dress" })],
    ["clothing.packages.sci-fi.selection", manual({ value: "package" })],
  ]);
  applyManualGuardrails(state, "clothing.tops.tank-tops.selection", { value: "top" });
  assert.deepEqual(state.get("clothing.primary-random"), unselected());
  assert.deepEqual(state.get("clothing.tops.selection"), unselected());
  assert.equal(state.get("clothing.bottoms.jeans.selection").mode, "manual");
  assert.deepEqual(state.get("clothing.dresses.sundresses.selection"), unselected());
  assert.deepEqual(state.get("clothing.packages.sci-fi.selection"), unselected());
});

test("changing a Top garment preserves its Advanced details", () => {
  const state = new Map([
    ["clothing.tops.selection", unselected()],
    ["clothing.tops.tank-tops.selection", manual({ value: "old-top" })],
    ["clothing.tops.blouses.selection", unselected()],
    ["clothing.tops.advanced.color", manual({ value: "red" })],
    ["clothing.tops.advanced.condition", manual({ value: "ripped" })],
  ]);
  applyManualGuardrails(state, "clothing.tops.blouses.selection", { value: "new-top" });
  assert.deepEqual(state.get("clothing.tops.tank-tops.selection"), unselected());
  assert.equal(state.get("clothing.tops.advanced.color").mode, "manual");
  assert.equal(state.get("clothing.tops.advanced.condition").mode, "manual");
});

test("changing an Advanced Top detail does not clear the selected garment", () => {
  const state = new Map([
    ["clothing.tops.selection", unselected()],
    ["clothing.tops.tank-tops.selection", manual({ value: "top" })],
    ["clothing.tops.advanced.color", unselected()],
  ]);
  applyManualGuardrails(state, "clothing.tops.advanced.color", { value: "red" });
  assert.equal(state.get("clothing.tops.tank-tops.selection").mode, "manual");
});

test("manual standalone primary clothing clears Top/Bottom and other standalone structures", () => {
  const state = new Map([
    ["clothing.tops.tank-tops.selection", manual({ value: "top" })],
    ["clothing.bottoms.jeans.selection", manual({ value: "bottom" })],
    ["clothing.dresses.sundresses.selection", manual({ value: "dress" })],
    ["clothing.packages.sci-fi.selection", unselected()],
  ]);
  applyManualGuardrails(state, "clothing.packages.sci-fi.selection", { value: "package" });
  assert.deepEqual(state.get("clothing.tops.tank-tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.bottoms.jeans.selection"), unselected());
  assert.deepEqual(state.get("clothing.dresses.sundresses.selection"), unselected());
});

test("Clothing section Random/None clears manual choices inside only that section", () => {
  const state = new Map([
    ["clothing.tops.selection", unselected()],
    ["clothing.tops.tank-tops.selection", manual({ value: "top" })],
    ["clothing.bottoms.jeans.selection", manual({ value: "bottom" })],
  ]);
  state.get("clothing.tops.selection").mode = "none";
  applyModeGuardrails(state, "clothing.tops.selection", "none");
  assert.deepEqual(state.get("clothing.tops.tank-tops.selection"), unselected());
  assert.equal(state.get("clothing.bottoms.jeans.selection").mode, "manual");
});

test("split-domain Random/None clears manual selections and manual selection clears the action", () => {
  const state = new Map([
    ["atmosphere.selection", random()],
    ["atmosphere.clear.selection", manual({ value: "clear" })],
    ["atmosphere.wind.selection", unselected()],
  ]);
  applyModeGuardrails(state, "atmosphere.selection", "none");
  assert.deepEqual(state.get("atmosphere.clear.selection"), unselected());

  applyManualGuardrails(state, "atmosphere.wind.selection", { value: "breeze" });
  assert.deepEqual(state.get("atmosphere.selection"), unselected());
});

test("Accessories and Atmosphere reject a third manual selection across categories", () => {
  const accessories = new Map([
    ["accessories.eyewear.selection", manual({ value: "a" })],
    ["accessories.rings.selection", manual({ value: "b" })],
  ]);
  assert.equal(canAddManualSelection(accessories, "accessories.gloves.selection", { value: "c" }).allowed, false);

  const atmosphere = new Map([
    ["atmosphere.clear.selection", manual({ value: "a" })],
    ["atmosphere.wind.selection", manual({ value: "b" })],
  ]);
  assert.equal(canAddManualSelection(atmosphere, "atmosphere.non-clear.selection", { value: "c" }).allowed, false);
});

test("changing Ethnicity clears an incompatible manual Name", () => {
  const caucasian = CHARACTER_NAMES.ethnicities.find((entry) => entry.name === "Caucasian");
  const other = CHARACTER_NAMES.ethnicities.find((entry) => entry.name !== "Caucasian");
  const state = new Map([
    ["character.ethnicity", { mode: "default", values: ["Caucasian"] }],
    ["character.name", manual({ value: caucasian.names[0] })],
  ]);
  applyManualGuardrails(state, "character.ethnicity", { value: other.name });
  assert.deepEqual(state.get("character.name"), unselected());
});

test("manual Name options follow the active Ethnicity and disappear for Random Ethnicity", () => {
  const groups = CHARACTER_NAMES.ethnicities.map((entry) => ({ label: entry.name, options: entry.names }));
  const state = new Map([["character.ethnicity", { mode: "default", values: ["Caucasian"] }]]);
  assert.equal(activeCharacterEthnicity(state), "Caucasian");
  assert.deepEqual(eligibleNameGroups(state, groups).map((entry) => entry.label), ["Caucasian"]);

  state.set("character.ethnicity", random());
  assert.equal(activeCharacterEthnicity(state), null);
  assert.deepEqual(eligibleNameGroups(state, groups), []);
});
