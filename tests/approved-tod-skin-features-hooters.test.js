import test from "node:test";
import assert from "node:assert/strict";

import { CHARACTER_SKIN } from "../data/character/skin.js";
import { CHARACTER_FEATURES } from "../data/character/character-features.js";
import { HOOTERS_WAITRESS_UNIFORM } from "../data/packages/occupation-additions.js";
import { TIME_OF_DAY_CONFIG } from "../data/time-of-day/config.js";
import { TIME_OF_DAY_RANDOM_BUCKETS, selectRandomTimeOfDay } from "../engine/selection/random/time-of-day.js";
import { RandomRuntimeState } from "../engine/selection/random/state.js";
import { selectGeneration } from "../engine/selection/index.js";
import { buildCharacterFragments } from "../engine/prompt-building/character.js";
import { uiStateToGenerationControls } from "../app/generation-adapter.js";
import { allUiControls } from "../app/ui-data.js";

const BRIGHT = new Set(["sunrise", "early-morning", "morning", "late-morning", "midday", "afternoon", "golden-hour", "sunset"]);
const DARK = new Set(["blue-hour", "evening", "night", "late-night", "midnight"]);

test("Bright Random and Dark Random resolve only to real Time of Day records", () => {
  assert.deepEqual(TIME_OF_DAY_RANDOM_BUCKETS.map((bucket) => [bucket.id, bucket.items.length]), [["bright", 8], ["dark", 5]]);
  for (const [bucketId, allowed] of [["bright", BRIGHT], ["dark", DARK]]) {
    for (const rngValue of [0, 0.2, 0.5, 0.9, 0.999]) {
      const record = selectRandomTimeOfDay({ rng: () => rngValue, state: new RandomRuntimeState(), bucketId });
      assert.ok(allowed.has(record.id), `${record.id} should be in ${bucketId}`);
      assert.notEqual(record.name, "Bright Random");
      assert.notEqual(record.name, "Dark Random");
    }
  }
});

test("Time of Day UI variants adapt to engine Random buckets", () => {
  assert.deepEqual(TIME_OF_DAY_CONFIG.randomVariants.map(({ id, label }) => [id, label]), [["bright", "Bright Random"], ["dark", "Dark Random"]]);
  const bright = uiStateToGenerationControls({ "time-of-day": { "time-of-day.selection": { mode: "manual", value: "bright-random" } } });
  const dark = uiStateToGenerationControls({ "time-of-day": { "time-of-day.selection": { mode: "manual", value: "dark-random" } } });
  assert.deepEqual(bright.timeOfDay, { mode: "random", bucket: "bright" });
  assert.deepEqual(dark.timeOfDay, { mode: "random", bucket: "dark" });
});

test("Skin Condition and Character Features are manual multi-selects and prompt together", () => {
  assert.deepEqual(CHARACTER_SKIN.conditions, ["Sweaty", "Dirty", "Muddy", "Covered in Oil", "Soot-Covered", "Blood-Splattered", "Bruised", "Zombie Bites", "Zombie Scratches", "Drenched"]);
  assert.deepEqual(CHARACTER_FEATURES.options, ["Fox Ears", "Fox Tail", "Bunny Ears", "Cat Ears", "Cat Tail", "Vampire Fangs", "Wings", "Horns", "Elf Ears"]);

  const { selections } = selectGeneration({ controls: { character: {
    "skin-condition": { mode: "manual", values: ["Sweaty", "Muddy", "Drenched"] },
    features: { mode: "manual", values: ["Fox Ears", "Cat Tail", "Vampire Fangs", "Wings"] },
  } } });
  assert.deepEqual(selections.character["skin-condition"].value, ["Sweaty", "Muddy", "Drenched"]);
  assert.deepEqual(selections.character.features.value, ["Fox Ears", "Cat Tail", "Vampire Fangs", "Wings"]);
  assert.deepEqual(buildCharacterFragments(selections.character), ["Caucasian", "sweaty", "muddy", "drenched", "fox ears", "cat tail", "vampire fangs", "wings"]);
});

test("UI exposes multi-select Skin Condition and expanded Character Features", () => {
  const byId = new Map(allUiControls().map((control) => [control.id, control]));
  const condition = byId.get("character.skin-condition");
  const features = byId.get("character.features");
  const tod = byId.get("time-of-day.selection");
  assert.equal(condition.maxSelections, 10);
  assert.equal(features.maxSelections, 9);
  assert.deepEqual(tod.groupedOptions[0].options.map(({ label }) => label), ["Bright Random", "Dark Random"]);
  assert.equal(tod.groupedOptions[1].options.some(({ label }) => label === "Sunrise"), true);
});

test("Hooters Waitress Uniform has branded, specific package prompt", () => {
  const pkg = HOOTERS_WAITRESS_UNIFORM;
  assert.equal(pkg.name, "Hooters Waitress Uniform");
  assert.match(pkg.prompt, /Hooters waitress uniform/);
  assert.match(pkg.prompt, /Hooters logo tank top/);
  assert.match(pkg.prompt, /bright orange short shorts/);
  assert.match(pkg.prompt, /suntan pantyhose/);
  assert.match(pkg.prompt, /white slouch socks/);
});
