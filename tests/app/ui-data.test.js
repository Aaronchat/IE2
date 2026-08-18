import assert from "node:assert/strict";
import test from "node:test";
import { allUiControls, TATTOO_UI_CONFIG, UI_CATEGORIES } from "../../app/ui-data.js";

const controls = allUiControls();
const byId = new Map(controls.map((entry) => [entry.id, entry]));

test("UI exposes all active top-level domains", () => {
  assert.deepEqual(UI_CATEGORIES.map((entry) => entry.id), [
    "character", "tattoos", "clothing", "footwear", "accessories", "location", "atmosphere", "time-of-day", "camera", "themes", "covers",
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
  assert.equal(byId.get("character.chest-description").defaultValue, "Buxom");
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

test("Clothing parent sections expose Random/None while garment-family menus stay manual-only", () => {
  for (const id of [
    "clothing.tops.selection", "clothing.bottoms.selection", "clothing.dresses.selection",
    "clothing.one-piece.selection", "clothing.swimwear.selection", "clothing.sleepwear.selection",
    "clothing.outerwear.selection", "clothing.hosiery.selection", "clothing.packages.selection",
  ]) {
    assert.equal(byId.get(id).random, true);
    assert.equal(byId.get(id).none, true);
  }
  assert.equal(byId.get("clothing.lingerie.selection").random, false);
  assert.equal(byId.get("clothing.lingerie.selection").none, true);
  assert.equal(byId.get("clothing.tops.tank-tops.selection").random, false);
  assert.equal(byId.get("clothing.tops.tank-tops.selection").none, false);
});

test("Tops exposes four Advanced detail controls with None defaults", () => {
  for (const id of ["color", "fabric", "condition", "graphic"]) {
    const entry = byId.get(`clothing.tops.advanced.${id}`);
    assert.ok(entry);
    assert.equal(entry.random, true);
    assert.equal(entry.none, true);
    assert.equal(entry.defaultMode, "none");
  }
});

test("Age exposes grouped ranges and exact adult ages", () => {
  const age = byId.get("character.age");
  assert.deepEqual(age.groupedOptions.map((entry) => entry.label), ["19–29", "30–39", "40–49", "50–59", "60–74", "75+"]);
  assert.ok(age.groupedOptions[0].options.some((entry) => entry.value === "age-range-19-29"));
  assert.ok(age.groupedOptions[0].options.some((entry) => entry.value === "age-19"));
  assert.ok(age.groupedOptions.at(-1).options.some((entry) => entry.value === "age-99"));
});

test("Time of Day is a direct category control without a duplicate subsection", () => {
  const time = UI_CATEGORIES.find((entry) => entry.id === "time-of-day");
  assert.equal(time.sections.length, 0);
  assert.equal(time.action.id, "time-of-day.selection");
  assert.ok(time.action.groupedOptions.length > 0);
});

test("Effects is visually nested beneath Camera without changing Effects control ids", () => {
  const camera = UI_CATEGORIES.find((entry) => entry.id === "camera");
  assert.deepEqual(camera.sections.slice(-2).map((entry) => entry.id), [
    "effects.effects-imperfections",
    "effects.film-age",
  ]);
  assert.equal(UI_CATEGORIES.some((entry) => entry.id === "effects"), false);
});

test("Tattoos is a repeatable top-level UI module after Character with approved initial data", () => {
  const tattoos = UI_CATEGORIES.find((entry) => entry.id === "tattoos");
  assert.equal(tattoos.repeatable, "tattoos");
  assert.deepEqual(TATTOO_UI_CONFIG.placements.map((entry) => entry.label), [
    "Upper Chest", "Abdomen", "Left Shoulder", "Right Shoulder", "Left Arm", "Right Arm", "Left Leg", "Right Leg",
  ]);
  assert.deepEqual(TATTOO_UI_CONFIG.genericStyles.map((entry) => entry.label), [
    "Traditional", "Neo-Traditional", "Japanese", "Tribal", "Blackwork", "Fine-Line", "Watercolor", "Realism", "Geometric", "Biomechanical",
  ]);
  assert.ok(TATTOO_UI_CONFIG.placements.find((entry) => entry.value === "left-arm").patterns.some((entry) => entry.value === "full-sleeve"));
  assert.equal(allUiControls().some((entry) => entry.id.startsWith("tattoos.")), false);
});

test("Themes remains the final normal prompt domain and exposes its approved stack UI", () => {
  const themes = UI_CATEGORIES.at(-2);
  assert.equal(themes.id, "themes");
  assert.deepEqual(themes.sections.map((entry) => entry.label), ["Colors", "Holidays & Events", "Genres & Aesthetics"]);
  assert.equal(themes.action.id, "themes.selection");
  assert.equal(themes.action.label, "Theme Stack");
  assert.equal(themes.action.random, true);
  assert.equal(themes.action.none, true);
  assert.equal(themes.action.defaultMode, "none");
  for (const section of themes.sections) assert.equal(section.controls[0].maxSelections, 3);
});

test("Covers / Presentation is final with contextual Styles, optional Era, and text inputs", () => {
  const covers = UI_CATEGORIES.at(-1);
  assert.equal(covers.id, "covers");
  assert.equal(covers.label, "Covers / Presentation");
  assert.equal(byId.get("covers.type").random, true);
  assert.equal(byId.get("covers.type").defaultMode, "unselected");
  assert.deepEqual(byId.get("covers.style").groupedOptions.map((group) => group.groupId), [
    "novel-styles", "album-styles", "dvd-styles", "magazine-styles",
  ]);
  assert.equal(byId.get("covers.style").groupedOptions.some((group) => group.groupId === "movie-poster-styles"), false);
  assert.equal(byId.get("covers.era").random, true);
  assert.equal(byId.get("covers.era").none, true);
  assert.equal(byId.get("covers.era").noneLabel, "Blank");
  assert.equal(byId.get("covers.metadata.novel.title").inputType, "text");
  assert.equal(byId.get("covers.metadata.album.artist-band").inputType, "text");
  assert.equal(byId.get("covers.metadata.magazine.primary-headline").inputType, "text");
});

test("remaining garment categories expose Condition under Advanced", () => {
  for (const section of ["bottoms", "dresses", "one-piece", "swimwear", "sleepwear", "outerwear", "hosiery", "lingerie"]) {
    const entry = byId.get(`clothing.${section}.advanced.condition`);
    assert.ok(entry, section);
    assert.equal(entry.defaultMode, "none");
    assert.equal(entry.random, true);
    assert.equal(entry.none, true);
  }
});
