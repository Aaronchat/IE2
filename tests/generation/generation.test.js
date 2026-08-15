import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { prepareGeneration } from "../../engine/generation/index.js";
import { selectGeneration, RandomRuntimeState } from "../../engine/selection/index.js";
import { resolveGeneration } from "../../engine/resolution/index.js";
import { buildPrompt } from "../../engine/prompt-building/index.js";

function direct(input = {}) {
  const selection = selectGeneration(input);
  const resolved = resolveGeneration(selection);
  const prompt = buildPrompt(resolved);
  return { selection, resolved, prompt };
}

test("one call runs Selection -> Resolution -> Prompt Building and preserves structured outputs", () => {
  const input = { controls: { location: { mode: "manual", id: "beach", groupId: "general-locations" } } };
  const result = prepareGeneration(input);
  const expected = direct(input);
  assert.deepEqual(result.selection.selections, expected.selection.selections);
  assert.deepEqual(result.resolved.selections, expected.resolved.selections);
  assert.deepEqual(result.prompt, expected.prompt);
  assert.equal(result.prompt.prompt, expected.prompt.prompt);
  assert.equal(result.resolved.selections.location.value.id, "beach");
});

test("same seed plus equivalent starting state is reproducible", () => {
  const inputA = { controls: { character: { ethnicity: { mode: "random" } } }, random: { seed: 42, state: new RandomRuntimeState() } };
  const inputB = { controls: { character: { ethnicity: { mode: "random" } } }, random: { seed: 42, state: new RandomRuntimeState() } };
  const a = prepareGeneration(inputA);
  const b = prepareGeneration(inputB);
  assert.deepEqual(a.selection.selections, b.selection.selections);
  assert.deepEqual(a.resolved.selections, b.resolved.selections);
  assert.deepEqual(a.prompt, b.prompt);
  assert.deepEqual(a.randomState.snapshot(), b.randomState.snapshot());
});

test("supplied RandomRuntimeState is reused by reference across the completed result", () => {
  const state = new RandomRuntimeState();
  const result = prepareGeneration({ controls: { character: { ethnicity: { mode: "random" } } }, random: { seed: 7, state } });
  assert.equal(result.randomState, state);
  assert.equal(result.selection.randomState, state);
  assert.equal(result.resolved.randomState, state);
});

test("no Random control does not require a seed", () => {
  assert.doesNotThrow(() => prepareGeneration());
});

test("Random controls still require an explicit seed or rng", () => {
  assert.throws(() => prepareGeneration({ controls: { character: { ethnicity: { mode: "random" } } } }), /explicit seed or rng/);
});

test("Selection failure stops the pipeline and does not complete Random lifecycle", () => {
  const state = new RandomRuntimeState();
  let completions = 0;
  state.completeGeneration = () => { completions += 1; };
  assert.throws(() => prepareGeneration({ controls: { location: { mode: "manual", id: "nope" } }, random: { state } }), /Unknown Location id/);
  assert.equal(completions, 0);
});

test("Resolution failure propagates and does not complete Random lifecycle", () => {
  const state = new RandomRuntimeState();
  let completions = 0;
  state.completeGeneration = () => { completions += 1; };
  assert.throws(() => prepareGeneration({ controls: { atmosphere: { mode: "manual", ids: ["sunny", "light-rain"] } }, random: { state } }), /incompatible/);
  assert.equal(completions, 0);
});

test("successful prompt generation completes and recovers Random state exactly once", () => {
  const state = new RandomRuntimeState();
  state.decay.setItemDecay("synthetic:item", 25, 5);
  let completions = 0;
  const original = state.completeGeneration.bind(state);
  state.completeGeneration = () => { completions += 1; original(); };

  const result = prepareGeneration({ random: { state } });
  assert.equal(completions, 1);
  assert.equal(result.randomState.decay.getItemStrength("synthetic:item"), 30);
});

test("lifetime counters are incremented only by Random selection and not by completion", () => {
  const state = new RandomRuntimeState();
  const result = prepareGeneration({ controls: { character: { ethnicity: { mode: "random" } } }, random: { seed: 9, state } });
  const afterGeneration = result.randomState.snapshot();
  assert.equal(Object.values(afterGeneration.lifetime).reduce((a, b) => a + b, 0), 1);
  result.randomState.completeGeneration();
  assert.equal(Object.values(result.randomState.snapshot().lifetime).reduce((a, b) => a + b, 0), 1);
});

test("Camera and Effects remain non-Random and reject Random modes", () => {
  assert.throws(() => prepareGeneration({ controls: { camera: { framing: { mode: "random" } } }, random: { seed: 1 } }), /does not support selection mode random/);
  assert.throws(() => prepareGeneration({ controls: { effects: { "film-age": { mode: "random" } } }, random: { seed: 1 } }), /does not support selection mode random/);
});

test("orchestrator coordinates public APIs and completes only after Prompt Building", () => {
  const source = fs.readFileSync(new URL("../../engine/generation/index.js", import.meta.url), "utf8");
  const selectionIndex = source.indexOf("selectGeneration(");
  const resolutionIndex = source.indexOf("resolveGeneration(");
  const promptIndex = source.indexOf("buildPrompt(");
  const completionIndex = source.indexOf("completeGeneration(");
  assert.ok(selectionIndex >= 0 && selectionIndex < resolutionIndex);
  assert.ok(resolutionIndex < promptIndex);
  assert.ok(promptIndex < completionIndex);
  assert.equal(/CATALOGS|promptOf|resolveCoverage|chooseItem/u.test(source), false);
});
