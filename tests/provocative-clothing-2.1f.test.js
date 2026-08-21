import test from "node:test";
import assert from "node:assert/strict";
import { allUiControls } from "../app/ui-data.js";
import { uiStateToGenerationControls } from "../app/generation-adapter.js";
import { selectGeneration } from "../engine/selection/index.js";
import { resolveGeneration } from "../engine/resolution/index.js";
import { buildPrompt } from "../engine/prompt-building/index.js";

function promptForClothing(clothing) {
  const selection = selectGeneration({ controls: { clothing } });
  return buildPrompt(resolveGeneration(selection)).sections.clothing;
}

test("2.1F exposes Provocative as an off-by-default Clothing toggle", () => {
  const provocative = allUiControls().find((control) => control.id === "clothing.provocative");
  assert.ok(provocative);
  assert.equal(provocative.label, "Provocative");
  assert.equal(provocative.toggle, true);
  assert.equal(provocative.defaultMode, "none");
  assert.equal(provocative.random, false);
});

test("Provocative off preserves normal top and bottom prompt fragments", () => {
  assert.deepEqual(promptForClothing({
    primary: {
      mode: "manual",
      path: "built-outfit",
      structure: "top-bottom",
      outfit: {
        top: { mode: "manual", id: "fitted-tank-top", groupId: "tank-tops" },
        bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" },
      },
    },
  }), ["fitted tank top", "skinny jeans"]);
});

test("Provocative combines top and bottom into one coherent outfit phrase", () => {
  assert.deepEqual(promptForClothing({
    provocative: true,
    primary: {
      mode: "manual",
      path: "built-outfit",
      structure: "top-bottom",
      outfit: {
        top: { mode: "manual", id: "fitted-tank-top", groupId: "tank-tops" },
        bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" },
      },
    },
  }), ["provocative fitted tank top and skinny jeans outfit"]);
});

test("Provocative prefixes a Package exactly once", () => {
  const normal = promptForClothing({
    primary: { mode: "manual", path: "package", selection: { mode: "manual", id: "basketball-uniform", groupId: "athletic" } },
  });
  const provocative = promptForClothing({
    provocative: true,
    primary: { mode: "manual", path: "package", selection: { mode: "manual", id: "basketball-uniform", groupId: "athletic" } },
  });
  assert.equal(normal.length, 1);
  assert.deepEqual(provocative, [`provocative ${normal[0]}`]);
  assert.equal((provocative[0].match(/provocative/gu) ?? []).length, 1);
});

test("Provocative does not modify Outerwear, Hosiery, or Lingerie", () => {
  const sections = promptForClothing({
    provocative: true,
    primary: {
      mode: "manual",
      path: "built-outfit",
      structure: "top-bottom",
      outfit: {
        top: { mode: "manual", id: "fitted-tank-top", groupId: "tank-tops" },
        bottom: { mode: "manual", id: "skinny-jeans", groupId: "jeans" },
      },
    },
    outerwear: { mode: "manual", id: "fitted-leather-jacket", groupId: "jackets" },
  });
  assert.equal(sections[0], "provocative fitted tank top and skinny jeans outfit");
  assert.equal(sections[1], "fitted leather jacket");
});

test("UI adapter carries Provocative alongside a manual built outfit", () => {
  const ui = {
    clothing: {
      "clothing.primary-random": { mode: "unselected", value: null },
      "clothing.provocative": { mode: "manual", value: "on" },
      "clothing.tops.tank-tops.selection": { mode: "manual", value: { value: "fitted-tank-top", groupId: "tank-tops" } },
      "clothing.bottoms.jeans.selection": { mode: "manual", value: { value: "skinny-jeans", groupId: "jeans" } },
    },
  };
  const controls = uiStateToGenerationControls(ui);
  assert.equal(controls.clothing.provocative, true);
  assert.equal(controls.clothing.primary.structure, "top-bottom");
});

test("UI adapter keeps Provocative independent from Primary Outfit Random", () => {
  const controls = uiStateToGenerationControls({
    clothing: {
      "clothing.primary-random": { mode: "random", value: null },
      "clothing.provocative": { mode: "manual", value: "on" },
    },
  });
  assert.deepEqual(controls.clothing, { provocative: true, primary: { mode: "random" } });
});

test("UI adapter omits Provocative when toggle is off", () => {
  const controls = uiStateToGenerationControls({
    clothing: {
      "clothing.primary-random": { mode: "unselected", value: null },
      "clothing.provocative": { mode: "none", value: null },
    },
  });
  assert.equal(controls.clothing?.provocative, undefined);
});
