import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";

test("Random Cover Type resolves a concrete type and only its contextual Style", () => {
  const covers = selectGeneration({ controls: { covers: { type: { mode: "random" } } }, random: { rng: () => 0 } }).selections.covers;
  assert.equal(covers.mode, "random");
  assert.equal(covers.value.type.value.id, "novel");
  assert.equal(covers.value.style.value.id, "romance");
  assert.equal(covers.value.style.mode, "random");
});

test("Random Covers choices are reproducible with the same seed", () => {
  const input = { controls: { covers: { type: { mode: "random" }, era: { mode: "random" } } }, random: { seed: "covers" } };
  const first = selectGeneration(input).selections.covers;
  const second = selectGeneration(input).selections.covers;
  assert.deepEqual(first, second);
  assert.notEqual(first.value.type.value.id, "random");
  assert.notEqual(first.value.era.value.id, "random");
});

test("Movie Poster Random remains type-only because no Styles are approved", () => {
  let calls = 0;
  const rng = () => { calls += 1; return calls === 1 ? 0.7 : 0; };
  const covers = selectGeneration({ controls: { covers: { type: { mode: "random" } } }, random: { rng } }).selections.covers;
  assert.equal(covers.value.type.value.id, "movie-poster");
  assert.equal(covers.value.style, undefined);
});

test("explicit Cover Type Random Style stays inside its contextual group", () => {
  const covers = selectGeneration({ controls: { covers: {
    type: { mode: "manual", id: "magazine" },
    style: { mode: "random" },
  } }, random: { rng: () => 0 } }).selections.covers;
  assert.equal(covers.value.style.value.id, "mens-magazine");
});
