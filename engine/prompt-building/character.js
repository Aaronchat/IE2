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

export function buildCharacterFragments(character = {}) {
  if (!character || typeof character !== "object" || Array.isArray(character)) {
    throw new Error("Prompt Building requires Character selections to be an object.");
  }

  const fragments = [];

  push(fragments, clean(selectionValue(character, "name")));
  push(fragments, clean(selectionValue(character, "ethnicity")));

  const hairLength = selectionValue(character, "hair-length");
  const isBald = lower(hairLength) === "bald";
  if (hairLength) push(fragments, `${lower(hairLength)} hair`);

  if (!isBald) {
    const hairColor = selectionValue(character, "hair-color");
    if (hairColor) push(fragments, `${lower(hairColor)} hair`);

    const hairTexture = selectionValue(character, "hair-texture");
    if (hairTexture) push(fragments, `${lower(hairTexture)} hair texture`);

    const hairStyle = selectionValue(character, "hair-style");
    if (hairStyle) push(fragments, `${lower(hairStyle).replace(/ \(generic\)$/u, "")} hairstyle`);
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
