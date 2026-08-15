import { fileURLToPath } from "node:url";
import path from "node:path";

import { GENERAL_LOCATIONS } from "../../data/locations/general-locations.js";
import { NAMED_LANDMARKS_DESTINATIONS } from "../../data/locations/named-landmarks-destinations.js";
import { NAMED_UT_SPORTS_LOCATIONS } from "../../data/locations/named-ut-sports-locations.js";
import { EVENT_SCENE_LOCATIONS } from "../../data/locations/event-scene-locations.js";

const APPROVED_GROUP_IDS = Object.freeze([
  "general-locations",
  "named-landmarks-destinations",
  "named-ut-sports-locations",
  "event-scene-locations",
]);

const APPROVED_ENVIRONMENTS = Object.freeze([
  "indoor",
  "outdoor",
  "indoor-exterior-view",
]);

const EXPECTED_RECORD_COUNT = 106;

const LOCATION_GROUPS = Object.freeze([
  GENERAL_LOCATIONS,
  NAMED_LANDMARKS_DESTINATIONS,
  NAMED_UT_SPORTS_LOCATIONS,
  EVENT_SCENE_LOCATIONS,
]);

const APPROVED_GROUP_ID_SET = new Set(APPROVED_GROUP_IDS);
const APPROVED_ENVIRONMENT_SET = new Set(APPROVED_ENVIRONMENTS);

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

export function validateLocations(groups = LOCATION_GROUPS) {
  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  let recordCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Location group id");
    requireNonEmptyString(group?.name, `${group?.id ?? "Location group"} name`);

    if (!APPROVED_GROUP_ID_SET.has(group.id)) {
      throw new Error(`Unknown Location group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Location group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }

    for (const record of group.items) {
      recordCount += 1;
      requireNonEmptyString(record?.id, `${group.id} Location id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Location record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      if (!APPROVED_ENVIRONMENT_SET.has(record.environment)) {
        throw new Error(`${record.id}: unknown Environment ${record.environment}.`);
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
        "formality",
        "coverage",
        "style",
        "mood",
        "themeAffinity",
        "camera",
        "lighting",
        "pose",
      ]) {
        if (Object.prototype.hasOwnProperty.call(record, forbiddenField)) {
          throw new Error(`${record.id}: unapproved Location field ${forbiddenField} is not allowed.`);
        }
      }
    }
  }

  if (seenGroupIds.size !== APPROVED_GROUP_ID_SET.size) {
    throw new Error(`Expected ${APPROVED_GROUP_ID_SET.size} Location groups, found ${seenGroupIds.size}.`);
  }

  if (recordCount !== EXPECTED_RECORD_COUNT) {
    throw new Error(`Expected ${EXPECTED_RECORD_COUNT} Location records, found ${recordCount}.`);
  }

  return Object.freeze({ groupCount: seenGroupIds.size, recordCount });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateLocations();
  console.log(`Location validation passed: ${result.groupCount} groups, ${result.recordCount} records.`);
}
