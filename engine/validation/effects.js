import { fileURLToPath } from "node:url";
import path from "node:path";

import { CLEAR_ATMOSPHERE } from "../../data/weather/clear.js";
import { WIND_ATMOSPHERE } from "../../data/weather/wind.js";
import { NON_CLEAR_ATMOSPHERE } from "../../data/weather/non-clear.js";

import { EFFECTS_IMPERFECTIONS } from "../../data/effects/imperfections.js";
import { FILM_AGE } from "../../data/effects/film-age.js";
import { EFFECTS_CONFIG } from "../../data/effects/config.js";

const EXPECTED_GROUPS = Object.freeze([
  Object.freeze({ id: "effects-imperfections", count: 13 }),
  Object.freeze({ id: "film-age", count: 7 }),
]);

const EFFECTS_GROUPS = Object.freeze([
  EFFECTS_IMPERFECTIONS,
  FILM_AGE,
]);

const EXPECTED_GROUP_BY_ID = new Map(EXPECTED_GROUPS.map((entry) => [entry.id, entry]));
const EXPECTED_TOTAL_RECORDS = 20;

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateNone(control, label) {
  if (control?.none?.exclusive !== true || control?.none?.contributesPrompt !== false) {
    throw new Error(`${label} None must be exclusive and contribute no prompt.`);
  }
}

function validateConfig(config) {
  const controls = config?.controls;
  if (!controls || typeof controls !== "object") {
    throw new Error("Effects config must contain controls.");
  }

  const expectedIds = ["effects-imperfections", "film-age"];
  if (
    Object.keys(controls).length !== expectedIds.length ||
    expectedIds.some((id) => !Object.prototype.hasOwnProperty.call(controls, id))
  ) {
    throw new Error("Effects config controls do not match the two approved Effects controls.");
  }

  const imperfections = controls["effects-imperfections"];
  if (imperfections?.maxSelections !== 2) {
    throw new Error("Effects / Imperfections maxSelections must be exactly 2.");
  }
  if (!Array.isArray(imperfections.defaultSelections) || imperfections.defaultSelections.length !== 0) {
    throw new Error("Effects / Imperfections must default to no active records.");
  }
  validateNone(imperfections, "Effects / Imperfections");

  const filmAge = controls["film-age"];
  if (filmAge?.maxSelections !== 1) {
    throw new Error("Film Age maxSelections must be exactly 1.");
  }
  if (filmAge.defaultSelection !== null) {
    throw new Error("Film Age must default to None.");
  }
  validateNone(filmAge, "Film Age");
}

export function validateEffects(groups = EFFECTS_GROUPS, config = EFFECTS_CONFIG) {
  if (!Array.isArray(groups) || groups.length !== EXPECTED_GROUPS.length) {
    throw new Error(`Expected ${EXPECTED_GROUPS.length} Effects controls.`);
  }

  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  const seenRecordNames = new Set();
  const seenPrompts = new Set();
  let totalRecords = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Effects group id");
    requireNonEmptyString(group?.name, `${group?.id ?? "Effects group"} name`);

    const expected = EXPECTED_GROUP_BY_ID.get(group.id);
    if (!expected) {
      throw new Error(`Unknown Effects group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Effects group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }
    if (group.items.length !== expected.count) {
      throw new Error(`${group.id}: expected ${expected.count} records, found ${group.items.length}.`);
    }

    for (const record of group.items) {
      totalRecords += 1;
      requireNonEmptyString(record?.id, `${group.id} Effects id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Effects record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      const normalizedName = record.name.trim().toLowerCase();
      if (seenRecordNames.has(normalizedName)) {
        throw new Error(`Duplicate Effects record name ${record.name}.`);
      }
      seenRecordNames.add(normalizedName);

      const normalizedPrompt = record.prompt.trim().toLowerCase();
      if (seenPrompts.has(normalizedPrompt)) {
        throw new Error(`Duplicate Effects prompt ${record.prompt}.`);
      }
      seenPrompts.add(normalizedPrompt);

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

      const allowedKeys = new Set(["id", "name", "prompt", "enabled", "selectionWeight"]);
      for (const key of Object.keys(record)) {
        if (!allowedKeys.has(key)) {
          throw new Error(`${record.id}: unapproved Effects record field ${key}.`);
        }
      }
    }
  }

  if (totalRecords !== EXPECTED_TOTAL_RECORDS) {
    throw new Error(`Expected ${EXPECTED_TOTAL_RECORDS} Effects records, found ${totalRecords}.`);
  }

  if (seenRecordIds.has("none") || seenRecordNames.has("none")) {
    throw new Error("None must not exist as Effects catalog data.");
  }

  const atmosphereNames = new Set(
    [...CLEAR_ATMOSPHERE.items, ...WIND_ATMOSPHERE.items, ...NON_CLEAR_ATMOSPHERE.items]
      .map((record) => record.name.trim().toLowerCase()),
  );
  for (const name of seenRecordNames) {
    if (atmosphereNames.has(name)) {
      throw new Error(`Atmosphere record ${name} must not leak into Effects.`);
    }
  }

  for (const forbiddenName of [
    "Natural Light Portrait",
    "Flash Photography",
    "Harsh On-Camera Flash",
    "Cinematic Color Grade",
    "High Fashion Editorial",
    "Glossy Magazine Look",
    "Romance Novel Cover",
    "Album Cover",
    "DVD Cover",
    "VHS Cover",
    "Magazine Cover",
    "Movie Poster",
  ]) {
    if (seenRecordNames.has(forbiddenName.toLowerCase())) {
      throw new Error(`Forbidden Effects record ${forbiddenName} is present.`);
    }
  }

  validateConfig(config);

  return Object.freeze({
    controlCount: seenGroupIds.size,
    recordCount: totalRecords,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateEffects();
  console.log(
    `Effects validation passed: ${result.controlCount} controls, ${result.recordCount} records.`,
  );
}
