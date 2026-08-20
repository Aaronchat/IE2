import assert from "node:assert/strict";
import test from "node:test";
import { CHARACTER_NAMES } from "../../data/character/names.js";
import {
  activeCharacterEthnicity,
  applyManualGuardrails,
  applyModeGuardrails,
  canAddManualSelection,
  activeCoverType,
  eligibleCoverStyleGroups,
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

test("manual Swimwear preserves one top and one bottom while replacing slot conflicts", () => {
  const state = new Map([
    ["clothing.swimwear.selection", unselected()],
    ["clothing.swimwear.bikini-tops.selection", manual({ value: "string-bikini-top", groupId: "bikini-tops" })],
    ["clothing.swimwear.two-piece-swim-tops.selection", unselected()],
    ["clothing.swimwear.bikini-bottoms.selection", unselected()],
    ["clothing.swimwear.one-piece-swimsuits.selection", unselected()],
  ]);

  applyManualGuardrails(state, "clothing.swimwear.bikini-bottoms.selection", { value: "brazilian-bikini-bottom", groupId: "bikini-bottoms" });
  assert.equal(state.get("clothing.swimwear.bikini-tops.selection").mode, "manual");

  state.set("clothing.swimwear.bikini-bottoms.selection", manual({ value: "brazilian-bikini-bottom", groupId: "bikini-bottoms" }));
  applyManualGuardrails(state, "clothing.swimwear.two-piece-swim-tops.selection", { value: "cropped-swim-top", groupId: "two-piece-swim-tops" });
  assert.deepEqual(state.get("clothing.swimwear.bikini-tops.selection"), unselected());
  assert.equal(state.get("clothing.swimwear.bikini-bottoms.selection").mode, "manual");

  state.set("clothing.swimwear.two-piece-swim-tops.selection", manual({ value: "cropped-swim-top", groupId: "two-piece-swim-tops" }));
  applyManualGuardrails(state, "clothing.swimwear.one-piece-swimsuits.selection", { value: "monokini", groupId: "one-piece-swimsuits" });
  assert.deepEqual(state.get("clothing.swimwear.two-piece-swim-tops.selection"), unselected());
  assert.deepEqual(state.get("clothing.swimwear.bikini-bottoms.selection"), unselected());
});

test("manual bikini top preserves a normal bottom and replaces only a normal top", () => {
  const state = new Map([
    ["clothing.primary-random", unselected()],
    ["clothing.tops.tank-tops.selection", manual({ value: "fitted-tank-top", groupId: "tank-tops" })],
    ["clothing.bottoms.mini-skirts.selection", manual({ value: "denim-mini-skirt", groupId: "mini-skirts" })],
    ["clothing.swimwear.selection", unselected()],
    ["clothing.swimwear.bikini-tops.selection", unselected()],
  ]);
  applyManualGuardrails(state, "clothing.swimwear.bikini-tops.selection", { value: "string-bikini-top", groupId: "bikini-tops" });
  assert.deepEqual(state.get("clothing.tops.tank-tops.selection"), unselected());
  assert.equal(state.get("clothing.bottoms.mini-skirts.selection").mode, "manual");
});

test("manual normal bottom preserves a bikini top and replaces only a swimwear bottom", () => {
  const state = new Map([
    ["clothing.primary-random", unselected()],
    ["clothing.bottoms.mini-skirts.selection", unselected()],
    ["clothing.swimwear.bikini-tops.selection", manual({ value: "string-bikini-top", groupId: "bikini-tops" })],
    ["clothing.swimwear.bikini-bottoms.selection", manual({ value: "brazilian-bikini-bottom", groupId: "bikini-bottoms" })],
  ]);
  applyManualGuardrails(state, "clothing.bottoms.mini-skirts.selection", { value: "denim-mini-skirt", groupId: "mini-skirts" });
  assert.equal(state.get("clothing.swimwear.bikini-tops.selection").mode, "manual");
  assert.deepEqual(state.get("clothing.swimwear.bikini-bottoms.selection"), unselected());
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

test("Themes clears parent Random/None and rejects a fourth unique manual selection", () => {
  const state = new Map([
    ["themes.selection", random()],
    ["themes.colors.selection", manual({ value: "red" }, { value: "white" })],
    ["themes.holidays-events.selection", manual({ value: "christmas" })],
    ["themes.genres-aesthetics.selection", unselected()],
  ]);

  applyManualGuardrails(state, "themes.genres-aesthetics.selection", { value: "gothic" });
  assert.deepEqual(state.get("themes.selection"), unselected());
  assert.equal(canAddManualSelection(state, "themes.genres-aesthetics.selection", { value: "gothic" }).allowed, false);

  state.set("themes.selection", none());
  applyModeGuardrails(state, "themes.selection", "none");
  assert.deepEqual(state.get("themes.colors.selection"), unselected());
  assert.deepEqual(state.get("themes.holidays-events.selection"), unselected());
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

test("Covers exposes only the selected type's Style group", () => {
  const groups = [
    { groupId: "novel-styles", label: "Novel Style", options: [] },
    { groupId: "album-styles", label: "Album Style", options: [] },
    { groupId: "dvd-styles", label: "DVD Style", options: [] },
    { groupId: "magazine-styles", label: "Magazine Style", options: [] },
  ];
  const state = new Map([["covers.type", manual({ value: "dvd" })]]);
  assert.equal(activeCoverType(state), "dvd");
  assert.deepEqual(eligibleCoverStyleGroups(state, groups).map((group) => group.groupId), ["dvd-styles"]);
  state.set("covers.type", random());
  assert.deepEqual(eligibleCoverStyleGroups(state, groups), []);
});

test("changing or randomizing Cover Type clears incompatible Style and metadata", () => {
  const state = new Map([
    ["covers.type", manual({ value: "novel" })],
    ["covers.style", manual({ value: "romance" })],
    ["covers.metadata.novel.title", manual("Old Title")],
    ["covers.era", manual({ value: "1970s" })],
  ]);
  applyManualGuardrails(state, "covers.type", { value: "album" });
  assert.deepEqual(state.get("covers.style"), unselected());
  assert.deepEqual(state.get("covers.metadata.novel.title"), unselected());
  assert.equal(state.get("covers.era").mode, "manual");

  state.set("covers.style", manual({ value: "metal" }));
  applyModeGuardrails(state, "covers.type", "random");
  assert.deepEqual(state.get("covers.style"), unselected());
});
