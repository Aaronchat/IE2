import test from "node:test";
import assert from "node:assert/strict";

import { CATALOGS } from "./engine/selection/catalogs.js";
import { prepareGeneration } from "./engine/generation/index.js";
import { UI_CATEGORIES } from "./app/ui-data-2.1h.js";
import { uiStateToGenerationControls } from "./app/generation-adapter-2.1h.js";

const prop = (id, groupId) => ({ id, groupId });

test("Props appears between Accessories and Location and allows three selections", () => {
  const ids = UI_CATEGORIES.map((entry) => entry.id);
  assert.equal(ids.indexOf("props"), ids.indexOf("accessories") + 1);
  assert.equal(ids.indexOf("location"), ids.indexOf("props") + 1);
  const props = UI_CATEGORIES.find((entry) => entry.id === "props");
  assert.equal(props.action.maxSelections, 3);
  assert.deepEqual(props.action.groupedOptions.map((group) => group.label), [
    "Weapons", "Off-Road", "Cars & SUVs", "Motorcycles", "War Machines", "Instruments",
  ]);
});

test("three Props survive UI adaptation and render before Location", () => {
  const ui = {
    props: {
      "props.selection": {
        mode: "manual",
        values: [
          { value: "shotgun-held", groupId: "weapons" },
          { value: "fiddle-on-back", groupId: "instruments" },
          { value: "ferrari-f80", groupId: "cars-suvs" },
        ],
      },
    },
    location: {
      "location.international-locations.selection": {
        mode: "manual",
        values: [{ value: "african-savanna", groupId: "international-locations" }],
      },
    },
  };
  const controls = uiStateToGenerationControls(ui);
  assert.equal(controls.props.selections.length, 3);
  const generated = prepareGeneration({ controls });
  const prompt = generated.prompt.prompt;
  assert.match(prompt, /holding a shotgun/);
  assert.match(prompt, /fiddle strapped across her back/);
  assert.match(prompt, /with a Ferrari F80/);
  assert.match(prompt, /on the African savanna/);
  assert.ok(prompt.indexOf("holding a shotgun") < prompt.indexOf("on the African savanna"));
});

test("Props rejects a fourth selection", () => {
  assert.throws(() => prepareGeneration({
    controls: {
      props: {
        mode: "manual",
        selections: [
          prop("shotgun-held", "weapons"),
          prop("fiddle-on-back", "instruments"),
          prop("ferrari-f80", "cars-suvs"),
          prop("tank", "war-machines"),
        ],
      },
    },
  }), /at most 3|maximum of 3|exceeds/i);
});

test("African Savanna, Safari Guide, and moved M16 are registered correctly", () => {
  const international = CATALOGS.locations.find((group) => group.id === "international-locations");
  assert.ok(international.items.some((item) => item.id === "african-savanna"));

  const costumes = CATALOGS.packages.find((group) => group.id === "costumes");
  assert.ok(costumes.items.some((item) => item.id === "safari-guide"));

  const weapons = CATALOGS.props.find((group) => group.id === "weapons");
  assert.ok(weapons.items.some((item) => item.id === "m16-held"));
  assert.equal(CATALOGS.accessories.flatMap((group) => group.items).some((item) => item.id === "m16"), false);
});
