import test from "node:test";
import assert from "node:assert/strict";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { runUiGeneration } from "../../app/generation-adapter.js";

test("Aspect Ratio UI selection reaches Selection and starts the prompt", () => {
  const uiState = {
    "aspect-ratio": {
      "aspect-ratio.selection": { mode: "manual", value: { value: "9-19-5", groupId: "aspect-ratios" } },
    },
    character: {
      "character.ethnicity": { mode: "default", value: "Caucasian" },
    },
    tattoos: [],
  };
  const generation = runUiGeneration({ uiState, randomState: new RandomRuntimeState() });
  assert.deepEqual(generation.controls.aspectRatio, { mode: "manual", id: "9-19-5", groupId: "aspect-ratios" });
  assert.equal(generation.prompt.startsWith("9:19.5 aspect ratio, "), true);
});
