import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";
import { findEnabledRecord } from "../../engine/selection/controls.js";

test("manual selection stays explicit and invalid ids fail", () => {
  const { selections } = selectGeneration({ controls: { location: { mode: "manual", id: "beach" } } });
  assert.equal(selections.location.mode, "manual");
  assert.equal(selections.location.value.id, "beach");
  assert.throws(() => selectGeneration({ controls: { location: { mode: "manual", id: "nope" } } }), /Unknown Location id/);
});

test("disabled manual records fail closed", () => {
  const group = { id: "x", defaults: { enabled: true }, items: [{ id: "off", enabled: false }] };
  assert.throws(() => findEnabledRecord([group], "off", "Synthetic"), /disabled/);
});

test("Camera defaults and Effects defaults resolve without Random", () => {
  const { selections } = selectGeneration();
  assert.equal(selections.camera.framing.mode, "default");
  assert.equal(selections.camera.framing.value.id, "full-body");
  assert.equal(selections.camera["spatial-safe-framing"].value, null);
  assert.deepEqual(selections.effects["effects-imperfections"].value, []);
  assert.equal(selections.effects["film-age"].value, null);
  assert.throws(() => selectGeneration({ controls: { camera: { framing: { mode: "random" } } }, random: { seed: 1 } }), /does not support selection mode random/);
  assert.throws(() => selectGeneration({ controls: { effects: { "film-age": { mode: "random" } } }, random: { seed: 1 } }), /does not support selection mode random/);
});

test("None is preserved only on configured domains", () => {
  const { selections } = selectGeneration({ controls: { atmosphere: { mode: "none" }, timeOfDay: { mode: "none" } } });
  assert.equal(selections.atmosphere.mode, "none");
  assert.deepEqual(selections.atmosphere.value, []);
  assert.equal(selections.timeOfDay.value, null);
  assert.throws(() => selectGeneration({ controls: { location: { mode: "none" } } }), /does not support/);
});

test("Random primitive excludes disabled records", async () => {
  const { chooseItem } = await import("../../engine/selection/random/core.js");
  const { RandomRuntimeState } = await import("../../engine/selection/random/state.js");
  const chosen = chooseItem({ items: [{ id: "off", enabled: false, selectionWeight: 1000 }, { id: "on", enabled: true, selectionWeight: 1 }], rng: () => 0, state: new RandomRuntimeState(), namespace: "test", getId: x => x.id, isEnabled: x => x.enabled, getBaseWeight: x => x.selectionWeight });
  assert.equal(chosen.id, "on");
});
