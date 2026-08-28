import test from "node:test";
import assert from "node:assert/strict";

import { CHARACTER_FEATURES } from "../data/character/character-features.js";
import { CHARACTER_PHYSICAL_APPEARANCE } from "../data/character/physical-appearance.js";
import { CHARACTER_SKIN } from "../data/character/skin.js";
import { UI_CATEGORIES } from "../app/ui-data-2.1i.js";
import { runUiGeneration, uiStateToGenerationControls } from "../app/generation-adapter-2.1i.js";
import { RandomRuntimeState, selectGeneration } from "../engine/selection/index.js";

function allControls() {
  return UI_CATEGORIES.flatMap((category) => [
    ...(category.action ? [category.action] : []),
    ...(category.modifiers ?? []),
    ...category.sections.flatMap((section) => [
      ...(section.action ? [section.action] : []),
      ...section.controls,
      ...(section.advancedControls ?? []),
    ]),
  ]);
}

function memoryStorage() {
  const values = new Map();
  return {
    getItem(key) { return values.has(key) ? values.get(key) : null; },
    setItem(key, value) { values.set(key, String(value)); },
  };
}

test("Pregnancy lives in Physical Appearance instead of Character Features", () => {
  assert.equal(CHARACTER_FEATURES.options.includes("Very Pregnant"), false);
  assert.deepEqual(CHARACTER_PHYSICAL_APPEARANCE.pregnancy, ["Very Pregnant"]);

  const byId = new Map(allControls().map((control) => [control.id, control]));
  assert.deepEqual(byId.get("character.pregnancy").options.map(({ value }) => value), ["Very Pregnant"]);
});

test("Skin Condition, Character Features, and Props expose Random", () => {
  const byId = new Map(allControls().map((control) => [control.id, control]));
  assert.equal(byId.get("character.skin-condition").random, true);
  assert.equal(byId.get("character.features").random, true);
  assert.equal(byId.get("props.selection").random, true);

  const controls = uiStateToGenerationControls({
    character: {
      "character.skin-condition": { mode: "random", values: [] },
      "character.features": { mode: "random", values: [] },
    },
    props: {
      "props.selection": { mode: "random", values: [] },
    },
  });
  assert.deepEqual(controls.character["skin-condition"], { mode: "random" });
  assert.deepEqual(controls.character.features, { mode: "random" });
  assert.deepEqual(controls.props, { mode: "random" });
});

test("Character and Prop Random choose one approved item", () => {
  const { selections } = selectGeneration({
    controls: {
      character: {
        "skin-condition": { mode: "random" },
        features: { mode: "random" },
      },
      props: { mode: "random" },
    },
    random: { seed: 1595040764 },
  });

  assert.equal(selections.character["skin-condition"].value.length, 1);
  assert.ok(CHARACTER_SKIN.conditions.includes(selections.character["skin-condition"].value[0]));
  assert.equal(selections.character.features.value.length, 1);
  assert.ok(CHARACTER_FEATURES.options.includes(selections.character.features.value[0]));
  assert.equal(selections.props.value.length, 1);
  assert.ok(selections.props.value[0].record?.prompt);
});

test("Location UI has Random Indoor and Random Outdoor and engine respects them", () => {
  const location = UI_CATEGORIES.find((category) => category.id === "location");
  assert.deepEqual(location.action.groupedOptions[0].options.map(({ label }) => label), ["Random Indoor", "Random Outdoor"]);

  const indoorUi = uiStateToGenerationControls({
    location: { "location.selection": { mode: "manual", value: { value: "random-indoor", groupId: "random-variants" } } },
  });
  const outdoorUi = uiStateToGenerationControls({
    location: { "location.selection": { mode: "manual", value: { value: "random-outdoor", groupId: "random-variants" } } },
  });
  assert.deepEqual(indoorUi.location, { mode: "random", environment: "indoor" });
  assert.deepEqual(outdoorUi.location, { mode: "random", environment: "outdoor" });

  for (let seed = 1; seed <= 25; seed += 1) {
    const indoor = selectGeneration({ controls: { location: { mode: "random", environment: "indoor" } }, random: { seed } }).selections.location.value;
    const outdoor = selectGeneration({ controls: { location: { mode: "random", environment: "outdoor" } }, random: { seed } }).selections.location.value;
    assert.ok(["indoor", "indoor-exterior-view"].includes(indoor.environment), `${indoor.id} should be indoor`);
    assert.equal(outdoor.environment, "outdoor", `${outdoor.id} should be outdoor`);
  }
});

test("Configuration Code replays the exact saved prompt", () => {
  const storage = memoryStorage();
  const original = runUiGeneration({
    uiState: {
      character: {
        "character.pregnancy": { mode: "manual", value: "Very Pregnant" },
      },
    },
    randomState: new RandomRuntimeState(),
    storage,
  });

  assert.match(original.configurationCode, /^\d{10}$/u);
  assert.match(original.prompt, /very pregnant/u);

  const replay = runUiGeneration({
    uiState: {
      character: {
        "character.skin-tone": { mode: "manual", value: "Deep" },
      },
    },
    randomState: new RandomRuntimeState(),
    configurationCode: original.configurationCode,
    storage,
  });

  assert.equal(replay.replayed, true);
  assert.equal(replay.prompt, original.prompt);
  assert.equal(replay.configurationCode, original.configurationCode);
});
