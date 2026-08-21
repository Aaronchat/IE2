import { TIME_OF_DAY } from "../../../data/time-of-day/time-of-day.js";

import { chooseBucket, chooseItem, effectiveRecord } from "./core.js";

const BRIGHT_IDS = new Set([
  "sunrise",
  "early-morning",
  "morning",
  "late-morning",
  "midday",
  "afternoon",
  "golden-hour",
  "sunset",
]);

const DARK_IDS = new Set([
  "blue-hour",
  "evening",
  "night",
  "late-night",
  "midnight",
]);

export const TIME_OF_DAY_RANDOM_BUCKETS = Object.freeze([
  Object.freeze({
    id: "bright",
    baseWeight: 80,
    selectedStrength: 90,
    recovery: 5,
    items: Object.freeze(TIME_OF_DAY.items.filter((record) => BRIGHT_IDS.has(record.id))),
  }),
  Object.freeze({
    id: "dark",
    baseWeight: 20,
    selectedStrength: 25,
    recovery: 10,
    items: Object.freeze(TIME_OF_DAY.items.filter((record) => DARK_IDS.has(record.id))),
  }),
]);

export function selectRandomTimeOfDay({ rng, state, bucketId = null }) {
  const bucket = bucketId == null
    ? chooseBucket({
    buckets: TIME_OF_DAY_RANDOM_BUCKETS,
    rng,
    state,
    namespace: "time-of-day:bucket",
    baseWeight: (entry) => entry.baseWeight,
    selectedStrength: (entry) => entry.selectedStrength,
    recovery: (entry) => entry.recovery,
  })
    : TIME_OF_DAY_RANDOM_BUCKETS.find((entry) => entry.id === bucketId);
  if (!bucket) throw new Error(`Unknown Time of Day Random variant ${bucketId}.`);

  const wrappers = bucket.items.map((record) => effectiveRecord(TIME_OF_DAY, record));
  return chooseItem({
    items: wrappers,
    rng,
    state,
    namespace: "time-of-day",
    getId: (entry) => entry.record.id,
    getBaseWeight: (entry) => entry.selectionWeight,
    isEnabled: (entry) => entry.enabled,
    lifetimeKey: (entry) => `time-of-day:${entry.record.id}`,
  }).record;
}
