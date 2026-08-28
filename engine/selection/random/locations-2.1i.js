import { chooseRecordFromEqualBuckets } from "./core.js";
import { LOCATION_RANDOM_BUCKETS, selectRandomLocation as selectAnyRandomLocation } from "./locations.js";

function environmentMatches(record, environment) {
  if (environment === "outdoor") return record.environment === "outdoor";
  if (environment === "indoor") return record.environment === "indoor" || record.environment === "indoor-exterior-view";
  return true;
}

function eligibleGroups(environment) {
  return LOCATION_RANDOM_BUCKETS
    .map((group) => Object.freeze({
      ...group,
      items: Object.freeze(group.items.filter((record) => environmentMatches(record, environment))),
    }))
    .filter((group) => group.items.length > 0);
}

export { LOCATION_RANDOM_BUCKETS } from "./locations.js";

export function selectRandomLocation({ rng, state, environment = null }) {
  if (environment == null) return selectAnyRandomLocation({ rng, state });
  if (!["indoor", "outdoor"].includes(environment)) throw new Error(`Unknown Location Random subset ${environment}.`);

  const groups = eligibleGroups(environment);
  if (!groups.length) throw new Error(`No ${environment} Locations are available for Random selection.`);

  return chooseRecordFromEqualBuckets({
    groups,
    rng,
    state,
    bucketNamespace: `locations:bucket:${environment}`,
    itemNamespace: "location",
    bucketCountForDecay: groups.length,
  }).record;
}
