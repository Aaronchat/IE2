import { fileURLToPath } from "node:url";
import path from "node:path";

import { CHARACTER_NAMES } from "../../data/character/names.js";
import { CHARACTER_SKIN } from "../../data/character/skin.js";
import { CHARACTER_HAIR } from "../../data/character/hair.js";
import { CHARACTER_EYES } from "../../data/character/eyes.js";
import { CHARACTER_EXPRESSION } from "../../data/character/expression.js";
import { CHARACTER_MAKEUP } from "../../data/character/makeup.js";
import { CHARACTER_PHYSICAL_APPEARANCE } from "../../data/character/physical-appearance.js";
import { CHARACTER_FEATURES } from "../../data/character/character-features.js";

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateStringArray(values, label) {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(`${label} must be a non-empty array.`);
  }

  const seen = new Set();
  for (const value of values) {
    requireNonEmptyString(value, `${label} value`);
    if (seen.has(value)) {
      throw new Error(`${label} contains duplicate value ${value}.`);
    }
    seen.add(value);
  }
  return values.length;
}

function validateNames() {
  requireNonEmptyString(CHARACTER_NAMES.defaultEthnicity, "Default ethnicity");
  if (!Array.isArray(CHARACTER_NAMES.ethnicities) || CHARACTER_NAMES.ethnicities.length === 0) {
    throw new Error("Character ethnicity groups must be a non-empty array.");
  }

  const groupNames = new Set();
  const characterNames = new Set();
  let totalNames = 0;

  for (const group of CHARACTER_NAMES.ethnicities) {
    requireNonEmptyString(group?.name, "Ethnicity group name");
    if (groupNames.has(group.name)) {
      throw new Error(`Duplicate ethnicity group ${group.name}.`);
    }
    groupNames.add(group.name);

    validateStringArray(group.names, `${group.name} names`);
    for (const name of group.names) {
      if (characterNames.has(name)) {
        throw new Error(`Duplicate Character name ${name}.`);
      }
      characterNames.add(name);
      totalNames += 1;
    }
  }

  if (!groupNames.has(CHARACTER_NAMES.defaultEthnicity)) {
    throw new Error(`Default ethnicity ${CHARACTER_NAMES.defaultEthnicity} does not exist.`);
  }

  return { ethnicityGroupCount: groupNames.size, nameCount: totalNames };
}

function validateHair() {
  validateStringArray(CHARACTER_HAIR.colors?.natural, "Natural hair colors");
  validateStringArray(CHARACTER_HAIR.colors?.fantasy, "Fantasy hair colors");

  const allColors = [...CHARACTER_HAIR.colors.natural, ...CHARACTER_HAIR.colors.fantasy];
  if (new Set(allColors).size !== allColors.length) {
    throw new Error("Hair color values must be unique across Natural and Fantasy groups.");
  }

  validateStringArray(CHARACTER_HAIR.lengths, "Hair lengths");
  validateStringArray(CHARACTER_HAIR.textures, "Hair textures");

  const expectedStyleGroups = ["looseDown", "short", "ponytails", "buns", "braids", "alternative"];
  const actualStyleGroups = Object.keys(CHARACTER_HAIR.styles ?? {});
  if (actualStyleGroups.length !== expectedStyleGroups.length || expectedStyleGroups.some((key) => !actualStyleGroups.includes(key))) {
    throw new Error("Hair style groups do not match the approved structure.");
  }

  const allStyles = [];
  for (const key of expectedStyleGroups) {
    validateStringArray(CHARACTER_HAIR.styles[key], `Hair styles ${key}`);
    allStyles.push(...CHARACTER_HAIR.styles[key]);
  }
  if (new Set(allStyles).size !== allStyles.length) {
    throw new Error("Hair style values must be unique across style groups.");
  }
}

function validateNoSelectionSentinels() {
  const forbidden = new Set(["Random", "None"]);
  const seen = [];

  function walk(value, trail) {
    if (typeof value === "string") {
      if (forbidden.has(value)) {
        seen.push(`${trail}: ${value}`);
      }
      return;
    }
    if (Array.isArray(value)) {
      value.forEach((entry, index) => walk(entry, `${trail}[${index}]`));
      return;
    }
    if (value && typeof value === "object") {
      for (const [key, entry] of Object.entries(value)) {
        walk(entry, `${trail}.${key}`);
      }
    }
  }

  for (const [label, value] of [
    ["names", CHARACTER_NAMES],
    ["skin", CHARACTER_SKIN],
    ["hair", CHARACTER_HAIR],
    ["eyes", CHARACTER_EYES],
    ["expression", CHARACTER_EXPRESSION],
    ["makeup", CHARACTER_MAKEUP],
    ["physicalAppearance", CHARACTER_PHYSICAL_APPEARANCE],
    ["characterFeatures", CHARACTER_FEATURES],
  ]) {
    walk(value, label);
  }

  if (seen.length > 0) {
    throw new Error(`Character data contains forbidden selection sentinel(s): ${seen.join(", ")}.`);
  }
}

export function validateCharacter() {
  const names = validateNames();

  validateStringArray(CHARACTER_SKIN.skinTones, "Skin tones");
  validateStringArray(CHARACTER_SKIN.freckles, "Freckles");
  validateHair();
  validateStringArray(CHARACTER_EYES.colors, "Eye colors");
  validateStringArray(CHARACTER_EXPRESSION.expressions, "Expressions");
  validateStringArray(CHARACTER_EXPRESSION.gaze, "Gaze");
  validateStringArray(CHARACTER_MAKEUP.options, "Makeup");
  validateStringArray(CHARACTER_PHYSICAL_APPEARANCE.build, "Build");
  validateStringArray(CHARACTER_PHYSICAL_APPEARANCE.chest?.descriptions, "Chest descriptions");
  validateStringArray(CHARACTER_PHYSICAL_APPEARANCE.chest?.optionalAdjectives, "Chest optional adjectives");
  validateStringArray(CHARACTER_PHYSICAL_APPEARANCE.hipWidth, "Hip width");
  validateStringArray(CHARACTER_PHYSICAL_APPEARANCE.waist, "Waist");
  validateStringArray(CHARACTER_FEATURES.options, "Character features");
  validateNoSelectionSentinels();

  return Object.freeze({
    ethnicityGroupCount: names.ethnicityGroupCount,
    nameCount: names.nameCount,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateCharacter();
  console.log(`Character validation passed: ${result.ethnicityGroupCount} ethnicity groups, ${result.nameCount} names.`);
}
