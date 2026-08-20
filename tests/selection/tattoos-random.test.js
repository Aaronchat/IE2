import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";

test("Random Tattoos uses only areas exposed by selected Clothing and Generic designs", () => {
  const controls = {
    clothing: { primary: {
      mode: "manual",
      path: "built-outfit",
      structure: "top-bottom",
      outfit: {
        top: { mode: "manual", id: "fitted-long-sleeve-top", groupId: "long-sleeve-tops" },
        bottom: { mode: "none" },
      },
    } },
    tattoos: { mode: "random" },
  };
  const tattoos = selectGeneration({ controls, random: { rng: () => 0.999 } }).selections.tattoos;
  assert.equal(tattoos.mode, "random");
  assert.ok(tattoos.value.length > 0);
  assert.ok(tattoos.value.every((tattoo) => tattoo.design.mode === "generic"));
  assert.ok(tattoos.value.every((tattoo) => ["left-leg", "right-leg"].includes(tattoo.placement.id)));
});

test("Random Tattoos follows approved area-count and Large/Small rules", () => {
  const large = selectGeneration({ controls: { tattoos: { mode: "random" } }, random: { rng: () => 0 } }).selections.tattoos.value;
  assert.equal(large.length, 1);
  assert.equal(large[0].placement.id, "left-arm");
  assert.equal(large[0].pattern.id, "upper-large");
  assert.equal(large[0].design.mode, "generic");

  const allSmall = selectGeneration({ controls: { tattoos: { mode: "random" } }, random: { rng: () => 0.999 } }).selections.tattoos.value;
  assert.equal(allSmall.length, 30);
  assert.ok(allSmall.every((tattoo) => tattoo.pattern.sizePrompt === "small"));
  const areas = new Set(allSmall.map((tattoo) => `${tattoo.placement.id}:${tattoo.pattern.id}`));
  assert.equal(areas.size, 10);
});
