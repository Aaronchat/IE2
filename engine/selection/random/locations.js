import { GENERAL_LOCATIONS } from "../../../data/locations/general-locations.js";
import { NAMED_LANDMARKS_DESTINATIONS } from "../../../data/locations/named-landmarks-destinations.js";
import { NAMED_UT_SPORTS_LOCATIONS } from "../../../data/locations/named-ut-sports-locations.js";
import { EVENT_SCENE_LOCATIONS } from "../../../data/locations/event-scene-locations.js";

import { chooseRecordFromEqualBuckets } from "./core.js";

export const LOCATION_RANDOM_BUCKETS = Object.freeze([
  GENERAL_LOCATIONS,
  NAMED_LANDMARKS_DESTINATIONS,
  NAMED_UT_SPORTS_LOCATIONS,
  EVENT_SCENE_LOCATIONS,
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
