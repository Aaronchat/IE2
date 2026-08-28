import { CHARACTER_SKIN } from "../../../data/character/skin.js";
import { CHARACTER_FEATURES } from "../../../data/character/character-features.js";
import { chooseItem } from "./core.js";
import { RANDOM_CHARACTER_CONTROLS as BASE_RANDOM_CHARACTER_CONTROLS } from "./character.js";

export * from "./character.js";

function slug(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function chooseString(values, namespace, { rng, state }) {
  const entries = values.map((value) => Object.freeze({ id: slug(value), value }));
  return chooseItem({
    items: entries,
    rng,
    state,
    namespace,
    getId: (entry) => entry.id,
    lifetimeKey: (entry) => `${namespace}:${entry.id}`,
  }).value;
}

export const RANDOM_CHARACTER_CONTROLS = Object.freeze([
  ...BASE_RANDOM_CHARACTER_CONTROLS,
  "skin-condition",
  "features",
]);

export function selectRandomSkinCondition({ rng, state }) {
  return chooseString(CHARACTER_SKIN.conditions, "character:skin-condition", { rng, state });
}

export function selectRandomFeature({ rng, state }) {
  return chooseString(CHARACTER_FEATURES.options, "character:feature", { rng, state });
}
