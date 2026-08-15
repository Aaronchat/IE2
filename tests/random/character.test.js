import test from "node:test";
import assert from "node:assert/strict";

import { createSeededRng } from "../../engine/selection/random/rng.js";
import { RandomRuntimeState } from "../../engine/selection/random/state.js";
import {
  RANDOM_CHARACTER_CONTROLS,
  RANDOM_ETHNICITY_EXCLUSIONS,
  selectRandomEthnicity,
  selectRandomName,
  selectRandomHairColor,
  selectRandomFreckles,
  selectRandomChestAdjective,
} from "../../engine/selection/random/character.js";

import { CHARACTER_NAMES } from "../../data/character/names.js";
import { CHARACTER_FEATURES } from "../../data/character/character-features.js";

test("Black remains manual but is excluded from Random Ethnicity", () => {
  assert.ok(CHARACTER_NAMES.ethnicities.some((group) => group.name === "Black"));
  assert.deepEqual(RANDOM_ETHNICITY_EXCLUSIONS, ["Black"]);

  const rng = createSeededRng("ethnicity-audit");
  const state = new RandomRuntimeState();
  for (let index = 0; index < 200; index += 1) {
    assert.notEqual(selectRandomEthnicity({ rng, state }), "Black");
    state.completeGeneration();
  }
});

test("Name Random uses the already-resolved ethnicity including manually selected Black", () => {
  const state = new RandomRuntimeState();
  const name = selectRandomName({ ethnicity: "Black", rng: () => 0, state });
  const black = CHARACTER_NAMES.ethnicities.find((group) => group.name === "Black");
  assert.ok(black.names.includes(name));
  assert.ok([...state.lifetime.counts.keys()].some((key) => key.startsWith("character:name:black:")));
});

test("Character string catalogs use runtime-only namespaced state keys", () => {
  const state = new RandomRuntimeState();
  const color = selectRandomHairColor({ rng: () => 0, state });
  assert.equal(color, "Black");
  assert.equal(state.decay.getBucketStrength("character:hair-color:bucket:natural"), 50);
  assert.equal(state.decay.getItemStrength("character:hair-color:black"), 25);
});

test("Freckles uses 85/15 presence bias and special present decay", () => {
  const state = new RandomRuntimeState();
  const value = selectRandomFreckles({ rng: () => 0.9, state });
  assert.ok(["Light", "Moderate", "Heavy"].includes(value));
  assert.equal(state.decay.getItemStrength("character:freckles-presence:freckles"), 10);
  assert.equal(state.lifetime.get("character:freckles:present"), 1);
});

test("Chest Adjective Random fails closed until weights are configured", () => {
  assert.throws(
    () => selectRandomChestAdjective({
      rng: () => 0,
      state: new RandomRuntimeState(),
    }),
    /weights are not approved/,
  );

  const state = new RandomRuntimeState();
  const selected = selectRandomChestAdjective({
    rng: () => 0,
    state,
    weights: {
      noAdjective: 0,
      Very: 1,
      Extremely: 0,
      Hyper: 0,
      Ultra: 0,
    },
  });
  assert.equal(selected, "Very");
  assert.equal(state.decay.getItemStrength("character:chest-adjective:very"), 25);

  const noAdjective = selectRandomChestAdjective({
    rng: () => 0,
    state: new RandomRuntimeState(),
    weights: {
      noAdjective: 1,
      Very: 0,
      Extremely: 0,
      Hyper: 0,
      Ultra: 0,
    },
  });
  assert.equal(noAdjective, null);
});

test("Character Features have no Random control", () => {
  assert.deepEqual(CHARACTER_FEATURES.options, ["Fox Ears", "Fox Tail"]);
  assert.equal(RANDOM_CHARACTER_CONTROLS.includes("character-features"), false);
});
