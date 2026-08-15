import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration, RandomRuntimeState } from "../../engine/selection/index.js";

test("Location, Atmosphere, and Time of Day Random are seeded reproducibly", () => {
  const input = { controls: { location: { mode: "random" }, atmosphere: { mode: "random", count: 2 }, timeOfDay: { mode: "random" } }, random: { seed: "domains" } };
  const a = selectGeneration(input).selections;
  const b = selectGeneration(input).selections;
  assert.equal(a.location.value.id, b.location.value.id);
  assert.deepEqual(a.atmosphere.value.map(x => x.id), b.atmosphere.value.map(x => x.id));
  assert.equal(a.timeOfDay.value.id, b.timeOfDay.value.id);
  assert.ok(a.atmosphere.value.length <= 2);
});

test("Atmosphere max selections and Accessories manual max 2 are enforced", () => {
  assert.throws(() => selectGeneration({ controls: { atmosphere: { mode: "manual", ids: ["clear-skies", "light-rain", "heavy-rain"] } } }), /at most 2/);
  assert.throws(() => selectGeneration({ controls: { accessories: { mode: "manual", selections: [{id:"aviator-sunglasses"},{id:"hoop-earrings"},{id:"choker-necklace"}] } } }), /at most 2/);
});

test("Random state recovers only when generation owner completes generation", () => {
  const state = new RandomRuntimeState();
  selectGeneration({ controls: { location: { mode: "random" } }, random: { seed: "life", state } });
  const before = state.snapshot();
  assert.ok(Object.keys(before.lifetime).length > 0);
  assert.ok(Object.keys(before.decay.item).length > 0);
  state.completeGeneration();
  const after = state.snapshot();
  assert.notDeepEqual(after.decay, before.decay);
  assert.deepEqual(after.lifetime, before.lifetime);
});

test("Footwear and Accessories delegate Random through the top-level Selection Engine", () => {
  const { selections } = selectGeneration({ controls: { footwear: { mode: "random" }, accessories: { mode: "random" } }, random: { seed: "wearables" } });
  assert.equal(selections.footwear.mode, "random");
  assert.ok(selections.footwear.value?.id);
  assert.equal(selections.accessories.mode, "random");
  assert.ok(selections.accessories.value.length <= 2);
});

test("Effects explicit stacking honors the configured maximum", () => {
  const one = selectGeneration({ controls: { effects: { "effects-imperfections": { mode: "manual", ids: ["grain"] } } } }).selections.effects["effects-imperfections"];
  assert.equal(one.mode, "manual");
  assert.equal(one.value.length, 1);
  assert.throws(() => selectGeneration({ controls: { effects: { "effects-imperfections": { mode: "manual", ids: ["grain", "light-leak", "dust"] } } } }), /at most 2/);
});
