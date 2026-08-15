import { ATMOSPHERE_CONFIG } from "../../data/weather/config.js";

function pairAllowed(a, b) {
  const prohibited = ATMOSPHERE_CONFIG.prohibitedFamilyPairs;
  const combinations = a.families.flatMap((fa) => b.families.map((fb) => [fa, fb]));
  return combinations.some(([fa, fb]) => !prohibited.some(([pa, pb]) => (fa === pa && fb === pb) || (fa === pb && fb === pa)));
}

export function validateAtmospherePair(records, location = null) {
  if (records.length < 2) return;
  const [a, b] = records;
  if (ATMOSPHERE_CONFIG.preventSameGroupStacking && a.group === b.group) {
    throw new Error(`Atmosphere selections ${a.id} and ${b.id} cannot stack within group ${a.group}.`);
  }
  if (!pairAllowed(a, b)) throw new Error(`Atmosphere selections ${a.id} and ${b.id} are incompatible.`);
  const restriction = location ? ATMOSPHERE_CONFIG.locationRestrictions[location.id] : null;
  if (restriction) {
    for (const record of records) {
      if (record.families.some((family) => restriction.blockedFamilies.includes(family))) {
        throw new Error(`Atmosphere ${record.id} is blocked at Location ${location.id}.`);
      }
    }
  }
}

export function resolveAtmosphere(selection, locationSelection) {
  if (!selection) return undefined;
  if (selection.mode === "none") return selection;
  const location = locationSelection?.value ?? null;
  const behavior = location ? ATMOSPHERE_CONFIG.locationEnvironmentBehavior[location.environment] : "active";
  if (behavior === "none") {
    return Object.freeze({ ...selection, value: Object.freeze([]), resolution: Object.freeze({ action: "resolved-to-none", reason: "location-environment-indoor", originalMode: selection.mode, originalValue: selection.value }) });
  }
  const records = selection.value ?? [];
  const restriction = location ? ATMOSPHERE_CONFIG.locationRestrictions[location.id] : null;
  if (restriction) {
    for (const record of records) {
      if (record.families.some((family) => restriction.blockedFamilies.includes(family))) throw new Error(`Atmosphere ${record.id} is blocked at Location ${location.id}.`);
    }
  }
  validateAtmospherePair(records, location);
  return selection;
}
