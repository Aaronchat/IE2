import test from "node:test";
import assert from "node:assert/strict";

import { RandomRuntimeState } from "../../engine/selection/random/state.js";
import { createSeededRng } from "../../engine/selection/random/rng.js";
import { selectRandomLocation } from "../../engine/selection/random/locations.js";
import {
  areAtmosphereRecordsCompatible,
  selectRandomAtmosphere,
} from "../../engine/selection/random/atmosphere.js";
import {
  TIME_OF_DAY_RANDOM_BUCKETS,
  selectRandomTimeOfDay,
} from "../../engine/selection/random/time-of-day.js";

import { CLEAR_ATMOSPHERE } from "../../data/weather/clear.js";
import { WIND_ATMOSPHERE } from "../../data/weather/wind.js";
import { NON_CLEAR_ATMOSPHERE } from "../../data/weather/non-clear.js";
import { GENERAL_LOCATIONS } from "../../data/locations/general-locations.js";
import { EVENT_SCENE_LOCATIONS } from "../../data/locations/event-scene-locations.js";

function find(group, id) {
  return group.items.find((record) => record.id === id);
}

test("Locations use four equal buckets with 25/50/75/100 bucket recovery", () => {
  const state = new RandomRuntimeState();
  const selected = selectRandomLocation({ rng: () => 0, state });

  assert.equal(selected.id, "downtown-sidewalk");
  assert.equal(state.decay.getBucketStrength("locations:bucket:general-locations"), 25);
  assert.equal(state.decay.getItemStrength("location:downtown-sidewalk"), 25);

  state.completeGeneration();
  assert.equal(state.decay.getBucketStrength("locations:bucket:general-locations"), 50);
  assert.equal(state.decay.getItemStrength("location:downtown-sidewalk"), 30);
});

test("Atmosphere compatibility remains authoritative", () => {
  const clear = find(CLEAR_ATMOSPHERE, "clear-skies");
  const partlyCloudy = find(CLEAR_ATMOSPHERE, "partly-cloudy");
  const overcast = find(NON_CLEAR_ATMOSPHERE, "overcast");
  const breezy = find(WIND_ATMOSPHERE, "breezy");
  const windy = find(WIND_ATMOSPHERE, "windy");

  assert.equal(areAtmosphereRecordsCompatible(clear, partlyCloudy), true);
  assert.equal(areAtmosphereRecordsCompatible(clear, overcast), false);
  assert.equal(areAtmosphereRecordsCompatible(breezy, windy), false);
});

test("Atmosphere rebuilds the pool for a second compatible selection", () => {
  const state = new RandomRuntimeState();
  const selected = selectRandomAtmosphere({
    rng: () => 0,
    state,
    count: 2,
  });

  assert.equal(selected.length, 2);
  assert.equal(areAtmosphereRecordsCompatible(selected[0], selected[1]), true);
  assert.equal(state.decay.getBucketStrength("atmosphere:bucket:clear"), 100 / 3);
});

test("Atmosphere obeys Location environment and Rainy Neon Alley restriction", () => {
  const indoor = find(GENERAL_LOCATIONS, "coffee-shop");
  const rainy = find(EVENT_SCENE_LOCATIONS, "rainy-neon-alley");

  assert.deepEqual(
    selectRandomAtmosphere({ rng: () => 0, state: new RandomRuntimeState(), count: 2, location: indoor }),
    [],
  );

  const rainySelection = selectRandomAtmosphere({
    rng: () => 0,
    state: new RandomRuntimeState(),
    count: 1,
    location: rainy,
  });
  assert.equal(rainySelection.length, 1);
  assert.notEqual(rainySelection[0].families.includes("clear"), true);
});

test("Time of Day preserves approved Bright and Dark weighting/decay", () => {
  assert.deepEqual(
    TIME_OF_DAY_RANDOM_BUCKETS.map(({ id, baseWeight, selectedStrength, recovery, items }) => ({
      id,
      baseWeight,
      selectedStrength,
      recovery,
      count: items.length,
    })),
    [
      { id: "bright", baseWeight: 80, selectedStrength: 90, recovery: 5, count: 8 },
      { id: "dark", baseWeight: 20, selectedStrength: 25, recovery: 10, count: 5 },
    ],
  );

  const brightState = new RandomRuntimeState();
  const bright = selectRandomTimeOfDay({ rng: () => 0, state: brightState });
  assert.equal(bright.id, "sunrise");
  assert.equal(brightState.decay.getBucketStrength("time-of-day:bucket:bright"), 90);

  const darkState = new RandomRuntimeState();
  const dark = selectRandomTimeOfDay({ rng: () => 0.99, state: darkState });
  assert.ok(["blue-hour", "evening", "night", "late-night", "midnight"].includes(dark.id));
  assert.equal(darkState.decay.getBucketStrength("time-of-day:bucket:dark"), 25);
  darkState.completeGeneration();
  assert.equal(darkState.decay.getBucketStrength("time-of-day:bucket:dark"), 35);
});
