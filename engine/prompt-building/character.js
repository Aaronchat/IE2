function clean(value) {
  return typeof value === "string" ? value.trim() : value;
}

function lower(value) {
  return clean(value)?.toLowerCase();
}

function selectionValue(character, key) {
  return character?.[key]?.value;
}

function push(fragments, value) {
  if (typeof value === "string" && value.trim()) fragments.push(value.trim());
}

function multicolorHair(primary, secondary, treatment) {
  const main = lower(primary);
  const accent = lower(secondary);
  switch (treatment) {
    case "Highlights": return `${main} hair with ${accent} highlights`;
    case "Streaks": return `${main} hair with ${accent} streaks`;
    case "Ombré": return `${main}-to-${accent} ombré hair`;
    case "Colored Tips": return `${main} hair with ${accent} tips`;
    case "Split Dye": return `${main}-and-${accent} split-dyed hair`;
    case "Face-Framing Color": return `${main} hair with ${accent} face-framing color`;
    case "Contrasting Roots": return `${main} hair with ${accent} contrasting roots`;
    case "Frosted Tips": return `${main} hair with ${accent} frosted tips`;
    default: throw new Error(`Unknown Hair Color Treatment ${treatment}.`);
  }
}

function hairStylePrompt(style) {
  const normalized = lower(style);
  if (normalized === "bald") return "bald";
  if (normalized.endsWith(" hair")) return normalized;
  return `${normalized} hairstyle`;
}

export function buildCharacterFragments(character = {}) {
  if (!character || typeof character !== "object" || Array.isArray(character)) {
    throw new Error("Prompt Building requires Character selections to be an object.");
  }

  const fragments = [];

  push(fragments, clean(selectionValue(character, "name")));
  push(fragments, clean(selectionValue(character, "ethnicity")));
  push(fragments, clean(selectionValue(character, "age")));

  const hairStyle = selectionValue(character, "hair-style");
  const legacyHairLength = selectionValue(character, "hair-length");
  const isBald = lower(hairStyle) === "bald" || (!hairStyle && lower(legacyHairLength) === "bald");
  if (isBald) {
    push(fragments, "bald");
  } else {
    const hairColor = selectionValue(character, "hair-color");
    const secondary = selectionValue(character, "hair-secondary-color");
    const treatment = selectionValue(character, "hair-color-treatment");
    if (legacyHairLength && !hairStyle) push(fragments, `${lower(legacyHairLength)} hair`);
    if (hairColor && secondary && treatment) push(fragments, multicolorHair(hairColor, secondary, treatment));
    else if (hairColor) push(fragments, `${lower(hairColor)} hair`);
    if (hairStyle) push(fragments, hairStylePrompt(hairStyle));
  }

  const eyeColor = selectionValue(character, "eye-color");
  if (eyeColor) push(fragments, `${lower(eyeColor)} eyes`);

  const expression = selectionValue(character, "expression");
  if (expression) push(fragments, lower(expression));

  const gaze = selectionValue(character, "gaze");
  if (gaze) push(fragments, lower(gaze));

  const makeup = selectionValue(character, "makeup");
  if (makeup) push(fragments, `${lower(makeup)} makeup`);

  const skinTone = selectionValue(character, "skin-tone");
  if (skinTone) push(fragments, `${lower(skinTone)} skin`);

  const freckles = selectionValue(character, "freckles");
  if (freckles && freckles !== "Off") push(fragments, `${lower(freckles)} freckles`);

  const build = selectionValue(character, "build");
  if (build) push(fragments, `${lower(build)} build`);

  const chestDescription = selectionValue(character, "chest-description");
  if (chestDescription) {
    const adjective = selectionValue(character, "chest-adjective");
    push(fragments, [adjective ? lower(adjective) : null, lower(chestDescription)].filter(Boolean).join(" "));
  }

  const hipWidth = selectionValue(character, "hip-width");
  if (hipWidth) push(fragments, `${lower(hipWidth)} hips`);

  const waist = selectionValue(character, "waist");
  if (waist) push(fragments, `${lower(waist)} waist`);

  for (const feature of selectionValue(character, "features") ?? []) push(fragments, lower(feature));

  return Object.freeze(fragments);
}
