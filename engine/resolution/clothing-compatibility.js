import { DRESS_RANDOM_BUCKETS, BOTTOM_RANDOM_BUCKETS } from "../selection/random/clothing.js";

const HOSIERY_ELIGIBLE_BOTTOM_GROUP_IDS = new Set(["mini-skirts", "long-skirts", "skorts"]);

function groupForRecord(groups, record) {
  return groups.find((group) => group.items.includes(record));
}

function effectiveSlot(group, record) {
  return record.slot ?? group?.defaults?.slot ?? null;
}

export function resolveRandomSwimwear({ rng, state, catalogGroups, selectRandomGarmentFromGroups }) {
  const first = selectRandomGarmentFromGroups({
    groups: catalogGroups,
    rng,
    state,
    bucketNamespace: "clothing:swimwear:bucket",
  });
  const firstGroup = groupForRecord(catalogGroups, first);
  const slot = effectiveSlot(firstGroup, first);
  if (slot === "one-piece") return Object.freeze([first]);
  if (slot !== "top" && slot !== "bottom") throw new Error(`Swimwear ${first.id} has no approved assembly slot.`);

  const neededSlot = slot === "top" ? "bottom" : "top";
  const compatibleGroups = catalogGroups.flatMap((group) => {
    const items = group.items.filter((record) => effectiveSlot(group, record) === neededSlot);
    if (items.length === 0) return [];
    if (items.length === group.items.length) return [group];
    return [Object.freeze({ ...group, items: Object.freeze(items) })];
  });
  const second = selectRandomGarmentFromGroups({
    groups: compatibleGroups,
    rng,
    state,
    bucketNamespace: `clothing:swimwear:${neededSlot}:bucket`,
  });
  return Object.freeze(slot === "top" ? [first, second] : [second, first]);
}

export function resolveRandomHosieryEligibility({ outfit, catalogGroups }) {
  if (!outfit || outfit.path !== "built-outfit") return Object.freeze([]);
  const built = outfit.builtOutfit;
  if (!built) return Object.freeze([]);
  if (built.structure === "dress") {
    const group = groupForRecord(DRESS_RANDOM_BUCKETS, built.outfit);
    return group ? catalogGroups : Object.freeze([]);
  }
  if (built.structure === "top-bottom") {
    const group = groupForRecord(BOTTOM_RANDOM_BUCKETS, built.outfit?.bottom);
    return group && HOSIERY_ELIGIBLE_BOTTOM_GROUP_IDS.has(group.id) ? catalogGroups : Object.freeze([]);
  }
  return Object.freeze([]);
}
