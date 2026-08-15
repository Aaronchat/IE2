import { CHARACTER_NAMES } from "../../data/character/names.js";
import { CHARACTER_SKIN } from "../../data/character/skin.js";
import { CHARACTER_HAIR } from "../../data/character/hair.js";
import { CHARACTER_EYES } from "../../data/character/eyes.js";
import { CHARACTER_EXPRESSION } from "../../data/character/expression.js";
import { CHARACTER_MAKEUP } from "../../data/character/makeup.js";
import { CHARACTER_PHYSICAL_APPEARANCE } from "../../data/character/physical-appearance.js";
import { CHARACTER_FEATURES } from "../../data/character/character-features.js";
import * as random from "./random/character.js";
import { assertMode, enforceMax, result } from "./controls.js";

const VALUES = Object.freeze({
  "hair-color": Object.values(CHARACTER_HAIR.colors).flat(),
  "hair-style": Object.values(CHARACTER_HAIR.styles).flat(),
  "hair-length": CHARACTER_HAIR.lengths,
  "eye-color": CHARACTER_EYES.colors,
  makeup: CHARACTER_MAKEUP.options,
  build: CHARACTER_PHYSICAL_APPEARANCE.build,
  "chest-adjective": [null, ...CHARACTER_PHYSICAL_APPEARANCE.chest.optionalAdjectives],
  "chest-description": CHARACTER_PHYSICAL_APPEARANCE.chest.descriptions,
  "hip-width": CHARACTER_PHYSICAL_APPEARANCE.hipWidth,
  waist: CHARACTER_PHYSICAL_APPEARANCE.waist,
  "skin-tone": CHARACTER_SKIN.skinTones,
  freckles: CHARACTER_SKIN.freckles,
  "hair-texture": CHARACTER_HAIR.textures,
  expression: CHARACTER_EXPRESSION.expressions,
  gaze: CHARACTER_EXPRESSION.gaze,
});
const RANDOM = Object.freeze({
  "hair-color": random.selectRandomHairColor, "hair-style": random.selectRandomHairStyle,
  "hair-length": random.selectRandomHairLength, "eye-color": random.selectRandomEyeColor,
  makeup: random.selectRandomMakeup, build: random.selectRandomBuild,
  "chest-description": random.selectRandomChestDescription, "hip-width": random.selectRandomHipWidth,
  waist: random.selectRandomWaist, "skin-tone": random.selectRandomSkinTone,
  freckles: random.selectRandomFreckles, "hair-texture": random.selectRandomHairTexture,
  expression: random.selectRandomExpression, gaze: random.selectRandomGaze,
});

function manualValue(control, values, label) {
  if (!values.includes(control.value)) throw new Error(`Unknown Character ${label} value ${control.value}.`);
  return result("manual", control.value);
}

export function selectCharacter(controls = {}, context) {
  const out = {};
  const ethnicityControl = controls.ethnicity ?? { mode: "default" };
  assertMode(ethnicityControl, ["manual", "default", "random"], "Character ethnicity");
  let ethnicity;
  if (ethnicityControl.mode === "default") ethnicity = CHARACTER_NAMES.defaultEthnicity;
  else if (ethnicityControl.mode === "random") ethnicity = random.selectRandomEthnicity(context);
  else {
    ethnicity = ethnicityControl.value;
    if (!CHARACTER_NAMES.ethnicities.some((entry) => entry.name === ethnicity)) throw new Error(`Unknown Character ethnicity ${ethnicity}.`);
  }
  out.ethnicity = result(ethnicityControl.mode, ethnicity);

  if (controls.name) {
    assertMode(controls.name, ["manual", "random"], "Character name");
    const names = CHARACTER_NAMES.ethnicities.find((entry) => entry.name === ethnicity).names;
    const value = controls.name.mode === "random"
      ? random.selectRandomName({ ...context, ethnicity })
      : controls.name.value;
    if (!names.includes(value)) throw new Error(`Character name ${value} is not valid for ethnicity ${ethnicity}.`);
    out.name = result(controls.name.mode, value);
  }

  for (const [key, values] of Object.entries(VALUES)) {
    const control = controls[key];
    if (!control) continue;
    assertMode(control, ["manual", "random"], `Character ${key}`);
    if (control.mode === "manual") out[key] = manualValue(control, values, key);
    else if (key === "chest-adjective") out[key] = result("random", random.selectRandomChestAdjective({ ...context, weights: context.chestAdjectiveWeights }));
    else out[key] = result("random", RANDOM[key](context));
  }

  if (controls.features) {
    assertMode(controls.features, ["manual"], "Character features");
    enforceMax(controls.features.values, 2, "Character features");
    for (const value of controls.features.values) if (!CHARACTER_FEATURES.options.includes(value)) throw new Error(`Unknown Character feature ${value}.`);
    out.features = result("manual", Object.freeze([...controls.features.values]));
  }
  return Object.freeze(out);
}
