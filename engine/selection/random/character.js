import { CHARACTER_NAMES } from "../../../data/character/names.js";
import { CHARACTER_SKIN } from "../../../data/character/skin.js";
import { CHARACTER_HAIR } from "../../../data/character/hair.js";
import { CHARACTER_EYES } from "../../../data/character/eyes.js";
import { CHARACTER_EXPRESSION } from "../../../data/character/expression.js";
import { CHARACTER_MAKEUP } from "../../../data/character/makeup.js";
import { CHARACTER_PHYSICAL_APPEARANCE } from "../../../data/character/physical-appearance.js";

import { chooseBucket, chooseItem, weightedChoice } from "./core.js";

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function stringEntries(values) {
  return values.map((value) => Object.freeze({ id: slug(value), value }));
}

function chooseString(values, namespace, { rng, state }) {
  return chooseItem({
    items: stringEntries(values),
    rng,
    state,
    namespace,
    getId: (entry) => entry.id,
    lifetimeKey: (entry) => `${namespace}:${entry.id}`,
  }).value;
}

function chooseStringBucket(families, namespace, { rng, state }) {
  const buckets = Object.entries(families).map(([id, values]) =>
    Object.freeze({ id, values }),
  );

  const bucket = chooseBucket({
    buckets,
    rng,
    state,
    namespace: `${namespace}:bucket`,
    bucketCountForDecay: buckets.length,
  });

  return chooseString(bucket.values, namespace, { rng, state });
}

export const RANDOM_CHARACTER_CONTROLS = Object.freeze([
  "ethnicity",
  "name",
  "hair-color",
  "hair-style",
  "hair-length",
  "eye-color",
  "makeup",
  "build",
  "chest-adjective",
  "chest-description",
  "hip-width",
  "waist",
  "skin-tone",
  "freckles",
  "hair-texture",
  "expression",
  "gaze",
]);

export const RANDOM_ETHNICITY_EXCLUSIONS = Object.freeze(["Black"]);

export function selectRandomEthnicity({ rng, state }) {
  const excluded = new Set(RANDOM_ETHNICITY_EXCLUSIONS);
  const entries = CHARACTER_NAMES.ethnicities
    .filter((group) => !excluded.has(group.name))
    .map((group) => Object.freeze({ id: slug(group.name), value: group.name }));

  return chooseItem({
    items: entries,
    rng,
    state,
    namespace: "character:ethnicity",
    getId: (entry) => entry.id,
    lifetimeKey: (entry) => `character:ethnicity:${entry.id}`,
  }).value;
}

export function selectRandomName({ ethnicity, rng, state }) {
  const group = CHARACTER_NAMES.ethnicities.find((entry) => entry.name === ethnicity);
  if (!group) {
    throw new Error(`Unknown resolved Character ethnicity ${ethnicity}.`);
  }

  return chooseString(
    group.names,
    `character:name:${slug(ethnicity)}`,
    { rng, state },
  );
}

export function selectRandomHairColor({ rng, state }) {
  return chooseStringBucket(CHARACTER_HAIR.colors, "character:hair-color", { rng, state });
}

export function selectRandomHairStyle({ rng, state }) {
  return chooseStringBucket(CHARACTER_HAIR.styles, "character:hair-style", { rng, state });
}

export function selectRandomHairLength({ rng, state }) {
  return chooseString(CHARACTER_HAIR.lengths, "character:hair-length", { rng, state });
}

export function selectRandomEyeColor({ rng, state }) {
  return chooseString(CHARACTER_EYES.colors, "character:eye-color", { rng, state });
}

export function selectRandomMakeup({ rng, state }) {
  return chooseString(CHARACTER_MAKEUP.options, "character:makeup", { rng, state });
}

export function selectRandomBuild({ rng, state }) {
  return chooseString(CHARACTER_PHYSICAL_APPEARANCE.build, "character:build", { rng, state });
}

export function selectRandomChestDescription({ rng, state }) {
  return chooseString(
    CHARACTER_PHYSICAL_APPEARANCE.chest.descriptions,
    "character:chest-description",
    { rng, state },
  );
}

export function selectRandomHipWidth({ rng, state }) {
  return chooseString(CHARACTER_PHYSICAL_APPEARANCE.hipWidth, "character:hip-width", { rng, state });
}

export function selectRandomWaist({ rng, state }) {
  return chooseString(CHARACTER_PHYSICAL_APPEARANCE.waist, "character:waist", { rng, state });
}

export function selectRandomSkinTone({ rng, state }) {
  return chooseString(CHARACTER_SKIN.skinTones, "character:skin-tone", { rng, state });
}

export function selectRandomHairTexture({ rng, state }) {
  return chooseString(CHARACTER_HAIR.textures, "character:hair-texture", { rng, state });
}

export function selectRandomExpression({ rng, state }) {
  return chooseString(CHARACTER_EXPRESSION.expressions, "character:expression", { rng, state });
}

export function selectRandomGaze({ rng, state }) {
  return chooseString(CHARACTER_EXPRESSION.gaze, "character:gaze", { rng, state });
}

export function selectRandomFreckles({ rng, state }) {
  const presenceKey = "character:freckles-presence:freckles";
  const frecklesStrength = state.decay.getItemStrength(presenceKey);

  const presence = weightedChoice(
    [
      Object.freeze({ id: "off", weight: 85 }),
      Object.freeze({ id: "freckles", weight: 15 * (frecklesStrength / 100) }),
    ],
    { rng },
  );

  if (presence.id === "off") {
    state.lifetime.increment("character:freckles:off");
    return "Off";
  }

  state.decay.setItemDecay(presenceKey, 10, 5);
  state.lifetime.increment("character:freckles:present");

  return chooseString(
    CHARACTER_SKIN.freckles.filter((value) => value !== "Off"),
    "character:freckles",
    { rng, state },
  );
}

export function selectRandomChestAdjective({ rng, state, weights }) {
  if (!weights || typeof weights !== "object") {
    throw new Error(
      "Chest Adjective Random weights are not approved. Supply configured weights before selection.",
    );
  }

  const choices = [
    Object.freeze({ id: "no-adjective", value: null, weightKey: "noAdjective" }),
    ...CHARACTER_PHYSICAL_APPEARANCE.chest.optionalAdjectives.map((value) =>
      Object.freeze({ id: slug(value), value, weightKey: value }),
    ),
  ];

  for (const choice of choices) {
    const value = weights[choice.weightKey];
    if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
      throw new Error(`Missing or invalid Chest Adjective Random weight for ${choice.weightKey}.`);
    }
  }

  const selected = weightedChoice(choices, {
    rng,
    getWeight: (choice) => {
      const base = weights[choice.weightKey];
      if (choice.value === null) {
        return base;
      }
      const strength = state.decay.getItemStrength(`character:chest-adjective:${choice.id}`);
      return base * (strength / 100);
    },
  });

  if (selected.value === null) {
    state.lifetime.increment("character:chest-adjective:no-adjective");
    return null;
  }

  state.decay.setItemDecay(`character:chest-adjective:${selected.id}`, 25, 5);
  state.lifetime.increment(`character:chest-adjective:${selected.id}`);
  return selected.value;
}
