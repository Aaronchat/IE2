import { CHARACTER_NAMES } from "../data/character/names.js";
import { CHARACTER_SKIN } from "../data/character/skin.js";
import { CHARACTER_HAIR } from "../data/character/hair.js";
import { CHARACTER_EYES } from "../data/character/eyes.js";
import { CHARACTER_EXPRESSION } from "../data/character/expression.js";
import { CHARACTER_MAKEUP } from "../data/character/makeup.js";
import { CHARACTER_PHYSICAL_APPEARANCE } from "../data/character/physical-appearance.js";
import { CHARACTER_FEATURES } from "../data/character/character-features.js";
import { CATALOGS } from "../engine/selection/catalogs.js";
import { CAMERA_CONFIG } from "../data/camera/config.js";
import { EFFECTS_CONFIG } from "../data/effects/config.js";
import { ATMOSPHERE_CONFIG } from "../data/weather/config.js";
import { TIME_OF_DAY_CONFIG } from "../data/time-of-day/config.js";
import { TOP_DETAIL_CONFIG } from "../data/clothing/top-details.js";
import {
  TOP_RANDOM_BUCKETS,
  BOTTOM_RANDOM_BUCKETS,
  DRESS_RANDOM_BUCKETS,
  ONE_PIECE_RANDOM_BUCKETS,
  SLEEPWEAR_RANDOM_BUCKETS,
  SWIMWEAR_CATALOG_GROUPS,
  OUTERWEAR_RANDOM_BUCKETS,
  HOSIERY_CATALOG_GROUPS,
} from "../engine/selection/random/clothing.js";

const option = (value, label = value, groupId = null) => Object.freeze({ value, label, groupId });
const stringOptions = (values) => Object.freeze(values.map((value) => option(value)));
const recordOptions = (groups) => Object.freeze(groups.flatMap((group) => group.items.map((item) => option(item.id, item.name, group.id))));
const groupedRecordOptions = (groups) => Object.freeze(groups.map((group) => Object.freeze({ label: group.name, options: Object.freeze(group.items.map((item) => option(item.id, item.name, group.id))) })));
const control = ({ id, label, options = [], groupedOptions = [], random = false, none = false, defaultValue = null, defaultMode = "unselected", maxSelections = 1, note = "" }) => Object.freeze({ id, label, options, groupedOptions, random, none, defaultValue, defaultMode, maxSelections, note });
const section = (id, label, controls, action = null, advancedControls = []) => Object.freeze({ id, label, controls: Object.freeze(controls), advancedControls: Object.freeze(advancedControls), action });
const category = (id, label, sections, action = null) => Object.freeze({ id, label, sections: Object.freeze(sections), action });

const hairColorGroups = Object.freeze(Object.entries(CHARACTER_HAIR.colors).map(([key, values]) => Object.freeze({ label: key === "natural" ? "Natural" : "Fantasy", options: stringOptions(values) })));
const hairStyleGroups = Object.freeze(Object.entries(CHARACTER_HAIR.styles).map(([key, values]) => Object.freeze({ label: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()), options: stringOptions(values) })));

const characterSections = [
  section("identity", "Identity", [
    control({ id: "character.ethnicity", label: "Ethnicity", options: stringOptions(CHARACTER_NAMES.ethnicities.map((entry) => entry.name)), random: true, defaultValue: CHARACTER_NAMES.defaultEthnicity }),
    control({ id: "character.name", label: "Name", groupedOptions: Object.freeze(CHARACTER_NAMES.ethnicities.map((entry) => Object.freeze({ label: entry.name, options: stringOptions(entry.names) }))), random: true, note: "Name eligibility follows the selected ethnicity." }),
  ]),
  section("skin", "Skin", [
    control({ id: "character.skin-tone", label: "Skin Tone", options: stringOptions(CHARACTER_SKIN.skinTones), random: true }),
    control({ id: "character.freckles", label: "Freckles", options: stringOptions(CHARACTER_SKIN.freckles), random: true }),
  ]),
  section("hair", "Hair", [
    control({ id: "character.hair-color", label: "Hair Color", groupedOptions: hairColorGroups, random: true }),
    control({ id: "character.hair-length", label: "Hair Length", options: stringOptions(CHARACTER_HAIR.lengths), random: true }),
    control({ id: "character.hair-texture", label: "Hair Texture", options: stringOptions(CHARACTER_HAIR.textures), random: true }),
    control({ id: "character.hair-style", label: "Hair Style", groupedOptions: hairStyleGroups, random: true }),
  ]),
  section("eyes", "Eyes", [control({ id: "character.eye-color", label: "Eye Color", options: stringOptions(CHARACTER_EYES.colors), random: true })]),
  section("expression", "Expression", [
    control({ id: "character.expression", label: "Expression", options: stringOptions(CHARACTER_EXPRESSION.expressions), random: true }),
    control({ id: "character.gaze", label: "Gaze", options: stringOptions(CHARACTER_EXPRESSION.gaze), random: true }),
  ]),
  section("makeup", "Makeup", [control({ id: "character.makeup", label: "Makeup", options: stringOptions(CHARACTER_MAKEUP.options), random: true })]),
  section("physical-appearance", "Physical Appearance", [
    control({ id: "character.build", label: "Build", options: stringOptions(CHARACTER_PHYSICAL_APPEARANCE.build), random: true }),
    control({ id: "character.chest-description", label: "Chest Description", options: stringOptions(CHARACTER_PHYSICAL_APPEARANCE.chest.descriptions), random: true }),
    control({ id: "character.chest-adjective", label: "Chest Adjective", options: stringOptions(CHARACTER_PHYSICAL_APPEARANCE.chest.optionalAdjectives), random: true, note: "Random requires explicit adjective weights in the current engine." }),
    control({ id: "character.hip-width", label: "Hip Width", options: stringOptions(CHARACTER_PHYSICAL_APPEARANCE.hipWidth), random: true }),
    control({ id: "character.waist", label: "Waist", options: stringOptions(CHARACTER_PHYSICAL_APPEARANCE.waist), random: true }),
  ]),
  section("features", "Character Features", [control({ id: "character.features", label: "Features", options: stringOptions(CHARACTER_FEATURES.options), maxSelections: 2, note: "Manual only. Maximum two." })]),
];

function catalogSection(id, label, groups, { random = false, none = false, maxSelections = 1, note = "" } = {}) {
  return section(id, label, [control({ id: `${id}.selection`, label, groupedOptions: groupedRecordOptions(groups), random, none, maxSelections, note })]);
}

function clothingSection(id, label, groups, { random = true, none = true, note = "", advancedControls = [] } = {}) {
  const controls = groups.map((group) => control({
    id: `${id}.${group.id}.selection`,
    label: group.name,
    groupedOptions: groupedRecordOptions([group]),
  }));
  const action = control({ id: `${id}.selection`, label, random, none, note });
  return section(id, label, controls, action, advancedControls);
}

const topAdvancedControls = Object.freeze(Object.entries(TOP_DETAIL_CONFIG).map(([id, config]) => control({
  id: `clothing.tops.advanced.${id}`,
  label: config.label,
  options: Object.freeze(config.options.map((entry) => option(entry.id, entry.name))),
  random: true,
  none: true,
  defaultMode: "none",
})));

const clothingSections = [
  clothingSection("clothing.tops", "Tops", TOP_RANDOM_BUCKETS, { advancedControls: topAdvancedControls }),
  clothingSection("clothing.bottoms", "Bottoms", BOTTOM_RANDOM_BUCKETS),
  clothingSection("clothing.dresses", "Dresses", DRESS_RANDOM_BUCKETS),
  clothingSection("clothing.one-piece", "One-Piece", ONE_PIECE_RANDOM_BUCKETS),
  clothingSection("clothing.swimwear", "Swimwear", SWIMWEAR_CATALOG_GROUPS, { note: "Swimwear assembly remains owned by the existing resolver." }),
  clothingSection("clothing.sleepwear", "Sleepwear", SLEEPWEAR_RANDOM_BUCKETS),
  clothingSection("clothing.outerwear", "Outerwear", OUTERWEAR_RANDOM_BUCKETS),
  clothingSection("clothing.hosiery", "Hosiery", HOSIERY_CATALOG_GROUPS, { note: "Random eligibility depends on the resolved outfit." }),
  clothingSection("clothing.lingerie", "Lingerie", CATALOGS.clothing.filter((group) => group.id === "underwear-lingerie"), { random: false, note: "Manual only." }),
  clothingSection("clothing.packages", "Packages", CATALOGS.packages),
];

const footwearSections = CATALOGS.footwear.map((group) => catalogSection(`footwear.${group.id}`, group.name, [group]));
const accessorySections = CATALOGS.accessories.map((group) => catalogSection(`accessories.${group.id}`, group.name, [group], { maxSelections: 2 }));
const locationSections = CATALOGS.locations.map((group) => catalogSection(`location.${group.id}`, group.name, [group]));
const atmosphereSections = CATALOGS.atmosphere.map((group) => catalogSection(`atmosphere.${group.id}`, group.name, [group], { maxSelections: ATMOSPHERE_CONFIG.maxSelections }));
const timeSections = [catalogSection("time-of-day", "Time of Day", CATALOGS.timeOfDay, { random: true, none: Boolean(TIME_OF_DAY_CONFIG.none) })];

const cameraSections = Object.entries(CATALOGS.camera).map(([id, group]) => {
  const config = CAMERA_CONFIG.controls[id];
  return section(`camera.${id}`, group.name, [control({
    id: `camera.${id}`,
    label: group.name,
    groupedOptions: groupedRecordOptions([group]),
    random: false,
    none: Boolean(config.none),
    defaultValue: config.defaultSelection ?? null,
    maxSelections: config.maxSelections,
  })]);
});

const effectsSections = Object.entries(CATALOGS.effects).map(([id, group]) => {
  const config = EFFECTS_CONFIG.controls[id];
  return section(`effects.${id}`, group.name, [control({
    id: `effects.${id}`,
    label: group.name,
    groupedOptions: groupedRecordOptions([group]),
    random: false,
    none: Boolean(config.none),
    defaultValue: config.defaultSelection ?? null,
    maxSelections: config.maxSelections,
  })]);
});

export const UI_CATEGORIES = Object.freeze([
  category("character", "Character", characterSections),
  category("clothing", "Clothing", clothingSections, control({ id: "clothing.primary-random", label: "Primary Outfit", random: true, note: "Uses the existing Built Outfit / Package Random path." })),
  category("footwear", "Footwear", footwearSections, control({ id: "footwear.selection", label: "Footwear", random: true })),
  category("accessories", "Accessories", accessorySections, control({ id: "accessories.selection", label: "Accessories", random: true, maxSelections: 2 })),
  category("location", "Location", locationSections, control({ id: "location.selection", label: "Location", random: true })),
  category("atmosphere", "Atmosphere", atmosphereSections, control({ id: "atmosphere.selection", label: "Atmosphere", random: true, none: true, maxSelections: ATMOSPHERE_CONFIG.maxSelections })),
  category("time-of-day", "Time of Day", timeSections),
  category("camera", "Camera", cameraSections),
  category("effects", "Effects", effectsSections),
]);

export function allUiControls() {
  return UI_CATEGORIES.flatMap((entry) => [...(entry.action ? [entry.action] : []), ...entry.sections.flatMap((subsection) => [...(subsection.action ? [subsection.action] : []), ...subsection.controls, ...subsection.advancedControls])]);
}
