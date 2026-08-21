import assert from "node:assert/strict";
import test from "node:test";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { uiStateToGenerationControls, runUiGeneration } from "../../app/generation-adapter.js";

test("Custom POV UI text adapts into Camera free text", () => {
  const controls = uiStateToGenerationControls({
    camera: {
      "camera.custom-pov": { mode: "manual", value: "  a football   racing toward her  " },
    },
  });
  assert.deepEqual(controls.camera["custom-pov"], { mode: "manual", text: "a football racing toward her" });
});

test("Custom POV and a manual preset Viewer POV are mutually exclusive", () => {
  assert.throws(() => uiStateToGenerationControls({
    camera: {
      "camera.viewer-pov": { mode: "manual", value: { value: "paparazzi-view", groupId: "viewer-pov" } },
      "camera.custom-pov": { mode: "manual", value: "a football racing toward her" },
    },
  }), /either a preset Viewer POV or Custom POV/);
});

test("Custom POV generates the invisible-viewpoint wrapper", () => {
  const generation = runUiGeneration({
    uiState: {
      camera: {
        "camera.photo-look": { mode: "default", value: "normal-photo" },
        "camera.framing": { mode: "default", value: "full-body" },
        "camera.custom-pov": { mode: "manual", value: "a baseball racing toward her" },
      },
    },
    randomState: new RandomRuntimeState(),
  });
  assert.ok(generation.prompt.includes("seen from the first-person viewpoint of a baseball racing toward her; the viewpoint entity itself is not visible in the image"));
  assert.equal(generation.prompt.includes("direct portrait viewpoint"), false);
});
