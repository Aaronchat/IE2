import { fileURLToPath } from "node:url";
import path from "node:path";

import { BODY_REGIONS } from "../../data/vocabulary/body-regions.js";
import { TATTOO_GENERIC_STYLES, TATTOO_PLACEMENTS, TATTOOS_CONFIG } from "../../data/tattoos/config.js";

function text(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
}

function unique(records, label) {
  const ids = new Set();
  const names = new Set();
  for (const record of records) {
    text(record?.id, `${label} id`);
    text(record?.name, `${label} name`);
    if (ids.has(record.id)) throw new Error(`Duplicate ${label} id ${record.id}.`);
    if (names.has(record.name)) throw new Error(`Duplicate ${label} name ${record.name}.`);
    ids.add(record.id);
    names.add(record.name);
  }
}

export function validateTattoos() {
  unique(TATTOO_PLACEMENTS, "Tattoo Placement");
  unique(TATTOO_GENERIC_STYLES, "Tattoo Generic Style");

  const expectedStyles = ["Traditional", "Neo-Traditional", "Japanese", "Tribal", "Blackwork", "Fine-Line", "Watercolor", "Realism", "Geometric", "Biomechanical"];
  if (TATTOO_GENERIC_STYLES.length !== expectedStyles.length || expectedStyles.some((name) => !TATTOO_GENERIC_STYLES.some((record) => record.name === name))) {
    throw new Error("Tattoo Generic Styles do not match the approved initial set.");
  }
  for (const style of TATTOO_GENERIC_STYLES) text(style.prompt, `${style.id} prompt`);

  if (JSON.stringify(TATTOOS_CONFIG.designModes) !== JSON.stringify(["generic", "specific"])) throw new Error("Tattoo design modes must be Generic and Specific.");

  const regionMap = new Map(BODY_REGIONS.map((region) => [region.id, region]));
  let patternCount = 0;
  for (const placement of TATTOO_PLACEMENTS) {
    if (!Array.isArray(placement.patterns) || placement.patterns.length === 0) throw new Error(`${placement.id} must contain Tattoo patterns.`);
    unique(placement.patterns, `${placement.id} Tattoo Pattern`);
    for (const pattern of placement.patterns) {
      patternCount += 1;
      text(pattern.sizePrompt, `${placement.id}/${pattern.id} sizePrompt`);
      text(pattern.placementPrompt, `${placement.id}/${pattern.id} placementPrompt`);
      if (!["tattoo", "sleeve", "leg"].includes(pattern.format)) throw new Error(`${placement.id}/${pattern.id} has invalid Tattoo format.`);
      if (!Array.isArray(pattern.requiredRegions) || pattern.requiredRegions.length === 0) throw new Error(`${placement.id}/${pattern.id} requires body regions.`);
      const seen = new Set();
      for (const entry of pattern.requiredRegions) {
        const region = regionMap.get(entry.region);
        if (!region) throw new Error(`${placement.id}/${pattern.id} references unknown body region ${entry.region}.`);
        if (region.supportsSide && !["left", "right"].includes(entry.side)) throw new Error(`${placement.id}/${pattern.id} requires a left/right side for ${entry.region}.`);
        if (!region.supportsSide && entry.side != null) throw new Error(`${placement.id}/${pattern.id} cannot side ${entry.region}.`);
        const key = `${entry.region}:${entry.side ?? "none"}`;
        if (seen.has(key)) throw new Error(`${placement.id}/${pattern.id} duplicates required region ${key}.`);
        seen.add(key);
      }
    }
  }

  return Object.freeze({ placementCount: TATTOO_PLACEMENTS.length, patternCount, genericStyleCount: TATTOO_GENERIC_STYLES.length });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedFile === currentFile) {
  const result = validateTattoos();
  console.log(`Tattoos validation passed: ${result.placementCount} placements, ${result.patternCount} patterns, ${result.genericStyleCount} generic styles.`);
}
