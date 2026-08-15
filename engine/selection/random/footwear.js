import { SNEAKERS_ATHLETIC_SHOES } from "../../../data/footwear/sneakers-athletic-shoes.js";
import { BOOTS } from "../../../data/footwear/boots.js";
import { FLATS_CLASSIC_SHOES } from "../../../data/footwear/flats-classic-shoes.js";
import { HEELS } from "../../../data/footwear/heels.js";
import { SANDALS_CASUAL_SHOES } from "../../../data/footwear/sandals-casual-shoes.js";
import { GOTHIC_ALTERNATIVE_FOOTWEAR } from "../../../data/footwear/gothic-alternative-footwear.js";

import { chooseRecordFromEqualBuckets } from "./core.js";

export const FOOTWEAR_RANDOM_BUCKETS = Object.freeze([
  SNEAKERS_ATHLETIC_SHOES,
  BOOTS,
  FLATS_CLASSIC_SHOES,
  HEELS,
  SANDALS_CASUAL_SHOES,
  GOTHIC_ALTERNATIVE_FOOTWEAR,
]);

export function selectRandomFootwear({ rng, state }) {
  return chooseRecordFromEqualBuckets({
    groups: FOOTWEAR_RANDOM_BUCKETS,
    rng,
    state,
    bucketNamespace: "footwear:bucket",
    itemNamespace: "footwear",
    bucketCountForDecay: FOOTWEAR_RANDOM_BUCKETS.length,
  }).record;
}
