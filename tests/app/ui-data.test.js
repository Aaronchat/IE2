import assert from "node:assert/strict";
import test from "node:test";
import { allUiControls, UI_CATEGORIES } from "../../app/ui-data.js";

const controls = allUiControls();
const byId = new Map(controls.map((entry) => [entry.id, entry]));

test("UI exposes all active top-level domains", () => {
  assert.deepEqual(UI_CATEGORIES.map((entry) => entry.id), [
    "character", "clothing", "footwear", "accessories", "location", "atmosphere", "time-of-day", "camera", "effects",
  ]);
});

test("approved defaults are preserved", () => {
  assert.equal(byId.get("character.ethnicity").defaultValue, "Caucasian");
  assert.equal(byId.get("camera.camera-body").defaultValue, "canon-eos-r5");
  assert.equal(byId.get("camera.capture-medium").defaultValue, "digital");
  assert.equal(byId.get("camera.lens-look").defaultValue, "50mm-standard");
  assert.equal(byId.get("camera.focus-depth").defaultValue, "balanced-focus");
  assert.equal(byId.get("camera.framing").defaultValue, "full-body");
  assert.equal(byId.get("camera.camera-angle").defaultValue, "eye-level");
  assert.equal(byId.get("camera.subject-view").defaultValue, "straight-on-view");
  assert.equal(byId.get("camera.viewer-pov").defaultValue, "direct-portrait-view");
  assert.equal(byId.get("camera.spatial-safe-framing").defaultValue, null);
  assert.equal(byId.get("effects.effects-imperfections").defaultValue, null);
  assert.equal(byId.get("effects.film-age").defaultValue, null);
});

test("approved Random exclusions and domain boundaries are preserved", () => {
  for (const entry of controls.filter((item) => item.id.startsWith("camera.") || item.id.startsWith("effects."))) assert.equal(entry.random, false);
  assert.equal(byId.get("character.features").random, false);
  assert.equal(byId.get("clothing.lingerie.selection").random, false);
  assert.equal(byId.get("footwear.selection").random, true);
  assert.equal(byId.get("location.selection").random, true);
  assert.equal(byId.get("accessories.selection").random, true);
  for (const entry of controls.filter((item) => /^footwear\..+\.selection$/.test(item.id))) assert.equal(entry.random, false);
  for (const entry of controls.filter((item) => /^location\..+\.selection$/.test(item.id))) assert.equal(entry.random, false);
  for (const entry of controls.filter((item) => /^accessories\..+\.selection$/.test(item.id))) assert.equal(entry.random, false);
});

test("approved None exclusions are preserved", () => {
  for (const entry of controls.filter((item) => item.id.startsWith("footwear.") || item.id.startsWith("accessories.") || item.id.startsWith("location."))) assert.equal(entry.none, false);
  for (const entry of controls.filter((item) => item.id.startsWith("character."))) assert.equal(entry.none, false);
});

test("None remains available only where established in configured domains", () => {
  assert.equal(byId.get("time-of-day.selection").none, true);
  assert.equal(byId.get("camera.spatial-safe-framing").none, true);
  assert.equal(byId.get("effects.effects-imperfections").none, true);
  assert.equal(byId.get("effects.film-age").none, true);
  assert.equal(byId.get("atmosphere.selection").none, true);
  for (const entry of controls.filter((item) => /^atmosphere\..+\.selection$/.test(item.id))) assert.equal(entry.none, false);
});
