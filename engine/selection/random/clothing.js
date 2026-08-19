import { TANK_TOPS } from "../../../data/clothing/tops/tank-tops.js";
import { SHORT_SLEEVE_TOPS } from "../../../data/clothing/tops/short-sleeve-tops.js";
import { LONG_SLEEVE_TOPS } from "../../../data/clothing/tops/long-sleeve-tops.js";
import { BUTTON_UP_SHIRTS } from "../../../data/clothing/tops/button-up-shirts.js";
import { BLOUSES } from "../../../data/clothing/tops/blouses.js";
import { SWEATERS } from "../../../data/clothing/tops/sweaters.js";
import { SPORTS_ATHLETIC_TOPS } from "../../../data/clothing/tops/sports-athletic-tops.js";
import { SPECIALTY_STATEMENT_TOPS } from "../../../data/clothing/tops/specialty-statement-tops.js";
import { STRAPLESS_TOPS } from "../../../data/clothing/tops/strapless-tops.js";

import { JEANS } from "../../../data/clothing/bottoms/jeans.js";
import { CASUAL_PANTS } from "../../../data/clothing/bottoms/casual-pants.js";
import { ATHLETIC_PANTS } from "../../../data/clothing/bottoms/athletic-pants.js";
import { DRESS_PANTS } from "../../../data/clothing/bottoms/dress-pants.js";
import { CASUAL_SHORTS } from "../../../data/clothing/bottoms/casual-shorts.js";
import { ATHLETIC_SHORTS } from "../../../data/clothing/bottoms/athletic-shorts.js";
import { MINI_SKIRTS } from "../../../data/clothing/bottoms/mini-skirts.js";
import { LONG_SKIRTS } from "../../../data/clothing/bottoms/long-skirts.js";
import { SKORTS } from "../../../data/clothing/bottoms/skorts.js";

import { SUNDRESSES } from "../../../data/clothing/dresses/sundresses.js";
import { MINI_DRESSES } from "../../../data/clothing/dresses/mini-dresses.js";
import { MAXI_DRESSES } from "../../../data/clothing/dresses/maxi-dresses.js";
import { BODYCON_DRESSES } from "../../../data/clothing/dresses/bodycon-dresses.js";
import { EVENING_GOWNS } from "../../../data/clothing/dresses/evening-gowns.js";
import { BALL_GOWNS } from "../../../data/clothing/dresses/ball-gowns.js";
import { SWEATER_DRESSES } from "../../../data/clothing/dresses/sweater-dresses.js";
import { WEDDING_DRESSES } from "../../../data/clothing/dresses/wedding-dresses.js";

import { JUMPSUITS } from "../../../data/clothing/one-piece/jumpsuits.js";
import { ROMPERS_PLAYSUITS } from "../../../data/clothing/one-piece/rompers-playsuits.js";
import { COVERALLS_BOILERSUITS } from "../../../data/clothing/one-piece/coveralls-boilersuits.js";
import { OVERALLS } from "../../../data/clothing/one-piece/overalls.js";
import { BODYSUITS } from "../../../data/clothing/one-piece/bodysuits.js";
import { CATSUITS_UNITARDS } from "../../../data/clothing/one-piece/catsuits-unitards.js";

import { PAJAMA_SETS } from "../../../data/clothing/sleepwear/pajama-sets.js";
import { NIGHTGOWNS_SLEEP_SHIRTS } from "../../../data/clothing/sleepwear/nightgowns-sleep-shirts.js";
import { ROBES } from "../../../data/clothing/sleepwear/robes.js";
import { LOUNGEWEAR_SETS } from "../../../data/clothing/sleepwear/loungewear-sets.js";

import { BIKINI_TOPS } from "../../../data/clothing/swimwear/bikini-tops.js";
import { TWO_PIECE_SWIM_TOPS } from "../../../data/clothing/swimwear/two-piece-swim-tops.js";
import { BIKINI_BOTTOMS } from "../../../data/clothing/swimwear/bikini-bottoms.js";
import { TWO_PIECE_SWIM_BOTTOMS } from "../../../data/clothing/swimwear/two-piece-swim-bottoms.js";
import { ONE_PIECE_SWIMSUITS } from "../../../data/clothing/swimwear/one-piece-swimsuits.js";
import { SPECIALTY_SWIMWEAR } from "../../../data/clothing/swimwear/specialty-swimwear.js";

import { JACKETS } from "../../../data/clothing/outerwear/jackets.js";
import { BLAZERS } from "../../../data/clothing/outerwear/blazers.js";
import { COATS } from "../../../data/clothing/outerwear/coats.js";
import { VESTS } from "../../../data/clothing/outerwear/vests.js";
import { CAPES_WRAPS } from "../../../data/clothing/outerwear/capes-wraps.js";

import { TIGHTS_PANTYHOSE } from "../../../data/clothing/hosiery/tights-pantyhose.js";
import { STOCKINGS } from "../../../data/clothing/hosiery/stockings.js";
import { SOCKS_LEG_WARMERS } from "../../../data/clothing/hosiery/socks-leg-warmers.js";

import { chooseBucket, chooseRecordFromGroup, weightedChoice } from "./core.js";
import { selectRandomPackage } from "./packages.js";

export const TOP_RANDOM_BUCKETS = Object.freeze([
  TANK_TOPS,
  SHORT_SLEEVE_TOPS,
  LONG_SLEEVE_TOPS,
  BUTTON_UP_SHIRTS,
  BLOUSES,
  SWEATERS,
  SPORTS_ATHLETIC_TOPS,
  SPECIALTY_STATEMENT_TOPS,
  STRAPLESS_TOPS,
]);

export const BOTTOM_RANDOM_BUCKETS = Object.freeze([
  JEANS,
  CASUAL_PANTS,
  ATHLETIC_PANTS,
  DRESS_PANTS,
  CASUAL_SHORTS,
  ATHLETIC_SHORTS,
  MINI_SKIRTS,
  LONG_SKIRTS,
  SKORTS,
]);

export const DRESS_RANDOM_BUCKETS = Object.freeze([
  SUNDRESSES,
  MINI_DRESSES,
  MAXI_DRESSES,
  BODYCON_DRESSES,
  EVENING_GOWNS,
  BALL_GOWNS,
  SWEATER_DRESSES,
  WEDDING_DRESSES,
]);

export const ONE_PIECE_RANDOM_BUCKETS = Object.freeze([
  JUMPSUITS,
  ROMPERS_PLAYSUITS,
  COVERALLS_BOILERSUITS,
  OVERALLS,
  BODYSUITS,
  CATSUITS_UNITARDS,
]);

export const SLEEPWEAR_RANDOM_BUCKETS = Object.freeze([
  PAJAMA_SETS,
  NIGHTGOWNS_SLEEP_SHIRTS,
  ROBES,
  LOUNGEWEAR_SETS,
]);

export const SWIMWEAR_CATALOG_GROUPS = Object.freeze([
  BIKINI_TOPS,
  TWO_PIECE_SWIM_TOPS,
  BIKINI_BOTTOMS,
  TWO_PIECE_SWIM_BOTTOMS,
  ONE_PIECE_SWIMSUITS,
  SPECIALTY_SWIMWEAR,
]);

export const OUTERWEAR_RANDOM_BUCKETS = Object.freeze([
  JACKETS,
  BLAZERS,
  COATS,
  VESTS,
  CAPES_WRAPS,
]);

export const HOSIERY_CATALOG_GROUPS = Object.freeze([
  TIGHTS_PANTYHOSE,
  STOCKINGS,
  SOCKS_LEG_WARMERS,
]);

export const CLOTHING_PATH_POLICY = Object.freeze([
  Object.freeze({
    id: "built-outfit",
    baseWeight: 75,
    selectedStrength: 90,
    recovery: 5,
  }),
  Object.freeze({
    id: "package",
    baseWeight: 25,
    selectedStrength: 25,
    recovery: 5,
  }),
]);

export const BUILT_OUTFIT_STRUCTURES = Object.freeze([
  Object.freeze({ id: "top-bottom" }),
  Object.freeze({ id: "dress" }),
  Object.freeze({ id: "one-piece" }),
  Object.freeze({ id: "swimwear" }),
  Object.freeze({ id: "sleepwear" }),
]);

export const OUTERWEAR_ACTIVATION_WEIGHTS = Object.freeze([
  Object.freeze({ id: "none", weight: 85 }),
  Object.freeze({ id: "outerwear", weight: 15 }),
]);

export function selectRandomGarmentFromGroups({
  groups,
  rng,
  state,
  bucketNamespace,
}) {
  if (!Array.isArray(groups) || groups.length === 0) {
    throw new Error(`${bucketNamespace}: no eligible Clothing groups.`);
  }

  const bucket = chooseBucket({
    buckets: groups,
    rng,
    state,
    namespace: bucketNamespace,
    bucketCountForDecay: groups.length,
  });

  return chooseRecordFromGroup({
    group: bucket,
    rng,
    state,
    namespace: "clothing",
    itemNamespace: "clothing",
  });
}

export function selectRandomClothingPath({ rng, state }) {
  return chooseBucket({
    buckets: CLOTHING_PATH_POLICY,
    rng,
    state,
    namespace: "clothing:path",
    baseWeight: (entry) => entry.baseWeight,
    selectedStrength: (entry) => entry.selectedStrength,
    recovery: (entry) => entry.recovery,
  }).id;
}

export function selectRandomBuiltOutfitStructure({ rng, state }) {
  return chooseBucket({
    buckets: BUILT_OUTFIT_STRUCTURES,
    rng,
    state,
    namespace: "clothing:structure",
    bucketCountForDecay: BUILT_OUTFIT_STRUCTURES.length,
    selectedStrength: 25,
    recovery: 25,
    lifetimeKey: (entry) => `clothing:structure:${entry.id}`,
  }).id;
}

export function selectRandomTopBottom({ rng, state }) {
  return Object.freeze({
    top: selectRandomGarmentFromGroups({
      groups: TOP_RANDOM_BUCKETS,
      rng,
      state,
      bucketNamespace: "clothing:tops:bucket",
    }),
    bottom: selectRandomGarmentFromGroups({
      groups: BOTTOM_RANDOM_BUCKETS,
      rng,
      state,
      bucketNamespace: "clothing:bottoms:bucket",
    }),
  });
}

export function selectRandomDress({ rng, state }) {
  return selectRandomGarmentFromGroups({
    groups: DRESS_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "clothing:dresses:bucket",
  });
}

export function selectRandomOnePiece({ rng, state }) {
  return selectRandomGarmentFromGroups({
    groups: ONE_PIECE_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "clothing:one-piece:bucket",
  });
}

export function selectRandomSleepwear({ rng, state }) {
  return selectRandomGarmentFromGroups({
    groups: SLEEPWEAR_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "clothing:sleepwear:bucket",
  });
}

export function selectRandomSwimwear({ rng, state, swimwearResolver }) {
  if (typeof swimwearResolver !== "function") {
    throw new Error(
      "Swimwear Random requires a Clothing-owned swimwearResolver; assembly rules are not defined by Random.",
    );
  }

  return swimwearResolver({
    rng,
    state,
    catalogGroups: SWIMWEAR_CATALOG_GROUPS,
    selectRandomGarmentFromGroups,
  });
}

export function selectRandomBuiltOutfit({ rng, state, swimwearResolver }) {
  const structure = selectRandomBuiltOutfitStructure({ rng, state });

  switch (structure) {
    case "top-bottom":
      return Object.freeze({
        structure,
        outfit: selectRandomTopBottom({ rng, state }),
      });
    case "dress":
      return Object.freeze({
        structure,
        outfit: selectRandomDress({ rng, state }),
      });
    case "one-piece":
      return Object.freeze({
        structure,
        outfit: selectRandomOnePiece({ rng, state }),
      });
    case "swimwear":
      return Object.freeze({
        structure,
        outfit: selectRandomSwimwear({ rng, state, swimwearResolver }),
      });
    case "sleepwear":
      return Object.freeze({
        structure,
        outfit: selectRandomSleepwear({ rng, state }),
      });
    default:
      throw new Error(`Unknown Built Outfit structure ${structure}.`);
  }
}

export function selectRandomPrimaryClothing({ rng, state, swimwearResolver }) {
  const path = selectRandomClothingPath({ rng, state });

  if (path === "package") {
    return Object.freeze({
      path,
      package: selectRandomPackage({ rng, state }),
    });
  }

  return Object.freeze({
    path,
    builtOutfit: selectRandomBuiltOutfit({ rng, state, swimwearResolver }),
  });
}

export function selectRandomOuterwear({ rng, state }) {
  const activation = weightedChoice(OUTERWEAR_ACTIVATION_WEIGHTS, {
    rng,
    getWeight: (entry) => entry.weight,
  });

  if (activation.id === "none") {
    return null;
  }

  return selectRandomGarmentFromGroups({
    groups: OUTERWEAR_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "clothing:outerwear:bucket",
  });
}

export function selectRandomHosiery({
  outfit,
  rng,
  state,
  hosieryEligibilityResolver,
}) {
  if (typeof hosieryEligibilityResolver !== "function") {
    throw new Error(
      "Hosiery Random requires a Clothing-owned hosieryEligibilityResolver; compatibility is not defined by Random.",
    );
  }

  const eligibleGroups = hosieryEligibilityResolver({
    outfit,
    catalogGroups: HOSIERY_CATALOG_GROUPS,
  });

  if (!Array.isArray(eligibleGroups)) {
    throw new Error("hosieryEligibilityResolver must return an array of eligible Hosiery groups.");
  }

  if (eligibleGroups.length === 0) {
    return null;
  }

  return selectRandomGarmentFromGroups({
    groups: eligibleGroups,
    rng,
    state,
    bucketNamespace: "clothing:hosiery:bucket",
  });
}
