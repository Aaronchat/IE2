import test from "node:test";
import assert from "node:assert/strict";
import { CHARACTER_HAIR } from "../data/character/hair.js";
import { CATALOGS } from "../engine/selection/catalogs.js";
import { RandomRuntimeState } from "../engine/selection/index.js";
import { UI_CATEGORIES } from "../app/ui-data.js";
import { runUiGeneration, uiStateToGenerationControls } from "../app/generation-adapter.js";

const manual = (value, groupId = null) => ({ mode: "manual", value: groupId ? { value, groupId } : value });

function clothingUi() {
  return {
    character: { "character.ethnicity": { mode: "default", value: "Caucasian" } },
    clothing: {
      "clothing.swimwear.bikini-tops.selection": manual("triangle-bikini-top", "bikini-tops"),
      "clothing.swimwear.advanced.color": { mode: "none", value: null },
      "clothing.swimwear.advanced.custom-color": manual("mauve"),
      "clothing.swimwear.advanced.graphic": { mode: "none", value: null },
      "clothing.swimwear.advanced.custom-graphic": manual("skull and crossbones as tie-dye"),
    },
  };
}

test("wolf, shag, and lob haircuts are removed", () => {
  assert.equal(CHARACTER_HAIR.styles.cuts.includes("Wolf Cut"), false);
  assert.equal(CHARACTER_HAIR.styles.cuts.includes("Shag Cut"), false);
  assert.equal(CHARACTER_HAIR.styles.cuts.includes("Lob"), false);
});

test("cozy footwear includes slippers, bunny slippers, and Ugg boots", () => {
  const casual = CATALOGS.footwear.find((group) => group.id === "sandals-casual-shoes");
  assert.ok(casual);
  const ids = casual.items.map((item) => item.id);
  assert.ok(ids.includes("slippers"));
  assert.ok(ids.includes("pink-bunny-slippers"));
  assert.ok(ids.includes("ugg-boots"));
});

test("advanced color and graphic controls appear on swimwear and sensible clothing sections", () => {
  const clothing = UI_CATEGORIES.find((category) => category.id === "clothing");
  const byId = Object.fromEntries(clothing.sections.map((section) => [section.id, section]));
  for (const id of ["clothing.tops", "clothing.bottoms", "clothing.dresses", "clothing.one-piece", "clothing.swimwear", "clothing.sleepwear", "clothing.outerwear"]) {
    const controls = new Set(byId[id].advancedControls.map((control) => control.id));
    assert.ok(controls.has(`${id}.advanced.color`), `${id} preset color`);
    assert.ok(controls.has(`${id}.advanced.custom-color`), `${id} custom color`);
    assert.ok(controls.has(`${id}.advanced.graphic`), `${id} preset graphic`);
    assert.ok(controls.has(`${id}.advanced.custom-graphic`), `${id} custom graphic`);
  }
  const hosiery = new Set(byId["clothing.hosiery"].advancedControls.map((control) => control.id));
  assert.deepEqual([...hosiery], ["clothing.hosiery.advanced.condition"]);
});

test("custom swimwear color and graphic flow into generation controls", () => {
  const controls = uiStateToGenerationControls(clothingUi());
  assert.deepEqual(controls.clothing.details.swimwear.color, { mode: "manual", text: "mauve" });
  assert.deepEqual(controls.clothing.details.swimwear.graphic, { mode: "manual", text: "skull and crossbones as tie-dye" });
});

test("custom swimwear color and graphic are emitted in the final prompt", () => {
  const generation = runUiGeneration({ uiState: clothingUi(), randomState: new RandomRuntimeState() });
  assert.match(generation.prompt, /mauve triangle bikini top with skull and crossbones as tie-dye/);
});

test("preset and custom values cannot conflict", () => {
  const ui = clothingUi();
  ui.clothing["clothing.swimwear.advanced.color"] = manual({ value: "red" });
  assert.throws(() => uiStateToGenerationControls(ui), /either preset color or Custom color/);
});
