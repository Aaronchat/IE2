import test from "node:test";
import assert from "node:assert/strict";

import { createSeededRng } from "../../engine/selection/random/rng.js";
import {
  RandomDecayState,
  LifetimeCounters,
  RandomRuntimeState,
} from "../../engine/selection/random/state.js";
import {
  weightedChoice,
  chooseBucket,
  chooseItem,
  standardBucketDecay,
} from "../../engine/selection/random/core.js";

test("seeded RNG is deterministic", () => {
  const first = createSeededRng("repeatable");
  const second = createSeededRng("repeatable");

  const a = Array.from({ length: 10 }, () => first());
  const b = Array.from({ length: 10 }, () => second());
  assert.deepEqual(a, b);
});

test("weighted choice uses supplied RNG rather than Math.random", () => {
  const entries = [
    { id: "a", weight: 1 },
    { id: "b", weight: 3 },
  ];
  assert.equal(weightedChoice(entries, { rng: () => 0.0 }).id, "a");
  assert.equal(weightedChoice(entries, { rng: () => 0.99 }).id, "b");
});

test("standard item decay recovers by five and disappears at full strength", () => {
  const state = new RandomRuntimeState();
  const chosen = chooseItem({
    items: [{ id: "one" }, { id: "two" }],
    rng: () => 0,
    state,
    namespace: "test:item",
  });

  assert.equal(chosen.id, "one");
  assert.equal(state.decay.getItemStrength("test:item:one"), 25);
  assert.equal(state.lifetime.get("test:item:one"), 1);

  state.completeGeneration();
  assert.equal(state.decay.getItemStrength("test:item:one"), 30);

  for (let index = 0; index < 14; index += 1) {
    state.completeGeneration();
  }
  assert.equal(state.decay.getItemStrength("test:item:one"), 100);
  assert.equal(state.decay.item.has("test:item:one"), false);
  assert.equal(state.lifetime.get("test:item:one"), 1);
});

test("bucket rotation decay is based on sibling count", () => {
  assert.deepEqual(standardBucketDecay(4), { selectedStrength: 25, recovery: 25 });
  assert.deepEqual(standardBucketDecay(2), { selectedStrength: 50, recovery: 50 });

  const state = new RandomRuntimeState();
  const bucket = chooseBucket({
    buckets: [{ id: "a" }, { id: "b" }, { id: "c" }, { id: "d" }],
    rng: () => 0,
    state,
    namespace: "test:bucket",
    bucketCountForDecay: 4,
  });

  assert.equal(bucket.id, "a");
  assert.equal(state.decay.getBucketStrength("test:bucket:a"), 25);
  state.completeGeneration();
  assert.equal(state.decay.getBucketStrength("test:bucket:a"), 50);
});

test("decay state and lifetime counters are separate objects", () => {
  const decay = new RandomDecayState();
  const lifetime = new LifetimeCounters();

  decay.setItemDecay("x", 25, 5);
  lifetime.increment("x");
  lifetime.increment("x");

  assert.equal(decay.getItemStrength("x"), 25);
  assert.equal(lifetime.get("x"), 2);
  assert.equal(decay.snapshot().item.x.strength, 25);
  assert.equal(lifetime.snapshot().x, 2);
});
