import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { CHARACTER_NAMES } from "../../data/character/names.js";
import { CHARACTER_FEATURES } from "../../data/character/character-features.js";
import { UNDERWEAR_LINGERIE } from "../../data/clothing/lingerie/underwear-lingerie.js";
import { ATMOSPHERE_CONFIG } from "../../data/weather/config.js";
import { CAMERA_CONFIG } from "../../data/camera/config.js";
import { EFFECTS_CONFIG } from "../../data/effects/config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");

test("Camera and Effects did not gain Random modules or config fields", () => {
  assert.equal(fs.existsSync(path.join(root, "engine/selection/random/camera.js")), false);
  assert.equal(fs.existsSync(path.join(root, "engine/selection/random/effects.js")), false);
  assert.equal(Object.prototype.hasOwnProperty.call(CAMERA_CONFIG, "random"), false);
  assert.equal(Object.prototype.hasOwnProperty.call(EFFECTS_CONFIG, "random"), false);
});

test("manual-only Character Features and Lingerie remain present in catalogs", () => {
  assert.deepEqual(CHARACTER_FEATURES.options, [
    "Fox Ears",
    "Fox Tail",
    "Bunny Ears",
    "Cat Ears",
    "Cat Tail",
    "Vampire Fangs",
    "Wings",
    "Horns",
    "Elf Ears",
  ]);
  assert.ok(UNDERWEAR_LINGERIE.items.length > 0);
  assert.ok(CHARACTER_NAMES.ethnicities.some((group) => group.name === "Black"));
});

test("existing Atmosphere compatibility config remains authoritative", () => {
  assert.equal(ATMOSPHERE_CONFIG.maxSelections, 2);
  assert.deepEqual(ATMOSPHERE_CONFIG.prohibitedFamilyPairs, [
    ["clear", "non-clear"],
    ["wind", "wind"],
  ]);
  assert.equal(ATMOSPHERE_CONFIG.preventSameGroupStacking, true);
});

test("catalog data contains no runtime Random counters or decay fields", () => {
  const forbidden = [
    "lifetimeSelectionCount",
    "lifetimeCounter",
    "temporaryDecay",
    "decayStrength",
    "randomSelectionCount",
  ];

  const dataRoot = path.join(root, "data");
  const stack = [dataRoot];
  while (stack.length > 0) {
    const current = stack.pop();
    for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile() && entry.name.endsWith(".js")) {
        const text = fs.readFileSync(full, "utf8");
        for (const token of forbidden) {
          assert.equal(text.includes(token), false, `${full} contains ${token}`);
        }
      }
    }
  }
});
