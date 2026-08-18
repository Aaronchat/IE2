import { resolveRandomSwimwear, resolveRandomHosieryEligibility } from "../resolution/clothing-compatibility.js";
import { createSeededRng } from "./random/rng.js";
import { RandomRuntimeState } from "./random/state.js";
import { selectCharacter } from "./character.js";
import { selectClothing } from "./clothing.js";
import { selectFootwear, selectAccessories, selectLocation, selectAtmosphere, selectTimeOfDay, selectCamera, selectEffects, selectThemes, selectCovers, selectTattoos } from "./domains.js";

function randomContext(random = {}) {
  const rng = random.rng ?? (Object.hasOwn(random, "seed") ? createSeededRng(random.seed) : null);
  const state = random.state ?? new RandomRuntimeState();
  return Object.freeze({ rng, state, chestAdjectiveWeights: random.chestAdjectiveWeights, swimwearResolver: random.swimwearResolver ?? resolveRandomSwimwear, hosieryEligibilityResolver: random.hosieryEligibilityResolver ?? resolveRandomHosieryEligibility });
}
function needsRandom(value) {
  if (!value || typeof value !== "object") return false;
  if (value.mode === "random") return true;
  return Object.values(value).some(needsRandom);
}
export function selectGeneration({ controls = {}, random = {} } = {}) {
  if (needsRandom(controls) && !random.rng && !Object.hasOwn(random, "seed")) throw new Error("Random selection requires an explicit seed or rng.");
  const context = randomContext(random);
  const result = {};
  result.character = selectCharacter(controls.character, context);
  const tattoos = selectTattoos(controls.tattoos); if (tattoos) result.tattoos = tattoos;
  result.clothing = selectClothing(controls.clothing, context);
  const footwear = selectFootwear(controls.footwear, context); if (footwear) result.footwear = footwear;
  const accessories = selectAccessories(controls.accessories, context); if (accessories) result.accessories = accessories;
  const location = selectLocation(controls.location, context); if (location) result.location = location;
  const atmosphere = selectAtmosphere(controls.atmosphere, context, location?.value ?? null); if (atmosphere) result.atmosphere = atmosphere;
  const timeOfDay = selectTimeOfDay(controls.timeOfDay, context); if (timeOfDay) result.timeOfDay = timeOfDay;
  result.camera = selectCamera(controls.camera);
  result.effects = selectEffects(controls.effects);
  const themes = selectThemes(controls.themes, context); if (themes) result.themes = themes;
  const covers = selectCovers(controls.covers, context); if (covers) result.covers = covers;
  return Object.freeze({ selections: Object.freeze(result), randomState: context.state });
}

export { RandomRuntimeState } from "./random/state.js";
export { createSeededRng } from "./random/rng.js";
