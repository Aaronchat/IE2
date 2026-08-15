import { fileURLToPath } from "node:url";
import path from "node:path";

import { TIME_OF_DAY } from "../../data/time-of-day/time-of-day.js";
import { TIME_OF_DAY_CONFIG } from "../../data/time-of-day/config.js";

const EXPECTED_RECORDS = Object.freeze([
  Object.freeze({ id: "sunrise", name: "Sunrise", prompt: "at sunrise" }),
  Object.freeze({ id: "early-morning", name: "Early Morning", prompt: "in the early morning" }),
  Object.freeze({ id: "morning", name: "Morning", prompt: "in the morning" }),
  Object.freeze({ id: "late-morning", name: "Late Morning", prompt: "in the late morning" }),
  Object.freeze({ id: "midday", name: "Midday", prompt: "at midday" }),
  Object.freeze({ id: "afternoon", name: "Afternoon", prompt: "in the afternoon" }),
  Object.freeze({ id: "golden-hour", name: "Golden Hour", prompt: "at golden hour" }),
  Object.freeze({ id: "sunset", name: "Sunset", prompt: "at sunset" }),
  Object.freeze({ id: "blue-hour", name: "Blue Hour", prompt: "during blue hour" }),
  Object.freeze({ id: "evening", name: "Evening", prompt: "in the evening" }),
  Object.freeze({ id: "night", name: "Night", prompt: "at night" }),
  Object.freeze({ id: "late-night", name: "Late Night", prompt: "late at night" }),
  Object.freeze({ id: "midnight", name: "Midnight", prompt: "at midnight" }),
]);

const EXPECTED_BY_ID = new Map(EXPECTED_RECORDS.map((record) => [record.id, record]));

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateConfig(config) {
  if (config?.maxSelections !== 1) {
    throw new Error("Time of Day maxSelections must be exactly 1.");
  }

  if (config?.none?.exclusive !== true || config?.none?.contributesPrompt !== false) {
    throw new Error("Time of Day None must be exclusive and contribute no prompt.");
  }

  const allowedConfigKeys = new Set(["maxSelections", "none"]);
  for (const key of Object.keys(config ?? {})) {
    if (!allowedConfigKeys.has(key)) {
      throw new Error(`Unapproved Time of Day configuration field ${key}.`);
    }
  }
}

export function validateTimeOfDay(group = TIME_OF_DAY, config = TIME_OF_DAY_CONFIG) {
  if (group?.id !== "time-of-day") {
    throw new Error(`Time of Day group id must be time-of-day, found ${group?.id}.`);
  }
  if (group?.name !== "Time of Day") {
    throw new Error(`Time of Day group name must be Time of Day, found ${group?.name}.`);
  }
  if (!group.defaults || !Array.isArray(group.items)) {
    throw new Error("Time of Day group must contain defaults and items.");
  }

  if (group.items.length !== EXPECTED_RECORDS.length) {
    throw new Error(
      `Expected ${EXPECTED_RECORDS.length} Time of Day records, found ${group.items.length}.`,
    );
  }

  const seenIds = new Set();
  const seenNames = new Set();

  for (const record of group.items) {
    requireNonEmptyString(record?.id, "Time of Day record id");
    requireNonEmptyString(record?.name, `${record?.id ?? "Time of Day record"} name`);
    requireNonEmptyString(record?.prompt, `${record?.id ?? "Time of Day record"} prompt`);

    if (seenIds.has(record.id)) {
      throw new Error(`Duplicate Time of Day record id ${record.id}.`);
    }
    seenIds.add(record.id);

    const normalizedName = record.name.trim().toLowerCase();
    if (seenNames.has(normalizedName)) {
      throw new Error(`Duplicate Time of Day record name ${record.name}.`);
    }
    seenNames.add(normalizedName);

    const expected = EXPECTED_BY_ID.get(record.id);
    if (!expected) {
      throw new Error(`Unapproved Time of Day record ${record.id}.`);
    }
    if (record.name !== expected.name) {
      throw new Error(`${record.id}: expected name ${expected.name}, found ${record.name}.`);
    }
    if (record.prompt !== expected.prompt) {
      throw new Error(`${record.id}: expected prompt ${expected.prompt}, found ${record.prompt}.`);
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
      throw new Error(
        `${record.id}: effective selectionWeight must be a finite non-negative number.`,
      );
    }

    for (const forbiddenField of [
      "atmosphere",
      "weather",
      "location",
      "environment",
      "temperature",
      "season",
      "lighting",
      "camera",
      "theme",
      "pose",
      "coverage",
      "formality",
      "style",
      "mood",
      "themeAffinity",
    ]) {
      if (Object.prototype.hasOwnProperty.call(record, forbiddenField)) {
        throw new Error(`${record.id}: unapproved Time of Day field ${forbiddenField}.`);
      }
    }
  }

  if (seenIds.has("none") || seenNames.has("none")) {
    throw new Error("None must not exist as Time of Day catalog data.");
  }
  for (const rejected of ["dawn", "dusk"]) {
    if (seenIds.has(rejected) || seenNames.has(rejected)) {
      throw new Error(`${rejected} is not an approved Time of Day record.`);
    }
  }

  validateConfig(config);

  return Object.freeze({
    groupCount: 1,
    recordCount: group.items.length,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateTimeOfDay();
  console.log(
    `Time of Day validation passed: ${result.groupCount} group, ${result.recordCount} records.`,
  );
}
