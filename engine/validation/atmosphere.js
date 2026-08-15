import { fileURLToPath } from "node:url";
import path from "node:path";

import { CLEAR_ATMOSPHERE } from "../../data/weather/clear.js";
import { WIND_ATMOSPHERE } from "../../data/weather/wind.js";
import { NON_CLEAR_ATMOSPHERE } from "../../data/weather/non-clear.js";
import { ATMOSPHERE_CONFIG } from "../../data/weather/config.js";

const EXPECTED_RECORD_COUNT = 59;
const APPROVED_GROUP_IDS = Object.freeze(["clear", "wind", "non-clear"]);
const APPROVED_FAMILIES = Object.freeze(["clear", "wind", "non-clear"]);
const APPROVED_PHENOMENON_GROUPS = Object.freeze([
  "standalone",
  "clouds",
  "rain",
  "heat",
  "ice",
  "wind",
  "thunderstorm",
  "fog",
  "mist",
  "snow",
  "haze",
  "dust-sand",
  "smoke",
  "steam",
  "ash",
]);

const ATMOSPHERE_GROUPS = Object.freeze([
  CLEAR_ATMOSPHERE,
  WIND_ATMOSPHERE,
  NON_CLEAR_ATMOSPHERE,
]);

const APPROVED_GROUP_ID_SET = new Set(APPROVED_GROUP_IDS);
const APPROVED_FAMILY_SET = new Set(APPROVED_FAMILIES);
const APPROVED_PHENOMENON_GROUP_SET = new Set(APPROVED_PHENOMENON_GROUPS);

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function pairKey(pair) {
  if (!Array.isArray(pair) || pair.length !== 2) {
    throw new Error("Each prohibited Atmosphere family pair must contain exactly two values.");
  }
  for (const family of pair) {
    if (!APPROVED_FAMILY_SET.has(family)) {
      throw new Error(`Unknown Atmosphere family ${family} in prohibited pair.`);
    }
  }
  return [...pair].sort().join("|");
}

function validateConfig(config) {
  if (config?.maxSelections !== 2) {
    throw new Error("Atmosphere maxSelections must be exactly 2.");
  }

  if (config?.none?.exclusive !== true || config?.none?.contributesPrompt !== false) {
    throw new Error("Atmosphere None must be exclusive and contribute no prompt.");
  }

  if (!Array.isArray(config?.prohibitedFamilyPairs)) {
    throw new Error("Atmosphere prohibitedFamilyPairs must be an array.");
  }

  const pairKeys = config.prohibitedFamilyPairs.map(pairKey);
  const uniquePairKeys = new Set(pairKeys);
  if (uniquePairKeys.size !== pairKeys.length) {
    throw new Error("Atmosphere prohibitedFamilyPairs contains duplicates.");
  }

  const expectedPairs = new Set(["clear|non-clear", "wind|wind"]);
  if (
    uniquePairKeys.size !== expectedPairs.size ||
    [...expectedPairs].some((key) => !uniquePairKeys.has(key))
  ) {
    throw new Error("Atmosphere prohibited family pairs must be exactly Clear + Non-Clear and Wind + Wind.");
  }

  if (config?.preventSameGroupStacking !== true) {
    throw new Error("Atmosphere must prevent stacking alternatives from the same phenomenon group.");
  }

  const expectedEnvironmentBehavior = {
    indoor: "none",
    outdoor: "active",
    "indoor-exterior-view": "active",
  };
  const environmentBehavior = config?.locationEnvironmentBehavior;
  if (!environmentBehavior) {
    throw new Error("Atmosphere locationEnvironmentBehavior is required.");
  }
  for (const [environment, behavior] of Object.entries(expectedEnvironmentBehavior)) {
    if (environmentBehavior[environment] !== behavior) {
      throw new Error(`Atmosphere Environment ${environment} must resolve to ${behavior}.`);
    }
  }
  if (Object.keys(environmentBehavior).length !== Object.keys(expectedEnvironmentBehavior).length) {
    throw new Error("Atmosphere locationEnvironmentBehavior contains an unapproved Environment value.");
  }

  const restrictions = config?.locationRestrictions;
  if (!restrictions || typeof restrictions !== "object") {
    throw new Error("Atmosphere locationRestrictions must be present.");
  }

  const rainyRestriction = restrictions["rainy-neon-alley"];
  if (
    !rainyRestriction ||
    !Array.isArray(rainyRestriction.blockedFamilies) ||
    rainyRestriction.blockedFamilies.length !== 1 ||
    rainyRestriction.blockedFamilies[0] !== "clear"
  ) {
    throw new Error("Rainy Neon Alley must block exactly the Clear Atmosphere family.");
  }

  if (Object.prototype.hasOwnProperty.call(restrictions, "snowy-village")) {
    throw new Error("Snowy Village must not have a special Atmosphere restriction.");
  }

  if (Object.keys(restrictions).length !== 1) {
    throw new Error("Atmosphere locationRestrictions contains an unapproved special Location rule.");
  }
}

export function validateAtmosphere(groups = ATMOSPHERE_GROUPS, config = ATMOSPHERE_CONFIG) {
  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  const seenRecordNames = new Set();
  let recordCount = 0;
  let frostCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Atmosphere group id");
    requireNonEmptyString(group?.name, `${group?.id ?? "Atmosphere group"} name`);

    if (!APPROVED_GROUP_ID_SET.has(group.id)) {
      throw new Error(`Unknown Atmosphere group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Atmosphere group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }

    for (const record of group.items) {
      recordCount += 1;

      requireNonEmptyString(record?.id, `${group.id} Atmosphere id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);
      requireNonEmptyString(record?.group, `${record?.id ?? group.id} phenomenon group`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Atmosphere record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      const normalizedName = record.name.trim().toLowerCase();
      if (seenRecordNames.has(normalizedName)) {
        throw new Error(`Duplicate Atmosphere record name ${record.name}.`);
      }
      seenRecordNames.add(normalizedName);

      if (!APPROVED_PHENOMENON_GROUP_SET.has(record.group)) {
        throw new Error(`${record.id}: unknown Atmosphere phenomenon group ${record.group}.`);
      }

      if (!Array.isArray(record.families) || record.families.length === 0) {
        throw new Error(`${record.id}: families must be a non-empty array.`);
      }

      const familySet = new Set();
      for (const family of record.families) {
        if (!APPROVED_FAMILY_SET.has(family)) {
          throw new Error(`${record.id}: unknown Atmosphere family ${family}.`);
        }
        if (familySet.has(family)) {
          throw new Error(`${record.id}: duplicate Atmosphere family ${family}.`);
        }
        familySet.add(family);
      }

      if (!familySet.has(group.id)) {
        throw new Error(`${record.id}: must include its catalog family ${group.id}.`);
      }

      if (record.id === "frost") {
        frostCount += 1;
        if (
          familySet.size !== 2 ||
          !familySet.has("clear") ||
          !familySet.has("non-clear")
        ) {
          throw new Error("Frost must have exactly Clear and Non-Clear family membership.");
        }
      } else if (familySet.size !== 1) {
        throw new Error(`${record.id}: only Frost may belong to more than one Atmosphere family.`);
      }

      const effectiveEnabled = record.enabled ?? group.defaults.enabled;
      if (typeof effectiveEnabled !== "boolean") {
        throw new Error(`${record.id}: effective enabled must be boolean.`);
      }

      const effectiveSelectionWeight = record.selectionWeight ?? group.defaults.selectionWeight;
      if (
        typeof effectiveSelectionWeight !== "number" ||
        !Number.isFinite(effectiveSelectionWeight) ||
        effectiveSelectionWeight < 0
      ) {
        throw new Error(`${record.id}: effective selectionWeight must be a finite non-negative number.`);
      }

      for (const forbiddenField of [
        "temperature",
        "season",
        "timeOfDay",
        "climate",
        "formality",
        "coverage",
        "style",
        "mood",
        "themeAffinity",
      ]) {
        if (Object.prototype.hasOwnProperty.call(record, forbiddenField)) {
          throw new Error(`${record.id}: unapproved Atmosphere field ${forbiddenField} is not allowed.`);
        }
      }
    }
  }

  if (seenGroupIds.size !== APPROVED_GROUP_ID_SET.size) {
    throw new Error(`Expected ${APPROVED_GROUP_ID_SET.size} Atmosphere groups, found ${seenGroupIds.size}.`);
  }

  if (recordCount !== EXPECTED_RECORD_COUNT) {
    throw new Error(`Expected ${EXPECTED_RECORD_COUNT} unique Atmosphere records, found ${recordCount}.`);
  }

  if (frostCount !== 1) {
    throw new Error(`Expected Frost exactly once, found ${frostCount}.`);
  }

  for (const rejectedName of [
    "Heavy Fog",
    "Smoky Atmosphere",
    "Gusty",
    "Gale",
    "Heavy Mist",
    "Heavy Haze",
    "Atmospheric Haze",
    "Heavy Steam",
  ]) {
    if (seenRecordNames.has(rejectedName.toLowerCase())) {
      throw new Error(`Rejected Atmosphere candidate ${rejectedName} must not be present.`);
    }
  }

  validateConfig(config);

  return Object.freeze({
    groupCount: seenGroupIds.size,
    recordCount,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateAtmosphere();
  console.log(`Atmosphere validation passed: ${result.groupCount} groups, ${result.recordCount} records.`);
}
