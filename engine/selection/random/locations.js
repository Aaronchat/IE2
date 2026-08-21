import { GENERIC_LOCATIONS } from "../../../data/locations/generic-locations.js";
import { US_LOCATIONS } from "../../../data/locations/us-locations.js";
import { INTERNATIONAL_LOCATIONS } from "../../../data/locations/international-locations.js";
import { UT_SPECIFIC_LOCATIONS } from "../../../data/locations/ut-specific-locations.js";

import { chooseRecordFromEqualBuckets } from "./core.js";

export const LOCATION_RANDOM_BUCKETS = Object.freeze([
  UT_SPECIFIC_LOCATIONS,
  US_LOCATIONS,
  INTERNATIONAL_LOCATIONS,
  GENERIC_LOCATIONS,
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
