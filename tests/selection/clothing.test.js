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

test("Top/Bottom permits one explicit None slot and preserves its omission mode", () => {
  const result = selectGeneration({ controls: { clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { mode: "none" }, bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" } },
  } } } }).selections.clothing.primary.value.builtOutfit;
  assert.equal(result.outfit.top, null);
  assert.equal(result.outfit.bottom.id, "skinny-jeans");
  assert.deepEqual(result.slotModes, { top: "none", bottom: "manual" });
});

test("manual top-bottom accepts a Swimwear top with a normal Bottom by slot", () => {
  const result = selectGeneration({ controls: { clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: {
      top: { mode: "manual", id: "string-bikini-top", groupId: "bikini-tops" },
      bottom: { mode: "manual", id: "denim-mini-skirt", groupId: "mini-skirts" },
    },
  } } } }).selections.clothing.primary.value.builtOutfit;
  assert.equal(result.outfit.top.id, "string-bikini-top");
  assert.equal(result.outfit.bottom.id, "denim-mini-skirt");
});

test("top-bottom rejects a one-piece Swimwear record in a slot", () => {
  assert.throws(() => selectGeneration({ controls: { clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { mode: "manual", id: "monokini", groupId: "one-piece-swimsuits" }, bottom: { mode: "none" } },
  } } } }), /does not occupy the top slot/);
});

test("section-level Random can select a Top without inventing a Bottom", () => {
  const result = selectGeneration({ controls: { clothing: { primary: {
    mode: "manual", path: "built-outfit", structure: "top-bottom",
    outfit: { top: { mode: "random" }, bottom: { mode: "none" } },
  } } }, random: { seed: 91 } }).selections.clothing.primary.value.builtOutfit;
  assert.ok(result.outfit.top);
  assert.equal(result.outfit.bottom, null);
  assert.deepEqual(result.slotModes, { top: "random", bottom: "none" });
});


test("approved Wedding Dresses and Diner Waitress Package are selectable", () => {
  const wedding = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "built-outfit", structure: "dress", outfit: { mode: "manual", id: "traditional-wedding-dress", groupId: "wedding-dresses" } } } } }).selections.clothing.primary.value;
  assert.equal(wedding.builtOutfit.outfit.prompt, "traditional wedding dress");
  const diner = selectGeneration({ controls: { clothing: { primary: { mode: "manual", path: "package", id: "diner-waitress-outfit", groupId: "occupations" } } } }).selections.clothing.primary.value;
  assert.equal(diner.package.prompt, "diner waitress outfit");
});
