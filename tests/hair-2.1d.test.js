import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../engine/selection/index.js";
import { resolveGeneration } from "../engine/resolution/index.js";
import { buildPrompt } from "../engine/prompt-building/index.js";
import { allUiControls } from "../app/ui-data.js";
import { RANDOM_CHARACTER_CONTROLS } from "../engine/selection/random/character.js";

function promptFor(character) {
  return buildPrompt(resolveGeneration(selectGeneration({ controls: { character } }))).sections.character;
}

test("Hair UI replaces Length and Texture with complete styles and multicolor controls", () => {
  const byId = new Map(allUiControls().map((entry) => [entry.id, entry]));
  assert.equal(byId.has("character.hair-length"), false);
  assert.equal(byId.has("character.hair-texture"), false);
  assert.ok(byId.has("character.hair-secondary-color"));
  assert.ok(byId.has("character.hair-color-treatment"));
  assert.equal(byId.get("character.hair-secondary-color").random, false);
  assert.equal(byId.get("character.hair-color-treatment").random, false);
  assert.ok(byId.get("character.hair-style").groupedOptions.flatMap((group) => group.options).some((entry) => entry.value === "Long Wavy Hair"));
});

test("Hair Random no longer exposes independent Length or Texture", () => {
  assert.equal(RANDOM_CHARACTER_CONTROLS.includes("hair-length"), false);
  assert.equal(RANDOM_CHARACTER_CONTROLS.includes("hair-texture"), false);
  assert.equal(RANDOM_CHARACTER_CONTROLS.includes("hair-secondary-color"), false);
  assert.equal(RANDOM_CHARACTER_CONTROLS.includes("hair-color-treatment"), false);
  assert.ok(RANDOM_CHARACTER_CONTROLS.includes("hair-color"));
  assert.ok(RANDOM_CHARACTER_CONTROLS.includes("hair-style"));
});

test("complete Hair styles emit without redundant hairstyle wording", () => {
  assert.deepEqual(promptFor({
    "hair-color": { mode: "manual", value: "Black" },
    "hair-style": { mode: "manual", value: "Long Wavy Hair" },
  }), ["Caucasian", "black hair", "long wavy hair"]);
});

test("multicolor Hair emits the approved treatments", () => {
  const cases = [
    ["Highlights", "black hair with pink highlights"],
    ["Streaks", "black hair with pink streaks"],
    ["Ombré", "black-to-pink ombré hair"],
    ["Colored Tips", "black hair with pink tips"],
    ["Split Dye", "black-and-pink split-dyed hair"],
    ["Face-Framing Color", "black hair with pink face-framing color"],
    ["Contrasting Roots", "black hair with pink contrasting roots"],
    ["Frosted Tips", "black hair with pink frosted tips"],
  ];
  for (const [treatment, expected] of cases) {
    const fragments = promptFor({
      "hair-color": { mode: "manual", value: "Black" },
      "hair-secondary-color": { mode: "manual", value: "Pink" },
      "hair-color-treatment": { mode: "manual", value: treatment },
      "hair-style": { mode: "manual", value: "Pixie Cut" },
    });
    assert.ok(fragments.includes(expected), treatment);
    assert.ok(fragments.includes("pixie cut hairstyle"), treatment);
  }
});

test("multicolor Hair requires primary, secondary, and treatment together", () => {
  assert.throws(() => selectGeneration({ controls: { character: {
    "hair-color": { mode: "manual", value: "Black" },
    "hair-secondary-color": { mode: "manual", value: "Pink" },
  } } }), /selected together/);
  assert.throws(() => selectGeneration({ controls: { character: {
    "hair-secondary-color": { mode: "manual", value: "Pink" },
    "hair-color-treatment": { mode: "manual", value: "Streaks" },
  } } }), /requires a primary Hair Color/);
});

test("Bald is a Hair Style and suppresses Hair colors", () => {
  assert.deepEqual(promptFor({
    "hair-color": { mode: "manual", value: "Rose Gold" },
    "hair-secondary-color": { mode: "manual", value: "Pink" },
    "hair-color-treatment": { mode: "manual", value: "Streaks" },
    "hair-style": { mode: "manual", value: "Bald" },
  }), ["Caucasian", "bald"]);
});
