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
const unselected = () => ({ mode: "unselected", values: [] });

test("Primary Outfit Random clears manual primary clothing selections", () => {
  const state = new Map([
    ["clothing.primary-random", random()],
    ["clothing.tops.selection", manual({ value: "top" })],
    ["clothing.bottoms.selection", manual({ value: "bottom" })],
  ]);
  applyModeGuardrails(state, "clothing.primary-random", "random");
  assert.deepEqual(state.get("clothing.tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.bottoms.selection"), unselected());
});

test("manual Top/Bottom clears standalone primary clothing but preserves its pair", () => {
  const state = new Map([
    ["clothing.primary-random", random()],
    ["clothing.tops.selection", unselected()],
    ["clothing.bottoms.selection", manual({ value: "bottom" })],
    ["clothing.dresses.selection", manual({ value: "dress" })],
    ["clothing.packages.selection", manual({ value: "package" })],
  ]);
  applyManualGuardrails(state, "clothing.tops.selection", { value: "top" });
  assert.deepEqual(state.get("clothing.primary-random"), unselected());
  assert.equal(state.get("clothing.bottoms.selection").mode, "manual");
  assert.deepEqual(state.get("clothing.dresses.selection"), unselected());
  assert.deepEqual(state.get("clothing.packages.selection"), unselected());
});

test("manual standalone primary clothing clears Top/Bottom and other standalone structures", () => {
  const state = new Map([
    ["clothing.tops.selection", manual({ value: "top" })],
    ["clothing.bottoms.selection", manual({ value: "bottom" })],
    ["clothing.dresses.selection", manual({ value: "dress" })],
    ["clothing.packages.selection", unselected()],
  ]);
  applyManualGuardrails(state, "clothing.packages.selection", { value: "package" });
  assert.deepEqual(state.get("clothing.tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.bottoms.selection"), unselected());
  assert.deepEqual(state.get("clothing.dresses.selection"), unselected());
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
