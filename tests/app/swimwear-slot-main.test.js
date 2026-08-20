import test from "node:test";
import assert from "node:assert/strict";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { runUiGeneration } from "../../app/generation-adapter.js";

const manual = (value, groupId) => ({ mode: "manual", value: { value, groupId } });

test("2.1C manual bikini top and denim mini skirt generate together", () => {
  const uiState = {
    character: { "character.ethnicity": { mode: "default", value: "Caucasian" } },
    tattoos: [],
    clothing: {
      "clothing.swimwear.bikini-tops.selection": manual("string-bikini-top", "bikini-tops"),
      "clothing.bottoms.mini-skirts.selection": manual("denim-mini-skirt", "mini-skirts"),
    },
    camera: {},
  };
  const prompt = runUiGeneration({ uiState, randomState: new RandomRuntimeState() }).prompt;
  assert.ok(prompt.includes("string bikini top"));
  assert.ok(prompt.includes("denim mini skirt"));
});
