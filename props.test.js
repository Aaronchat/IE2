import test from "node:test";
import assert from "node:assert/strict";
import { prepareGeneration } from "./engine/generation/index.js";
import { selectProps } from "./engine/selection/props.js";
import { CATALOGS } from "./engine/selection/catalogs.js";

const prop = (id, groupId) => ({ id, groupId });

test("three Props can combine and emit before Location", () => {
  const result = prepareGeneration({
    controls: {
      props: {
        mode: "manual",
        selections: [
          prop("shotgun-held", "weapons"),
          prop("fiddle-on-back", "instruments"),
          prop("ferrari-f80", "cars"),
        ],
      },
      location: { mode: "manual", id: "african-savanna", groupId: "international-locations" },
    },
  });

  assert.deepEqual(result.prompt.sections.props, [
    "holding a shotgun",
    "a Ferrari F80",
    "a fiddle strapped across her back",
  ]);
  assert.deepEqual(result.prompt.sections.location, ["on the African savanna"]);
  assert.ok(result.prompt.prompt.indexOf("holding a shotgun") < result.prompt.prompt.indexOf("on the African savanna"));
});

test("Props rejects a fourth selection", () => {
  assert.throws(() => selectProps({
    mode: "manual",
    selections: [
      prop("katana-held", "weapons"),
      prop("shotgun-held", "weapons"),
      prop("ferrari-f80", "cars"),
      prop("tank", "war-machines"),
    ],
  }), /at most 3/i);
});

test("African Savanna is available as an International Location", () => {
  const group = CATALOGS.locations.find((entry) => entry.id === "international-locations");
  assert.equal(group.items.find((entry) => entry.id === "african-savanna")?.prompt, "on the African savanna");
});

test("Safari Guide is available under Costumes", () => {
  const group = CATALOGS.packages.find((entry) => entry.id === "costumes");
  const safariGuide = group.items.find((entry) => entry.id === "safari-guide");
  assert.ok(safariGuide);
  assert.match(safariGuide.prompt, /safari guide outfit/i);
});

test("Themed Props moved out of Accessories and M16 lives under Props Weapons", () => {
  const weapons = CATALOGS.props.find((entry) => entry.id === "weapons");
  const general = CATALOGS.props.find((entry) => entry.id === "general-props");
  assert.ok(weapons.items.some((entry) => entry.id === "m16-held"));
  assert.ok(general.items.some((entry) => entry.id === "microphone"));
  assert.equal(general.items.some((entry) => entry.id === "m16"), false);
  assert.equal(CATALOGS.accessories.some((entry) => entry.id === "themed-props"), false);
});
