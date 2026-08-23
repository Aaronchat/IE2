import { GENERIC_LOCATIONS } from "../../../data/locations/generic-locations.js";
import { US_LOCATIONS } from "../../../data/locations/us-locations.js";
import { INTERNATIONAL_LOCATIONS } from "../../../data/locations/international-locations.js";
import { UT_SPECIFIC_LOCATIONS } from "../../../data/locations/ut-specific-locations.js";

import { chooseRecordFromEqualBuckets } from "./core.js";

const RETIRED_GENERIC_LOCATION_IDS = new Set([
  "cyberpunk-city",
  "rainy-neon-alley",
]);

const ACTIVE_GENERIC_LOCATIONS = Object.freeze({
  ...GENERIC_LOCATIONS,
  items: Object.freeze(
    GENERIC_LOCATIONS.items.filter((record) => !RETIRED_GENERIC_LOCATION_IDS.has(record.id)),
  ),
});

export const LOCATION_RANDOM_BUCKETS = Object.freeze([
  UT_SPECIFIC_LOCATIONS,
  US_LOCATIONS,
  INTERNATIONAL_LOCATIONS,
  ACTIVE_GENERIC_LOCATIONS,
]);

export function selectRandomLocation({ rng, state }) {
  return chooseRecordFromEqualBuckets({
    groups: LOCATION_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "locations:bucket",
    itemNamespace: "location",
    bucketCountForDecay: 4,
  }).record;
}
