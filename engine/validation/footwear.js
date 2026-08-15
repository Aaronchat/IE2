import { fileURLToPath } from "node:url";
import path from "node:path";

import { BODY_REGIONS, BODY_SIDES } from "../../data/vocabulary/body-regions.js";
import { TEMPERATURES } from "../../data/vocabulary/temperatures.js";
import { SEASONS } from "../../data/vocabulary/seasons.js";
import { FORMALITIES } from "../../data/vocabulary/formalities.js";

import { SNEAKERS_ATHLETIC_SHOES } from "../../data/footwear/sneakers-athletic-shoes.js";
import { BOOTS } from "../../data/footwear/boots.js";
import { FLATS_CLASSIC_SHOES } from "../../data/footwear/flats-classic-shoes.js";
import { HEELS } from "../../data/footwear/heels.js";
import { SANDALS_CASUAL_SHOES } from "../../data/footwear/sandals-casual-shoes.js";
import { GOTHIC_ALTERNATIVE_FOOTWEAR } from "../../data/footwear/gothic-alternative-footwear.js";

const APPROVED_GROUP_IDS = Object.freeze([
  "sneakers-athletic-shoes",
  "boots",
  "flats-classic-shoes",
  "heels",
  "sandals-casual-shoes",
  "gothic-alternative-footwear",
]);

const FOOTWEAR_GROUPS = Object.freeze([
  SNEAKERS_ATHLETIC_SHOES,
  BOOTS,
  FLATS_CLASSIC_SHOES,
  HEELS,
  SANDALS_CASUAL_SHOES,
  GOTHIC_ALTERNATIVE_FOOTWEAR,
]);

const BODY_REGION_BY_ID = new Map(BODY_REGIONS.map((region) => [region.id, region]));
const BODY_SIDE_SET = new Set(BODY_SIDES);
const TEMPERATURE_ID_SET = new Set(TEMPERATURES.map((value) => value.id));
const SEASON_ID_SET = new Set(SEASONS.map((value) => value.id));
const FORMALITY_ID_SET = new Set(FORMALITIES.map((value) => value.id));
const APPROVED_GROUP_ID_SET = new Set(APPROVED_GROUP_IDS);

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateCoverage(record) {
  const coverage = record.coverage;
  if (!coverage || !Array.isArray(coverage.covered) || !Array.isArray(coverage.partiallyCovered)) {
    throw new Error(`${record.id}: coverage must contain covered and partiallyCovered arrays.`);
  }

  const seenCovered = new Set();
  const seenPartial = new Set();

  for (const [bucketName, entries, seen] of [
    ["covered", coverage.covered, seenCovered],
    ["partiallyCovered", coverage.partiallyCovered, seenPartial],
  ]) {
    for (const entry of entries) {
      const region = BODY_REGION_BY_ID.get(entry?.region);
      if (!region) {
        throw new Error(`${record.id}: unknown body region ${entry?.region}.`);
      }

      let key;
      if (region.supportsSide) {
        if (!BODY_SIDE_SET.has(entry.side)) {
          throw new Error(`${record.id}: ${entry.region} requires a valid side.`);
        }
        key = `${entry.region}|${entry.side}`;
      } else {
        if (Object.prototype.hasOwnProperty.call(entry, "side")) {
          throw new Error(`${record.id}: ${entry.region} does not support side.`);
        }
        key = `${entry.region}|`;
      }

      if (seen.has(key)) {
        throw new Error(`${record.id}: duplicate ${bucketName} coverage entry ${key}.`);
      }
      seen.add(key);
    }
  }

  for (const key of seenCovered) {
    if (seenPartial.has(key)) {
      throw new Error(`${record.id}: coverage entry ${key} appears in both buckets.`);
    }
  }
}

export function validateFootwear(groups = FOOTWEAR_GROUPS) {
  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  let recordCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Footwear group id");
    if (!APPROVED_GROUP_ID_SET.has(group.id)) {
      throw new Error(`Unknown Footwear group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Footwear group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }

    for (const record of group.items) {
      recordCount += 1;
      requireNonEmptyString(record?.id, `${group.id} Footwear id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Footwear record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      if (!Array.isArray(record.temperature) || record.temperature.length === 0) {
        throw new Error(`${record.id}: temperature must be a non-empty array.`);
      }
      for (const value of record.temperature) {
        if (!TEMPERATURE_ID_SET.has(value)) {
          throw new Error(`${record.id}: unknown Temperature ${value}.`);
        }
      }

      if (!Array.isArray(record.season) || record.season.length === 0) {
        throw new Error(`${record.id}: season must be a non-empty array.`);
      }
      for (const value of record.season) {
        if (!SEASON_ID_SET.has(value)) {
          throw new Error(`${record.id}: unknown Season ${value}.`);
        }
      }

      if (!FORMALITY_ID_SET.has(record.formality)) {
        throw new Error(`${record.id}: unknown Formality ${record.formality}.`);
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

      validateCoverage(record);

      for (const deferredField of ["style", "mood", "themeAffinity"]) {
        if (Object.prototype.hasOwnProperty.call(record, deferredField)) {
          throw new Error(`${record.id}: deferred field ${deferredField} is not allowed.`);
        }
      }
    }
  }

  if (seenGroupIds.size !== APPROVED_GROUP_ID_SET.size) {
    throw new Error(`Expected ${APPROVED_GROUP_ID_SET.size} Footwear groups, found ${seenGroupIds.size}.`);
  }

  return Object.freeze({ groupCount: seenGroupIds.size, recordCount });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateFootwear();
  console.log(`Footwear validation passed: ${result.groupCount} groups, ${result.recordCount} records.`);
}
