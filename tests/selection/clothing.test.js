import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";

test("manual Built Outfit and Package paths remain structurally distinct", () => {
  const built = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "built-outfit", structure: "top-bottom", outfit: { top: { groupId: "tank-tops", id: "fitted-tank-top" }, bottom: { groupId: "jeans", id: "skinny-jeans" } } } } } }).selections.clothing.primary.value;
  assert.equal(built.path, "built-outfit");
  assert.equal(built.builtOutfit.structure, "top-bottom");
  const pkg = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "package", id: "space-suit" } } } }).selections.clothing.primary.value;
  assert.equal(pkg.path, "package");
});

test("Clothing Random delegates to existing machinery with approved resolvers", () => {
  const result = selectGeneration({ controls: { clothing: { primary: { mode: "random" } } }, random: { seed: "clothing" } }).selections.clothing.primary;
  assert.equal(result.mode, "random");
  assert.ok(["built-outfit", "package"].includes(result.value.path));
});
test("Lingerie rejects Random and Hosiery uses approved eligibility resolver", () => {
  assert.throws(() => selectGeneration({ controls: { clothing: { lingerie: { mode: "random" } } }, random: { seed: 1 } }), /does not support/);
  const hosiery = selectGeneration({ controls: { clothing: { hosiery: { mode: "random" } } }, random: { seed: 1 } }).selections.clothing.hosiery;
  assert.equal(hosiery.mode, "random");
  assert.equal(hosiery.value, null);
});
