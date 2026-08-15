import { fileURLToPath } from "node:url";
import path from "node:path";

import { BODY_REGIONS, BODY_SIDES } from "../../data/vocabulary/body-regions.js";
import { TEMPERATURES } from "../../data/vocabulary/temperatures.js";
import { SEASONS } from "../../data/vocabulary/seasons.js";
import { FORMALITIES } from "../../data/vocabulary/formalities.js";

import { SCI_FI_PACKAGES } from "../../data/packages/sci-fi.js";
import { HISTORICAL_PACKAGES } from "../../data/packages/historical.js";
import { ATHLETIC_PACKAGES } from "../../data/packages/athletic.js";
import { OCCUPATION_PACKAGES } from "../../data/packages/occupations.js";
import { COSTUME_PACKAGES } from "../../data/packages/costumes.js";
import { CULTURAL_PACKAGES } from "../../data/packages/cultural.js";

const APPROVED_GROUP_IDS = Object.freeze([
  "sci-fi",
  "historical",
  "athletic",
  "occupations",
  "costumes",
  "cultural",
]);

const PACKAGE_GROUPS = Object.freeze([
  SCI_FI_PACKAGES,
  HISTORICAL_PACKAGES,
  ATHLETIC_PACKAGES,
  OCCUPATION_PACKAGES,
  COSTUME_PACKAGES,
  CULTURAL_PACKAGES,
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

function validateCoverage(packageRecord) {
  const coverage = packageRecord.coverage;
  if (!coverage || !Array.isArray(coverage.covered) || !Array.isArray(coverage.partiallyCovered)) {
    throw new Error(`${packageRecord.id}: coverage must contain covered and partiallyCovered arrays.`);
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
        throw new Error(`${packageRecord.id}: unknown body region ${entry?.region}.`);
      }

      let key;
      if (region.supportsSide) {
        if (!BODY_SIDE_SET.has(entry.side)) {
          throw new Error(`${packageRecord.id}: ${entry.region} requires a valid side.`);
        }
        key = `${entry.region}|${entry.side}`;
      } else {
        if (Object.prototype.hasOwnProperty.call(entry, "side")) {
          throw new Error(`${packageRecord.id}: ${entry.region} does not support side.`);
        }
        key = `${entry.region}|`;
      }

      if (seen.has(key)) {
        throw new Error(`${packageRecord.id}: duplicate ${bucketName} coverage entry ${key}.`);
      }
      seen.add(key);
    }
  }

  for (const key of seenCovered) {
    if (seenPartial.has(key)) {
      throw new Error(`${packageRecord.id}: coverage entry ${key} appears in both buckets.`);
    }
  }
}

function validateComponents(packageRecord) {
  if (packageRecord.components === undefined) {
    return;
  }
  if (!Array.isArray(packageRecord.components)) {
    throw new Error(`${packageRecord.id}: components must be an array.`);
  }

  const componentIds = new Set();
  for (const component of packageRecord.components) {
    requireNonEmptyString(component?.id, `${packageRecord.id} component id`);
    requireNonEmptyString(component?.name, `${packageRecord.id} component name`);
    if (componentIds.has(component.id)) {
      throw new Error(`${packageRecord.id}: duplicate component id ${component.id}.`);
    }
    componentIds.add(component.id);
  }
}

export function validatePackages(groups = PACKAGE_GROUPS) {
  const seenGroupIds = new Set();
  const seenPackageIds = new Set();
  let packageCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Package group id");
    if (!APPROVED_GROUP_ID_SET.has(group.id)) {
      throw new Error(`Unknown Package group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Package group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }

    for (const packageRecord of group.items) {
      packageCount += 1;
      requireNonEmptyString(packageRecord?.id, `${group.id} Package id`);
      requireNonEmptyString(packageRecord?.name, `${packageRecord?.id ?? group.id} name`);
      requireNonEmptyString(packageRecord?.prompt, `${packageRecord?.id ?? group.id} prompt`);

      if (seenPackageIds.has(packageRecord.id)) {
        throw new Error(`Duplicate Package id ${packageRecord.id}.`);
      }
      seenPackageIds.add(packageRecord.id);

      const temperature = packageRecord.temperature;
      if (!Array.isArray(temperature) || temperature.length === 0) {
        throw new Error(`${packageRecord.id}: temperature must be a non-empty array.`);
      }
      for (const value of temperature) {
        if (!TEMPERATURE_ID_SET.has(value)) {
          throw new Error(`${packageRecord.id}: unknown Temperature ${value}.`);
        }
      }

      const season = packageRecord.season;
      if (!Array.isArray(season) || season.length === 0) {
        throw new Error(`${packageRecord.id}: season must be a non-empty array.`);
      }
      for (const value of season) {
        if (!SEASON_ID_SET.has(value)) {
          throw new Error(`${packageRecord.id}: unknown Season ${value}.`);
        }
      }

      if (!FORMALITY_ID_SET.has(packageRecord.formality)) {
        throw new Error(`${packageRecord.id}: unknown Formality ${packageRecord.formality}.`);
      }

      const effectiveEnabled = packageRecord.enabled ?? group.defaults.enabled;
      if (typeof effectiveEnabled !== "boolean") {
        throw new Error(`${packageRecord.id}: effective enabled must be boolean.`);
      }

      const effectiveSelectionWeight =
        packageRecord.selectionWeight ?? group.defaults.selectionWeight;
      if (
        typeof effectiveSelectionWeight !== "number" ||
        !Number.isFinite(effectiveSelectionWeight) ||
        effectiveSelectionWeight < 0
      ) {
        throw new Error(
          `${packageRecord.id}: effective selectionWeight must be a finite non-negative number.`,
        );
      }

      validateCoverage(packageRecord);
      validateComponents(packageRecord);

      for (const deferredField of ["style", "mood", "themeAffinity"]) {
        if (Object.prototype.hasOwnProperty.call(packageRecord, deferredField)) {
          throw new Error(`${packageRecord.id}: deferred field ${deferredField} is not allowed.`);
        }
      }
    }
  }

  if (seenGroupIds.size !== APPROVED_GROUP_ID_SET.size) {
    throw new Error(
      `Expected ${APPROVED_GROUP_ID_SET.size} Package groups, found ${seenGroupIds.size}.`,
    );
  }

  return Object.freeze({
    groupCount: seenGroupIds.size,
    packageCount,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validatePackages();
  console.log(`Package validation passed: ${result.groupCount} groups, ${result.packageCount} packages.`);
}
