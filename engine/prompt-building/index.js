import { CATALOGS } from "../selection/catalogs.js";
import { CAMERA_CONFIG } from "../../data/camera/config.js";
import { EFFECTS_CONFIG } from "../../data/effects/config.js";
import { buildCharacterFragments } from "./character.js";

export const PROMPT_SECTION_ORDER = Object.freeze([
  "character",
  "clothing",
  "footwear",
  "accessories",
  "location",
  "atmosphere",
  "timeOfDay",
  "camera",
  "effects",
]);

function normalizeFragment(fragment) {
  if (typeof fragment !== "string") throw new Error("Prompt fragments must be strings.");
  return fragment.replace(/\s+/gu, " ").trim().replace(/[\s,;.]+$/gu, "");
}

function promptOf(record, label) {
  if (!record || typeof record !== "object") throw new Error(`${label} record is required.`);
  if (typeof record.prompt !== "string" || !record.prompt.trim()) throw new Error(`${label} record ${record.id ?? "<unknown>"} has no authoritative prompt.`);
  return normalizeFragment(record.prompt);
}

function catalogRank(groups) {
  const ranks = new Map();
  let rank = 0;
  for (const group of groups) for (const record of group.items) ranks.set(record, rank++);
  return ranks;
}

function sortRecords(records, groups) {
  const ranks = catalogRank(groups);
  return [...records].sort((a, b) => (ranks.get(a) ?? Number.MAX_SAFE_INTEGER) - (ranks.get(b) ?? Number.MAX_SAFE_INTEGER));
}

function detailedGarmentPrompt(record, details = {}, label = "Clothing") {
  const parts = [];
  for (const id of ["condition", "color", "fabric"]) {
    if (details[id]) parts.push(promptOf(details[id], `${label} ${id}`));
  }
  parts.push(promptOf(record, label));
  if (details.graphic) parts.push(promptOf(details.graphic, `${label} graphic`));
  return normalizeFragment(parts.join(" "));
}

function clothingFragments(clothing) {
  if (!clothing) return Object.freeze([]);
  const fragments = [];
  const details = clothing.details ?? {};
  const primary = clothing.primary?.value;
  if (primary?.path === "package") {
    fragments.push(promptOf(primary.package, "Package"));
  } else if (primary?.path === "built-outfit") {
    const built = primary.builtOutfit;
    if (!built || typeof built !== "object") throw new Error("Built Outfit structure is required.");
    if (built.structure === "top-bottom") {
      if (built.outfit?.top) fragments.push(detailedGarmentPrompt(built.outfit.top, details.tops, "Clothing top"));
      if (built.outfit?.bottom) fragments.push(detailedGarmentPrompt(built.outfit.bottom, details.bottoms, "Clothing bottom"));
    } else if (built.structure === "swimwear") {
      for (const record of sortRecords(built.outfit ?? [], CATALOGS.clothing)) fragments.push(detailedGarmentPrompt(record, details.swimwear, "Swimwear"));
    } else if (["dress", "one-piece", "sleepwear"].includes(built.structure)) {
      const detailKey = built.structure === "dress" ? "dresses" : built.structure;
      fragments.push(detailedGarmentPrompt(built.outfit, details[detailKey], `Clothing ${built.structure}`));
    } else {
      throw new Error(`Unknown resolved Built Outfit structure ${built.structure}.`);
    }
  } else if (primary != null) {
    throw new Error(`Unknown resolved Clothing path ${primary.path}.`);
  }

  for (const [key, label] of [["outerwear", "Outerwear"], ["hosiery", "Hosiery"], ["lingerie", "Lingerie"]]) {
    const record = clothing[key]?.value;
    if (record) fragments.push(detailedGarmentPrompt(record, details[key], label));
  }
  return Object.freeze(fragments);
}

function accessoryFragments(selection) {
  if (!selection?.value?.length) return Object.freeze([]);
  const records = selection.value.map((entry) => entry.record);
  return Object.freeze(sortRecords(records, CATALOGS.accessories).map((record) => promptOf(record, "Accessory")));
}

function atmosphereFragments(selection) {
  if (!selection?.value?.length) return Object.freeze([]);
  return Object.freeze(sortRecords(selection.value, CATALOGS.atmosphere).map((record) => promptOf(record, "Atmosphere")));
}

function configuredFragments(selection, groupsByControl, config, label) {
  const fragments = [];
  for (const [controlId, controlConfig] of Object.entries(config.controls)) {
    const result = selection?.[controlId];
    if (!result?.value) continue;
    const records = Array.isArray(result.value) ? sortRecords(result.value, [groupsByControl[controlId]]) : [result.value];
    if (records.length > controlConfig.maxSelections) throw new Error(`${label} ${controlId} exceeds its approved selection maximum.`);
    for (const record of records) fragments.push(promptOf(record, `${label} ${controlId}`));
  }
  return Object.freeze(fragments);
}

function omissionStates(selections) {
  const omissions = [];
  const note = (section, control, state) => omissions.push(Object.freeze({ section, control, state }));

  if (selections.atmosphere?.resolution?.action === "resolved-to-none") note("atmosphere", "atmosphere", "resolution-suppressed");
  else if (selections.atmosphere?.mode === "none") note("atmosphere", "atmosphere", "user-none");

  if (selections.timeOfDay?.mode === "none") note("timeOfDay", "timeOfDay", "user-none");

  const built = selections.clothing?.primary?.value?.builtOutfit;
  if (built?.structure === "top-bottom") {
    if (built.slotModes?.top === "none") note("clothing", "tops", "user-none");
    if (built.slotModes?.bottom === "none") note("clothing", "bottoms", "user-none");
  }
  for (const key of ["outerwear", "hosiery", "lingerie"]) {
    if (selections.clothing?.[key]?.mode === "none") note("clothing", key, "user-none");
  }

  for (const [controlId, controlConfig] of Object.entries(CAMERA_CONFIG.controls)) {
    const result = selections.camera?.[controlId];
    if (result?.mode === "none") note("camera", controlId, "user-none");
    else if (result?.mode === "default" && result.value == null && controlConfig.defaultSelection == null) note("camera", controlId, "default-none");
  }

  for (const [controlId] of Object.entries(EFFECTS_CONFIG.controls)) {
    const result = selections.effects?.[controlId];
    if (result?.mode === "none") note("effects", controlId, "user-none");
    else if (result?.mode === "default" && (result.value == null || (Array.isArray(result.value) && result.value.length === 0))) note("effects", controlId, "default-none");
  }

  return Object.freeze(omissions);
}

export function buildPrompt(resolvedState) {
  if (!resolvedState || typeof resolvedState !== "object" || !resolvedState.selections || typeof resolvedState.selections !== "object") {
    throw new Error("Prompt Building requires a resolved generation state with selections.");
  }

  const selections = resolvedState.selections;
  if (!selections.character || typeof selections.character !== "object") throw new Error("Prompt Building requires resolved Character selections.");

  const sections = Object.freeze({
    character: buildCharacterFragments(selections.character),
    clothing: clothingFragments(selections.clothing),
    footwear: Object.freeze(selections.footwear?.value ? [promptOf(selections.footwear.value, "Footwear")] : []),
    accessories: accessoryFragments(selections.accessories),
    location: Object.freeze(selections.location?.value ? [promptOf(selections.location.value, "Location")] : []),
    atmosphere: atmosphereFragments(selections.atmosphere),
    timeOfDay: Object.freeze(selections.timeOfDay?.value ? [promptOf(selections.timeOfDay.value, "Time of Day")] : []),
    camera: configuredFragments(selections.camera, CATALOGS.camera, CAMERA_CONFIG, "Camera"),
    effects: configuredFragments(selections.effects, CATALOGS.effects, EFFECTS_CONFIG, "Effects"),
  });

  const fragments = Object.freeze(PROMPT_SECTION_ORDER.flatMap((section) => sections[section]));
  return Object.freeze({
    sections,
    omissions: omissionStates(selections),
    fragments,
    prompt: fragments.join(", "),
  });
}
