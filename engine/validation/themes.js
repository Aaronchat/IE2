import { fileURLToPath } from "node:url";
import path from "node:path";

import { THEME_COLORS } from "../../data/themes/colors.js";
import { THEME_HOLIDAYS_EVENTS } from "../../data/themes/holidays-events.js";
import { THEME_GENRES_AESTHETICS } from "../../data/themes/genres-aesthetics.js";
import { THEMES_CONFIG } from "../../data/themes/config.js";

const EXPECTED_GROUPS = Object.freeze([
  Object.freeze({ id: "colors", name: "Colors", records: Object.freeze([
    ["red", "Red", "red"], ["white", "White", "white"], ["pink", "Pink", "pink"],
    ["hot-pink", "Hot Pink", "hot pink"], ["purple", "Purple", "purple"],
  ]) }),
  Object.freeze({ id: "holidays-events", name: "Holidays & Events", records: Object.freeze([
    ["christmas", "Christmas", "Christmas"], ["halloween", "Halloween", "Halloween"],
    ["easter", "Easter", "Easter"], ["valentines-day", "Valentine's Day", "Valentine's Day"],
    ["new-years-eve", "New Year's Eve", "New Year's Eve"], ["fourth-of-july", "Fourth of July", "Fourth of July"],
  ]) }),
  Object.freeze({ id: "genres-aesthetics", name: "Genres & Aesthetics", records: Object.freeze([
    ["gothic", "Gothic", "Gothic"], ["western", "Western", "Western"],
    ["victorian", "Victorian", "Victorian"], ["noir", "Noir", "Noir"],
    ["psychedelic", "Psychedelic", "Psychedelic"], ["longhorns", "Longhorns", "Longhorns"],
    ["beach-party", "Beach Party", "Beach party"], ["hippy", "Hippy", "Hippy"],
  ]) }),
]);

const THEME_GROUPS = Object.freeze([
  THEME_COLORS,
  THEME_HOLIDAYS_EVENTS,
  THEME_GENRES_AESTHETICS,
]);

const EXPECTED_GROUP_BY_ID = new Map(EXPECTED_GROUPS.map((entry) => [entry.id, entry]));
const ALLOWED_RECORD_KEYS = new Set(["id", "name", "prompt", "enabled", "selectionWeight"]);
const ALLOWED_GROUP_KEYS = new Set(["id", "name", "defaults", "items"]);
const ALLOWED_DEFAULT_KEYS = new Set(["enabled", "selectionWeight"]);

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") throw new Error(`${label} must be a non-empty string.`);
}

function validateConfig(config) {
  if (config?.maxSelections !== 3) throw new Error("Themes maxSelections must be exactly 3.");
  if (config?.none?.exclusive !== true || config?.none?.contributesPrompt !== false) {
    throw new Error("Themes None must be exclusive and contribute no prompt.");
  }

  const weights = config?.randomStackSizeWeights;
  const expected = [[1, 50], [2, 40], [3, 10]];
  if (!Array.isArray(weights) || weights.length !== expected.length || expected.some(([count, weight], index) => (
    weights[index]?.count !== count || weights[index]?.weight !== weight
  ))) {
    throw new Error("Theme Random stack-size weights must be 50% single, 40% double, and 10% triple.");
  }

  const allowedKeys = new Set(["maxSelections", "randomStackSizeWeights", "none"]);
  for (const key of Object.keys(config ?? {})) {
    if (!allowedKeys.has(key)) throw new Error(`Unapproved Themes configuration field ${key}.`);
  }
}

export function validateThemes(groups = THEME_GROUPS, config = THEMES_CONFIG) {
  if (!Array.isArray(groups) || groups.length !== EXPECTED_GROUPS.length) {
    throw new Error(`Expected ${EXPECTED_GROUPS.length} Theme categories.`);
  }

  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  const seenRecordNames = new Set();
  let recordCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Theme category id");
    requireNonEmptyString(group?.name, `${group?.id ?? "Theme category"} name`);
    const expected = EXPECTED_GROUP_BY_ID.get(group.id);
    if (!expected) throw new Error(`Unknown Theme category ${group.id}.`);
    if (seenGroupIds.has(group.id)) throw new Error(`Duplicate Theme category ${group.id}.`);
    seenGroupIds.add(group.id);
    if (group.name !== expected.name) throw new Error(`${group.id}: expected category name ${expected.name}.`);
    if (!group.defaults || !Array.isArray(group.items)) throw new Error(`${group.id}: category must contain defaults and items.`);
    if (group.items.length !== expected.records.length) throw new Error(`${group.id}: expected ${expected.records.length} Themes, found ${group.items.length}.`);
    for (const key of Object.keys(group)) {
      if (!ALLOWED_GROUP_KEYS.has(key)) throw new Error(`${group.id}: unapproved Theme category field ${key}.`);
    }
    for (const key of Object.keys(group.defaults)) {
      if (!ALLOWED_DEFAULT_KEYS.has(key)) throw new Error(`${group.id}: unapproved Theme category default ${key}.`);
    }
    const expectedById = new Map(expected.records.map(([id, name, prompt]) => [id, { name, prompt }]));

    for (const record of group.items) {
      recordCount += 1;
      requireNonEmptyString(record?.id, `${group.id} Theme id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);
      if (seenRecordIds.has(record.id)) throw new Error(`Duplicate Theme id ${record.id}.`);
      seenRecordIds.add(record.id);
      const expectedRecord = expectedById.get(record.id);
      if (!expectedRecord) throw new Error(`Unapproved Theme ${record.id}.`);
      if (record.name !== expectedRecord.name || record.prompt !== expectedRecord.prompt) {
        throw new Error(`${record.id}: Theme name or prompt does not match the approved catalog.`);
      }
      const normalizedName = record.name.trim().toLowerCase();
      if (seenRecordNames.has(normalizedName)) throw new Error(`Duplicate Theme name ${record.name}.`);
      seenRecordNames.add(normalizedName);

      const enabled = record.enabled ?? group.defaults.enabled;
      if (typeof enabled !== "boolean") throw new Error(`${record.id}: effective enabled must be boolean.`);
      const weight = record.selectionWeight ?? group.defaults.selectionWeight;
      if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) {
        throw new Error(`${record.id}: effective selectionWeight must be a finite non-negative number.`);
      }
      for (const key of Object.keys(record)) {
        if (!ALLOWED_RECORD_KEYS.has(key)) throw new Error(`${record.id}: unapproved Theme record field ${key}.`);
      }
    }
  }

  if (seenRecordIds.has("none") || seenRecordNames.has("none")) throw new Error("None must not exist as Theme catalog data.");
  validateConfig(config);
  return Object.freeze({ categoryCount: seenGroupIds.size, recordCount });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateThemes();
  console.log(`Themes validation passed: ${result.categoryCount} categories, ${result.recordCount} records.`);
}
