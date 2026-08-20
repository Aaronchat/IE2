import test from "node:test";
import assert from "node:assert/strict";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { uiStateToGenerationControls, runUiGeneration } from "../../app/generation-adapter.js";

const manual = (value, groupId) => ({ mode: "manual", value: { value, groupId } });

function uiWithClothing(clothing) {
  return {
    character: { "character.ethnicity": { mode: "default", value: "Caucasian" } },
    tattoos: [],
    clothing,
    camera: {},
  };
}

test("manual bikini top combines with a normal denim mini skirt", () => {
  const ui = uiWithClothing({
    "clothing.swimwear.bikini-tops.selection": manual("string-bikini-top", "bikini-tops"),
    "clothing.bottoms.mini-skirts.selection": manual("denim-mini-skirt", "mini-skirts"),
  });
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
