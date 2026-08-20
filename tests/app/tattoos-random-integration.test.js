import test from "node:test";
import assert from "node:assert/strict";
import { RandomRuntimeState } from "../../engine/selection/index.js";
import { runUiGeneration, uiStateToGenerationControls } from "../../app/generation-adapter.js";

test("Random Tattoos UI mode adapts normally and requests a generation seed", () => {
  const uiState = { tattoos: { mode: "random" } };
  assert.deepEqual(uiStateToGenerationControls(uiState).tattoos, { mode: "random" });
  const generation = runUiGeneration({ uiState, randomState: new RandomRuntimeState(), createSeed: () => 77 });
  assert.equal(generation.seed, 77);
  assert.equal(generation.result.selection.selections.tattoos.mode, "random");
  assert.ok(generation.result.selection.selections.tattoos.value.every((tattoo) => tattoo.design.mode === "generic"));
});
