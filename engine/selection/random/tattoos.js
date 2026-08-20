import { TATTOO_GENERIC_STYLES, TATTOO_PLACEMENTS } from "../../../data/tattoos/config.js";
import { resolveCoverage } from "../../resolution/coverage.js";
import { chooseItem, weightedChoice } from "./core.js";

const area = (id, placementId, smallPatternId, largePatternId) => Object.freeze({ id, placementId, smallPatternId, largePatternId });

export const RANDOM_TATTOO_AREAS = Object.freeze([
  area("upper-left-arm", "left-arm", "upper-small", "upper-large"),
  area("upper-right-arm", "right-arm", "upper-small", "upper-large"),
  area("lower-left-arm", "left-arm", "lower-small", "lower-large"),
  area("lower-right-arm", "right-arm", "lower-small", "lower-large"),
  area("upper-abdomen", "abdomen", "upper-small", "upper-large"),
  area("lower-abdomen", "abdomen", "lower-small", "lower-large"),
  area("upper-left-leg", "left-leg", "upper-small", "upper-large"),
  area("upper-right-leg", "right-leg", "upper-small", "upper-large"),
  area("lower-left-leg", "left-leg", "lower-small", "lower-large"),
  area("lower-right-leg", "right-leg", "lower-small", "lower-large"),
]);

function placement(id) {
  return TATTOO_PLACEMENTS.find((entry) => entry.id === id);
}

function pattern(areaRecord, size) {
  const owner = placement(areaRecord.placementId);
  const id = size === "large" ? areaRecord.largePatternId : areaRecord.smallPatternId;
  return owner.patterns.find((entry) => entry.id === id);
}

function visible(patternRecord, tattooVisibility) {
  return patternRecord.requiredRegions.every((required) => tattooVisibility.some((entry) =>
    entry.region === required.region && (required.side == null || entry.side === required.side) && entry.allowed === true,
  ));
}

function equalChoice(values, rng) {
  return weightedChoice(values.map((value) => ({ value, weight: 1 })), { rng }).value;
}

function chooseAreaCount(eligibleCount, rng) {
  if (eligibleCount <= 0) return 0;
  if (eligibleCount === 1) return 1;
  if (eligibleCount === 2) return equalChoice([1, 2], rng);
  if (eligibleCount === 3) return equalChoice([1, 2, 3], rng);
  return equalChoice([1, 2, 3, eligibleCount], rng);
}

function chooseAreas(eligible, count, rng) {
  const pool = [...eligible];
  const chosen = [];
  while (chosen.length < count) {
    const picked = equalChoice(pool, rng);
    chosen.push(picked);
    pool.splice(pool.indexOf(picked), 1);
  }
  return chosen;
}

function randomStyle(rng, state) {
  return chooseItem({
    items: TATTOO_GENERIC_STYLES,
    rng,
    state,
    namespace: "tattoos:generic-style",
    getId: (style) => style.id,
    getBaseWeight: () => 1,
    isEnabled: () => true,
    lifetimeKey: (style) => `tattoos:generic-style:${style.id}`,
  });
}

export function selectRandomTattoos({ rng, state, clothing }) {
  const tattooVisibility = resolveCoverage({ clothing }).tattooVisibility;
  const eligible = RANDOM_TATTOO_AREAS.filter((candidate) => visible(pattern(candidate, "small"), tattooVisibility));
  const chosenAreas = chooseAreas(eligible, chooseAreaCount(eligible.length, rng), rng);
  const tattoos = [];

  for (const candidate of chosenAreas) {
    const size = equalChoice(["large", "small"], rng);
    const count = size === "large" ? 1 : equalChoice([1, 2, 3], rng);
    const owner = placement(candidate.placementId);
    const patternRecord = pattern(candidate, size);
    for (let index = 0; index < count; index += 1) {
      tattoos.push(Object.freeze({
        placement: owner,
        pattern: patternRecord,
        design: Object.freeze({ mode: "generic", style: randomStyle(rng, state) }),
      }));
    }
  }

  return Object.freeze(tattoos);
}
