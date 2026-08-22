import { EYEWEAR } from "../../../data/accessories/eyewear.js";
import { EARRINGS } from "../../../data/accessories/earrings.js";
import { CHOKERS } from "../../../data/accessories/chokers.js";
import { NECKLACES } from "../../../data/accessories/necklaces.js";
import { HEADWEAR } from "../../../data/accessories/headwear.js";
import { HAIR_ACCESSORIES } from "../../../data/accessories/hair-accessories.js";
import { SCARVES_WRAPS } from "../../../data/accessories/scarves-wraps.js";
import { BRACELETS_WATCHES } from "../../../data/accessories/bracelets-watches.js";
import { RINGS } from "../../../data/accessories/rings.js";
import { ANKLETS } from "../../../data/accessories/anklets.js";
import { BODY_CHAINS_HARNESSES } from "../../../data/accessories/body-chains-harnesses.js";
import { BAGS } from "../../../data/accessories/bags.js";
import { BELTS } from "../../../data/accessories/belts.js";
import { GLOVES } from "../../../data/accessories/gloves.js";

import { chooseBucket, chooseRecordFromGroup, weightedChoice } from "./core.js";

export const ACCESSORY_RANDOM_BUCKETS = Object.freeze([
  EYEWEAR,
  EARRINGS,
  CHOKERS,
  NECKLACES,
  HEADWEAR,
  HAIR_ACCESSORIES,
  SCARVES_WRAPS,
  BRACELETS_WATCHES,
  RINGS,
  ANKLETS,
  BODY_CHAINS_HARNESSES,
  BAGS,
  BELTS,
  GLOVES,
]);

export const ACCESSORY_COUNT_WEIGHTS = Object.freeze([
  Object.freeze({ count: 0, weight: 25 }),
  Object.freeze({ count: 1, weight: 50 }),
  Object.freeze({ count: 2, weight: 25 }),
]);

export function selectRandomAccessories({ rng, state }) {
  const count = weightedChoice(ACCESSORY_COUNT_WEIGHTS, {
    rng,
    getWeight: (entry) => entry.weight,
  }).count;

  const selections = [];
  const selectedBucketIds = new Set();

  for (let index = 0; index < count; index += 1) {
    const eligibleBuckets = ACCESSORY_RANDOM_BUCKETS.filter(
      (group) => !selectedBucketIds.has(group.id),
    );

    const bucket = chooseBucket({
      buckets: eligibleBuckets,
      rng,
      state,
      namespace: "accessories:bucket",
      bucketCountForDecay: ACCESSORY_RANDOM_BUCKETS.length,
    });
    selectedBucketIds.add(bucket.id);

    const record = chooseRecordFromGroup({
      group: bucket,
      rng,
      state,
      namespace: "accessory",
      itemNamespace: "accessory",
    });

    selections.push(Object.freeze({ category: bucket.id, record }));
  }

  return Object.freeze(selections);
}
