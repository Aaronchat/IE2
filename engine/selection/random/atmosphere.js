import { CLEAR_ATMOSPHERE } from "../../../data/weather/clear.js";
import { WIND_ATMOSPHERE } from "../../../data/weather/wind.js";
import { NON_CLEAR_ATMOSPHERE } from "../../../data/weather/non-clear.js";
import { ATMOSPHERE_CONFIG } from "../../../data/weather/config.js";

import { chooseBucket, chooseRecordFromGroup } from "./core.js";

const RETIRED_NON_CLEAR_IDS = new Set([
  "neon-rain",
  "neon-fog",
  "neon-mist",
  "neon-snow",
]);

const ACTIVE_NON_CLEAR_ATMOSPHERE = Object.freeze({
  ...NON_CLEAR_ATMOSPHERE,
  items: Object.freeze(
    NON_CLEAR_ATMOSPHERE.items.filter((record) => !RETIRED_NON_CLEAR_IDS.has(record.id)),
  ),
});

export const ATMOSPHERE_RANDOM_BUCKETS = Object.freeze([
  CLEAR_ATMOSPHERE,
  WIND_ATMOSPHERE,
  ACTIVE_NON_CLEAR_ATMOSPHERE,
]);

const PROHIBITED_PAIRS = new Set(
  ATMOSPHERE_CONFIG.prohibitedFamilyPairs.map((pair) => [...pair].sort().join("|")),
);

function familyPairAllowed(firstFamily, secondFamily) {
  return !PROHIBITED_PAIRS.has([firstFamily, secondFamily].sort().join("|"));
}

export function areAtmosphereRecordsCompatible(first, second) {
  if (!first || !second || first.id === second.id) {
    return false;
  }

  if (
    ATMOSPHERE_CONFIG.preventSameGroupStacking &&
    first.group === second.group
  ) {
    return false;
  }

  for (const firstFamily of first.families) {
    for (const secondFamily of second.families) {
      if (familyPairAllowed(firstFamily, secondFamily)) {
        return true;
      }
    }
  }
  return false;
}

function groupsAllowedByLocation(location) {
  if (!location) {
    return ATMOSPHERE_RANDOM_BUCKETS;
  }

  if (location.environment === "indoor") {
    return [];
  }

  const blocked =
    ATMOSPHERE_CONFIG.locationRestrictions?.[location.id]?.blockedFamilies ?? [];
  if (blocked.length === 0) {
    return ATMOSPHERE_RANDOM_BUCKETS;
  }

  const blockedSet = new Set(blocked);
  return ATMOSPHERE_RANDOM_BUCKETS.filter((group) => !blockedSet.has(group.id));
}

function eligibleGroupAfterFirst(group, first) {
  const items = group.items.filter((record) => areAtmosphereRecordsCompatible(first, record));
  return Object.freeze({ ...group, items: Object.freeze(items) });
}

export function selectRandomAtmosphere({ rng, state, count, location = null }) {
  if (!Number.isInteger(count) || count < 0 || count > ATMOSPHERE_CONFIG.maxSelections) {
    throw new Error(`Atmosphere Random count must be an integer from 0 to ${ATMOSPHERE_CONFIG.maxSelections}.`);
  }

  const locationGroups = groupsAllowedByLocation(location);
  if (locationGroups.length === 0 || count === 0) {
    return Object.freeze([]);
  }

  const selections = [];

  for (let index = 0; index < count; index += 1) {
    let eligibleGroups = locationGroups;

    if (selections.length > 0) {
      eligibleGroups = locationGroups
        .map((group) => eligibleGroupAfterFirst(group, selections[0]))
        .filter((group) => group.items.length > 0);
    }

    if (eligibleGroups.length === 0) {
      break;
    }

    const bucket = chooseBucket({
      buckets: eligibleGroups,
      rng,
      state,
      namespace: "atmosphere:bucket",
      bucketCountForDecay: 3,
    });

    const record = chooseRecordFromGroup({
      group: bucket,
      rng,
      state,
      namespace: "atmosphere",
      itemNamespace: "atmosphere",
    });

    selections.push(record);
  }

  return Object.freeze(selections);
}
