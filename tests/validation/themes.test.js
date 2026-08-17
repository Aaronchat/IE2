import test from "node:test";
import assert from "node:assert/strict";

import { THEME_COLORS } from "../../data/themes/colors.js";
import { THEME_HOLIDAYS_EVENTS } from "../../data/themes/holidays-events.js";
import { THEME_GENRES_AESTHETICS } from "../../data/themes/genres-aesthetics.js";
import { THEMES_CONFIG } from "../../data/themes/config.js";
import { validateThemes } from "../../engine/validation/themes.js";

const groups = () => structuredClone([THEME_COLORS, THEME_HOLIDAYS_EVENTS, THEME_GENRES_AESTHETICS]);
const config = () => structuredClone(THEMES_CONFIG);

test("initial Theme catalog and approved configuration validate", () => {
  assert.deepEqual(validateThemes(), { categoryCount: 3, recordCount: 16 });
});

test("Theme validation rejects duplicate or invented catalog records", () => {
  const duplicate = groups();
  duplicate[0].items[1].id = duplicate[0].items[0].id;
  assert.throws(() => validateThemes(duplicate, config()), /Duplicate Theme id/);

  const invented = groups();
  invented[0].items[0] = { id: "blue", name: "Blue", prompt: "blue" };
  assert.throws(() => validateThemes(invented, config()), /Unapproved Theme/);
});

test("Theme validation rejects cross-domain fields and changed stack-size policy", () => {
  const mapped = groups();
  mapped[0].items[0].clothingMappings = ["red-shirt"];
  assert.throws(() => validateThemes(mapped, config()), /unapproved Theme record field clothingMappings/);

  const changedOdds = config();
  changedOdds.randomStackSizeWeights[0].weight = 34;
  assert.throws(() => validateThemes(groups(), changedOdds), /50% single, 40% double, and 10% triple/);
});
