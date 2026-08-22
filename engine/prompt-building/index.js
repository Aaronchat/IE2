import { CATALOGS } from "../selection/catalogs.js";
import { CAMERA_CONFIG } from "../../data/camera/config.js";
import { EFFECTS_CONFIG } from "../../data/effects/config.js";
import { buildCharacterFragments } from "./character.js";

export const PROMPT_SECTION_ORDER = Object.freeze([
  "aspectRatio",
  "character",
  "clothing",
  "tattoos",
  "footwear",
  "accessories",
  "props",
  "location",
  "atmosphere",
  "timeOfDay",
  "camera",
  "effects",
  "themes",
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

function provocativeSingle(prompt) {
  return normalizeFragment(`provocative ${prompt}`);
}

function provocativeOutfit(prompts) {
  const cleaned = prompts.filter(Boolean).map(normalizeFragment);
  if (cleaned.length === 0) return Object.freeze([]);
  if (cleaned.length === 1) return Object.freeze([provocativeSingle(cleaned[0])]);
  return Object.freeze([normalizeFragment(`provocative ${cleaned.join(" and ")} outfit`)]);
}

function clothingGroup(record) {
  return CATALOGS.clothing.find((group) => group.items.includes(record));
}

function clothingCategory(record) {
  const group = clothingGroup(record);
  return record?.category ?? group?.defaults?.category ?? null;
}

function detailsForSlotRecord(record, slotDetails, details) {
  return clothingCategory(record) === "swimwear" ? details.swimwear : slotDetails;
}

function specificTattooDesign(text) {
  const cleaned = text.replace(/\s+/gu, " ").trim();
  if (/^[A-Z0-9][A-Z0-9 &'’.-]*$/u.test(cleaned) && /[A-Z]/u.test(cleaned)) return JSON.stringify(cleaned);
  return cleaned.replace(/\s+/gu, "-");
}

function tattooDesignPrompt(design) {
  if (design?.mode === "generic") return promptOf(design.style, "Tattoo Generic Style");
  if (design?.mode === "specific") return specificTattooDesign(design.text);
  throw new Error("Resolved Tattoo requires a Generic or Specific Design.");
}

function tattooPrompt(tattoo) {
  const pattern = tattoo?.pattern;
  if (!pattern) throw new Error("Resolved Tattoo requires a Size / Coverage Pattern.");
  const design = tattooDesignPrompt(tattoo.design);
  if (pattern.format === "sleeve") return normalizeFragment(`a ${pattern.sizePrompt} ${design} tattoo sleeve on her ${pattern.placementPrompt}`);
  if (pattern.format === "leg") return normalizeFragment(`a ${pattern.sizePrompt} ${design} leg tattoo on her ${pattern.placementPrompt}`);
  if (pattern.format === "tattoo") return normalizeFragment(`a ${pattern.sizePrompt} ${design} tattoo on her ${pattern.placementPrompt}`);
  throw new Error(`Unknown Tattoo prompt format ${pattern.format}.`);
}

function tattooFragments(selection) {
  if (!selection) return Object.freeze([]);
  if (!selection.resolution || !Array.isArray(selection.resolution.visible)) throw new Error("Prompt Building requires Resolution-approved Tattoo visibility.");
  return Object.freeze(selection.resolution.visible.map(tattooPrompt));
}

function clothingFragments(clothing) {
  if (!clothing) return Object.freeze([]);
  const fragments = [];
  const details = clothing.details ?? {};
  const primary = clothing.primary?.value;
  const provocative = clothing.provocative === true;
  if (primary?.path === "package") {
    const prompt = promptOf(primary.package, "Package");
    fragments.push(provocative ? provocativeSingle(prompt) : prompt);
  } else if (primary?.path === "built-outfit") {
    const built = primary.builtOutfit;
    if (!built || typeof built !== "object") throw new Error("Built Outfit structure is required.");
    if (built.structure === "top-bottom") {
      const primaryPrompts = [];
      if (built.outfit?.top) primaryPrompts.push(detailedGarmentPrompt(built.outfit.top, detailsForSlotRecord(built.outfit.top, details.tops, details), "Clothing top"));
      if (built.outfit?.bottom) primaryPrompts.push(detailedGarmentPrompt(built.outfit.bottom, detailsForSlotRecord(built.outfit.bottom, details.bottoms, details), "Clothing bottom"));
      fragments.push(...(provocative ? provocativeOutfit(primaryPrompts) : primaryPrompts));
    } else if (built.structure === "swimwear") {
      const primaryPrompts = sortRecords(built.outfit ?? [], CATALOGS.clothing).map((record) => detailedGarmentPrompt(record, details.swimwear, "Swimwear"));
      fragments.push(...(provocative ? provocativeOutfit(primaryPrompts) : primaryPrompts));
    } else if (["dress", "one-piece", "sleepwear"].includes(built.structure)) {
      const detailKey = built.structure === "dress" ? "dresses" : built.structure;
      const prompt = detailedGarmentPrompt(built.outfit, details[detailKey], `Clothing ${built.structure}`);
      fragments.push(provocative ? provocativeSingle(prompt) : prompt);
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

function propFragments(selection) {
  if (!selection?.value?.length) return Object.freeze([]);
  const records = selection.value.map((entry) => entry.record);
  return Object.freeze(sortRecords(records, CATALOGS.props).map((record) => promptOf(record, "Prop")));
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

const LEGACY_CAMERA_TECHNICAL_CONTROLS = new Set(["camera-body", "capture-medium", "lens-look", "focus-depth"]);
const SILENT_CAMERA_DEFAULT_CONTROLS = new Set(["camera-angle", "subject-view", "viewer-pov"]);

function cameraFragments(selection) {
  const fragments = [];
  for (const [controlId, controlConfig] of Object.entries(CAMERA_CONFIG.controls)) {
    const result = selection?.[controlId];
    if (!result?.value) continue;
    if (LEGACY_CAMERA_TECHNICAL_CONTROLS.has(controlId) && result.mode !== "manual") continue;
    if (SILENT_CAMERA_DEFAULT_CONTROLS.has(controlId) && result.mode === "default") continue;
    const records = Array.isArray(result.value) ? sortRecords(result.value, [CATALOGS.camera[controlId]]) : [result.value];
    if (records.length > controlConfig.maxSelections) throw new Error(`Camera ${controlId} exceeds its approved selection maximum.`);
    for (const record of records) fragments.push(promptOf(record, `Camera ${controlId}`));
  }
  const custom = selection?.["custom-pov"]?.value;
  if (custom) fragments.push(normalizeFragment(`seen from the first-person viewpoint of ${custom}; the viewpoint entity itself is not visible in the image`));
  return Object.freeze(fragments);
}

function themeFragments(selection) {
  if (!selection?.value?.length) return Object.freeze([]);
  const prompts = sortRecords(selection.value, CATALOGS.themes).map((record) => promptOf(record, "Theme"));
  const stack = prompts.length === 2 ? `${prompts[0]} and ${prompts[1]}` : prompts.join(" ");
  return Object.freeze([`Theme: ${stack}`]);
}

function quoted(value) {
  return JSON.stringify(value);
}

function joinedList(items) {
  if (items.length < 2) return items[0] ?? "";
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items.at(-1)}`;
}

function novelCoverText(metadata, romance) {
  const title = metadata.title;
  const author = metadata.author;
  const extras = [];
  if (romance) extras.push("fake review quotes");
  if (!title) extras.push(romance ? "an innuendo-style book title" : "a fictional book title");
  if (!author) extras.push(romance ? "an innuendo-style author name" : "a fictional author name");
  const lead = [title ? `titled ${quoted(title)}` : "", author ? `by ${author}` : ""].filter(Boolean).join(" ");
  return [lead, extras.length ? `featuring ${joinedList(extras)}` : ""].filter(Boolean).join(", ");
}

function albumCoverText(metadata) {
  const title = metadata["album-title"];
  const artist = metadata["artist-band"];
  const lead = [artist ? `by ${artist}` : "", title ? `titled ${quoted(title)}` : ""].filter(Boolean).join(", ");
  const missing = [!artist ? "a fictional artist or band name" : "", !title ? "a fictional album title" : ""].filter(Boolean);
  return [lead, missing.length ? `featuring ${joinedList(missing)}` : ""].filter(Boolean).join(", ");
}

function movieCoverText(metadata) {
  const fields = [
    ["movie-title", "a fictional movie title", (value) => `titled ${quoted(value)}`],
    ["tagline", "a fictional tagline", (value) => `with the tagline ${quoted(value)}`],
    ["starring-name", "a fictional starring name", (value) => `starring ${value}`],
  ];
  const supplied = fields.filter(([id]) => metadata[id]).map(([id, , format]) => format(metadata[id]));
  const missing = fields.filter(([id]) => !metadata[id]).map(([, fallback]) => fallback);
  return [...supplied, missing.length ? `featuring ${joinedList(missing)}` : ""].filter(Boolean).join(", ");
}

function magazineCoverText(metadata) {
  const name = metadata["magazine-name"];
  const headline = metadata["primary-headline"];
  const supplied = [name ? `with the masthead ${quoted(name)}` : "", headline ? `featuring the primary headline ${quoted(headline)}` : ""].filter(Boolean);
  const missing = [!name ? "a fictional magazine title" : "", !headline ? "fictional cover lines" : ""].filter(Boolean);
  return [...supplied, missing.length ? `featuring ${joinedList(missing)}` : ""].join(", ");
}

function coverText(typeId, metadata, styleId) {
  if (typeId === "novel") return novelCoverText(metadata, styleId === "romance");
  if (typeId === "album") return albumCoverText(metadata);
  if (typeId === "dvd" || typeId === "movie-poster") return movieCoverText(metadata);
  if (typeId === "magazine") return magazineCoverText(metadata);
  throw new Error(`Unknown Cover Type ${typeId}.`);
}

function coverFragments(selection) {
  if (!selection?.value) return Object.freeze([]);
  const type = selection.value.type?.value;
  if (!type) throw new Error("Covers requires a resolved Cover Type.");
  const style = selection.value.style?.value;
  const era = selection.value.era?.value;
  const presentation = style ? promptOf(style, "Cover Style") : promptOf(type, "Cover Type");
  const phrase = `${era ? `${promptOf(era, "Cover Era")} ` : ""}${presentation}`;
  const article = /^[aeiou]/iu.test(phrase) ? "an" : "a";
  const secondary = coverText(type.id, selection.value.metadata ?? {}, style?.id);
  const separator = secondary.startsWith("by ") ? " " : ", ";
  return Object.freeze([`Presented as ${article} ${phrase}${secondary ? `${separator}${secondary}` : ""}.`]);
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

  for (const omitted of selections.tattoos?.resolution?.omitted ?? []) {
    note("tattoos", `tattoos[${omitted.index}]`, "resolution-suppressed");
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

  if (selections.themes?.mode === "none") note("themes", "themes", "user-none");

  return Object.freeze(omissions);
}

export function buildPrompt(resolvedState) {
  if (!resolvedState || typeof resolvedState !== "object" || !resolvedState.selections || typeof resolvedState.selections !== "object") {
    throw new Error("Prompt Building requires a resolved generation state with selections.");
  }

  const selections = resolvedState.selections;
  if (!selections.character || typeof selections.character !== "object") throw new Error("Prompt Building requires resolved Character selections.");

  const sections = Object.freeze({
    aspectRatio: Object.freeze(selections.aspectRatio?.value ? [promptOf(selections.aspectRatio.value, "Aspect Ratio")] : []),
    character: buildCharacterFragments(selections.character),
    clothing: clothingFragments(selections.clothing),
    tattoos: tattooFragments(selections.tattoos),
    footwear: Object.freeze(selections.footwear?.value ? [promptOf(selections.footwear.value, "Footwear")] : []),
    accessories: accessoryFragments(selections.accessories),
    props: propFragments(selections.props),
    location: Object.freeze(selections.location?.value ? [promptOf(selections.location.value, "Location")] : []),
    atmosphere: atmosphereFragments(selections.atmosphere),
    timeOfDay: Object.freeze(selections.timeOfDay?.value ? [promptOf(selections.timeOfDay.value, "Time of Day")] : []),
    camera: cameraFragments(selections.camera),
    effects: configuredFragments(selections.effects, CATALOGS.effects, EFFECTS_CONFIG, "Effects"),
    themes: themeFragments(selections.themes),
    covers: coverFragments(selections.covers),
  });

  const fragments = Object.freeze(PROMPT_SECTION_ORDER.flatMap((section) => sections[section]));
  const normalPrompt = fragments.join(", ");
  return Object.freeze({
    sections,
    omissions: omissionStates(selections),
    fragments,
    prompt: sections.covers.length ? `${normalPrompt}.\n\n${sections.covers[0]}` : normalPrompt,
  });
}