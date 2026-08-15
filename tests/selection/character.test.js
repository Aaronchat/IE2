import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration } from "../../engine/selection/index.js";

test("Character default ethnicity and ethnicity-ordered Random name", () => {
  const { selections } = selectGeneration({ controls: { character: { ethnicity: { mode: "manual", value: "Black" }, name: { mode: "random" } } }, random: { seed: "name" } });
  assert.equal(selections.character.ethnicity.value, "Black");
  const allowed = ["Aaliyah","Nia","Imani","Zuri","Tiana","Kenya","Simone","Jada","Kiara","Amarra","Jasmine","Monique","Keisha","Shanice","Destiny","Brianna","Ebony","Raven","Tamika","Dominique","Latoya","Kendra","Chantal","Ayana","Makayla"];
  assert.ok(allowed.includes(selections.character.name.value));
});

test("Character Random ethnicity preserves exclusion and is reproducible", () => {
  const input = { controls: { character: { ethnicity: { mode: "random" }, name: { mode: "random" } } }, random: { seed: "same" } };
  const a = selectGeneration(input).selections.character;
  const b = selectGeneration(input).selections.character;
  assert.deepEqual(a, b);
  assert.notEqual(a.ethnicity.value, "Black");
});

test("Fox Ears and Fox Tail may stack, but Character Features do not support Random", () => {
  const { selections } = selectGeneration({ controls: { character: { features: { mode: "manual", values: ["Fox Ears", "Fox Tail"] } } } });
  assert.deepEqual(selections.character.features.value, ["Fox Ears", "Fox Tail"]);
  assert.throws(() => selectGeneration({ controls: { character: { features: { mode: "random" } } }, random: { seed: 1 } }), /does not support/);
});
