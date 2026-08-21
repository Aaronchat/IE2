import { prepareGeneration } from "../engine/generation/index.js";
import { SWIMWEAR_CATALOG_GROUPS } from "../engine/selection/random/clothing.js";
import { TIME_OF_DAY_CONFIG } from "../data/time-of-day/config.js";

function entry(category, id) {
  return category?.[id];
}

function selectedValues(control) {
  if (!control) return [];
  if (Array.isArray(control.values)) return control.values;
  return control.value == null ? [] : [control.value];
}

function refOf(value) {
  if (value && typeof value === "object") return { id: value.value, ...(value.groupId ? { groupId: value.groupId } : {}) };
  return { id: value };
}

function manualRef(control, label) {
  const values = selectedValues(control);
  if (control?.mode !== "manual" || values.length !== 1) throw new Error(`${label} requires exactly one manual selection.`);
  return refOf(values[0]);
}

function activeManualEntries(category, { exclude = [] } = {}) {
  const ignored = new Set(exclude);
  return Object.entries(category ?? {}).filter(([id, control]) => !ignored.has(id) && control?.mode === "manual" && selectedValues(control).length);
}

function adaptCharacter(ui) {
  const source = ui.character ?? {};
  const out = {};
  for (const [fullId, control] of Object.entries(source)) {
    if (!control || control.mode === "unselected") continue;
    const id = fullId.replace(/^character\./u, "");
    if (id === "features" || id === "skin-condition") {
      if (control.mode !== "manual") throw new Error(`Character ${id} supports manual selections only.`);
      out[id] = { mode: "manual", values: selectedValues(control).map((value) => value?.value ?? value) };
      continue;
    }
    if (control.mode === "default" || control.mode === "random") {
      out[id] = { mode: control.mode };
      continue;
    }
    if (control.mode === "manual") {
      const value = selectedValues(control)[0];
      if (value == null) throw new Error(`Character ${id} requires a selected value.`);
      out[id] = { mode: "manual", value: value?.value ?? value };
      continue;
    }
    throw new Error(`Unsupported Character UI mode ${control.mode}.`);
  }
  return out;
}

function adaptTattoos(items = []) {
  if (!Array.isArray(items)) {
    if (items?.mode === "random") return { mode: "random" };
    throw new Error("Tattoos UI state must be an array or Random mode.");
  }
  return items.map((item, index) => {
    if (!item || typeof item !== "object" || Array.isArray(item)) throw new Error(`Tattoo ${index + 1} UI state must be an object.`);
    const design = item.design;
    if (!design || typeof design !== "object" || Array.isArray(design)) throw new Error(`Tattoo ${index + 1} requires a Design.`);
    if (design.mode === "specific") {
      const text = typeof design.text === "string" ? design.text.replace(/\s+/gu, " ").trim() : design.text;
      return { placementId: item.placementId, patternId: item.patternId, design: { mode: "specific", text } };
    }
    if (design.mode === "generic") return { placementId: item.placementId, patternId: item.patternId, design: { mode: "generic", styleId: design.styleId } };
    throw new Error(`Tattoo ${index + 1} Design must be Generic or Specific.`);
  });
}

function clothingSectionState(source, sectionId, label) {
  const actionId = `${sectionId}.selection`;
  const action = entry(source, actionId);
  const manual = Object.entries(source).filter(([id, control]) => (
    id !== actionId && id.startsWith(`${sectionId}.`) && !id.startsWith(`${sectionId}.advanced.`) && control?.mode === "manual" && selectedValues(control).length
  ));
  if ((action?.mode === "random" || action?.mode === "none") && manual.length) {
    throw new Error(`${label} ${action.mode === "random" ? "Random" : "None"} cannot be combined with a manual ${label} selection.`);
  }
  if (manual.length > 1) throw new Error(`Choose only one ${label} selection at a time.`);
  if (manual.length === 1) return { mode: "manual", ...manualRef(manual[0][1], label) };
  if (action?.mode === "random" || action?.mode === "none") return { mode: action.mode };
  return { mode: "unselected" };
}

function swimwearSlot(ref) {
  const group = SWIMWEAR_CATALOG_GROUPS.find((entry) => entry.id === ref.groupId);
  const record = group?.items.find((entry) => entry.id === ref.id);
  return record?.slot ?? group?.defaults?.slot ?? null;
}

function swimwearSectionState(source) {
  const sectionId = "clothing.swimwear";
  const actionId = `${sectionId}.selection`;
  const action = entry(source, actionId);
  const manual = Object.entries(source).filter(([id, control]) => (
    id !== actionId && id.startsWith(`${sectionId}.`) && !id.startsWith(`${sectionId}.advanced.`) && control?.mode === "manual" && selectedValues(control).length
  ));
  if ((action?.mode === "random" || action?.mode === "none") && manual.length) {
    throw new Error(`Swimwear ${action.mode === "random" ? "Random" : "None"} cannot be combined with manual Swimwear selections.`);
  }
  const refs = manual.map(([, control]) => manualRef(control, "Swimwear"));
  if (refs.length > 2) throw new Error("Swimwear allows a maximum of one top and one bottom.");
  const slots = refs.map(swimwearSlot);
  if (slots.some((slot) => !slot)) throw new Error("Every manual Swimwear selection requires an approved assembly slot.");
  if (slots.includes("one-piece") && refs.length > 1) throw new Error("One-piece Swimwear cannot be combined with another Swimwear selection.");
  if (slots.length === 2 && slots[0] === slots[1]) throw new Error(`Choose only one Swimwear ${slots[0]} at a time.`);
  if (refs.length) return { mode: "manual", refs };
  if (action?.mode === "random" || action?.mode === "none") return { mode: action.mode };
  return { mode: "unselected" };
}

const CLOTHING_DETAIL_IDS = Object.freeze({
  tops: ["color", "fabric", "condition", "graphic"],
  bottoms: ["condition"],
  dresses: ["condition"],
  "one-piece": ["condition"],
  swimwear: ["condition"],
  sleepwear: ["condition"],
  outerwear: ["condition"],
  hosiery: ["condition"],
  lingerie: ["condition"],
});

function clothingDetailStates(source, section, ids) {
  const details = {};
  for (const id of ids) {
    const control = entry(source, `clothing.${section}.advanced.${id}`);
    if (!control || control.mode === "unselected" || control.mode === "none") continue;
    if (control.mode === "random") {
      details[id] = { mode: "random" };
      continue;
    }
    if (control.mode === "manual") {
      details[id] = { mode: "manual", id: selectedValues(control)[0]?.value ?? selectedValues(control)[0] };
      continue;
    }
    throw new Error(`${section} ${id} does not support UI mode ${control.mode}.`);
  }
  return details;
}

function isActiveClothingState(state) {
  return state?.mode === "manual" || state?.mode === "random";
}

function adaptClothing(ui) {
  const source = ui.clothing ?? {};
  const out = {};
  const provocativeControl = entry(source, "clothing.provocative");
  if (provocativeControl && !["unselected", "none", "manual"].includes(provocativeControl.mode)) {
    throw new Error(`Clothing Provocative does not support UI mode ${provocativeControl.mode}.`);
  }
  if (provocativeControl?.mode === "manual" && selectedValues(provocativeControl).includes("on")) out.provocative = true;

  const primaryRandom = entry(source, "clothing.primary-random")?.mode === "random";
  const slots = {
    top: clothingSectionState(source, "clothing.tops", "Tops"),
    bottom: clothingSectionState(source, "clothing.bottoms", "Bottoms"),
  };
  const swimwear = swimwearSectionState(source);
  const manualSwimwear = swimwear.mode === "manual"
    ? Object.fromEntries(swimwear.refs.map((ref) => [swimwearSlot(ref), ref]))
    : {};
  const swimwearOnePiece = manualSwimwear["one-piece"] ?? null;
  const details = Object.fromEntries(Object.entries(CLOTHING_DETAIL_IDS)
    .map(([section, ids]) => [section, clothingDetailStates(source, section, ids)])
    .filter(([, values]) => Object.keys(values).length));
  const standalone = [
    ["clothing.dresses", "dresses", "dress", "Dresses", clothingSectionState(source, "clothing.dresses", "Dresses")],
    ["clothing.one-piece", "one-piece", "one-piece", "One-Piece", clothingSectionState(source, "clothing.one-piece", "One-Piece")],
    ["clothing.sleepwear", "sleepwear", "sleepwear", "Sleepwear", clothingSectionState(source, "clothing.sleepwear", "Sleepwear")],
    ["clothing.packages", "packages", "package", "Packages", clothingSectionState(source, "clothing.packages", "Packages")],
  ].map(([sectionId, detailKey, structure, label, state]) => ({ sectionId, detailKey, structure, label, state }));

  const extras = Object.fromEntries([
    ["outerwear", "Outerwear"],
    ["hosiery", "Hosiery"],
    ["lingerie", "Lingerie"],
  ].map(([key, label]) => [key, clothingSectionState(source, `clothing.${key}`, label)]));

  if (manualSwimwear.top) {
    if (isActiveClothingState(slots.top)) throw new Error("Choose only one top slot garment at a time.");
    slots.top = { mode: "manual", ...manualSwimwear.top };
  }
  if (manualSwimwear.bottom) {
    if (isActiveClothingState(slots.bottom)) throw new Error("Choose only one bottom slot garment at a time.");
    slots.bottom = { mode: "manual", ...manualSwimwear.bottom };
  }

  const activePair = Object.values(slots).some(isActiveClothingState);
  const activeStandalone = standalone.filter(({ state }) => isActiveClothingState(state));
  const activeSwimwearStandalone = swimwear.mode === "random" || Boolean(swimwearOnePiece);
  const stateByDetailKey = {
    tops: slots.top,
    bottoms: slots.bottom,
    swimwear,
    ...Object.fromEntries(standalone.map(({ detailKey, state }) => [detailKey, state])),
    ...extras,
  };
  for (const section of Object.keys(details)) {
    if (primaryRandom || !isActiveClothingState(stateByDetailKey[section])) {
      throw new Error(`${section} Advanced details require a selected or Random ${section} garment.`);
    }
  }
  if (primaryRandom && (activePair || activeStandalone.length || activeSwimwearStandalone)) {
    throw new Error("Primary Outfit Random cannot be combined with another active primary clothing selection.");
  }
  if (activePair && (activeStandalone.length || activeSwimwearStandalone)) throw new Error("Choose only one primary clothing structure or Package at a time.");
  if (activeStandalone.length + Number(activeSwimwearStandalone) > 1) throw new Error("Choose only one primary clothing structure or Package at a time.");

  if (primaryRandom) {
    out.primary = { mode: "random" };
  } else if (activePair) {
    out.primary = {
      mode: "manual",
      path: "built-outfit",
      structure: "top-bottom",
      outfit: { top: slots.top, bottom: slots.bottom },
    };
  } else if (activeSwimwearStandalone) {
    out.primary = {
      mode: "manual",
      path: "built-outfit",
      structure: "swimwear",
      outfit: swimwear.mode === "random" ? swimwear : [swimwearOnePiece],
    };
  } else if (activeStandalone.length === 1) {
    const { structure, state } = activeStandalone[0];
    if (structure === "package") {
      out.primary = state.mode === "random"
        ? { mode: "manual", path: "package", selection: { mode: "random" } }
        : { mode: "manual", path: "package", selection: state };
    } else {
      out.primary = {
        mode: "manual",
        path: "built-outfit",
        structure,
        outfit: state,
      };
    }
  }

  for (const [engineId, selected] of Object.entries(extras)) {
    if (selected.mode === "unselected") continue;
    out[engineId] = selected;
  }
  if (Object.keys(details).length) out.details = details;
  return out;
}

function adaptAspectRatio(source = {}) {
  const control = entry(source, "aspect-ratio.selection");
  if (!control || control.mode === "unselected") return undefined;
  if (control.mode === "manual") return { mode: "manual", ...manualRef(control, "Aspect Ratio") };
  throw new Error(`Aspect Ratio does not support UI mode ${control.mode}.`);
}

function adaptSingleSplitDomain(source, actionId, label) {
  const action = entry(source, actionId);
  const manual = activeManualEntries(source, { exclude: [actionId] });
  if (action?.mode === "random") {
    if (manual.length) throw new Error(`${label} Random cannot be combined with a manual ${label} selection.`);
    return { mode: "random" };
  }
  if (manual.length > 1) throw new Error(`Choose only one ${label} selection at a time.`);
  if (!manual.length) return undefined;
  return { mode: "manual", ...manualRef(manual[0][1], label) };
}

function adaptAccessories(source = {}) {
  const action = entry(source, "accessories.selection");
  const manual = activeManualEntries(source, { exclude: ["accessories.selection"] });
  if (action?.mode === "random") {
    if (manual.length) throw new Error("Accessories Random cannot be combined with manual Accessories.");
    return { mode: "random" };
  }
  const selections = manual.flatMap(([, control]) => selectedValues(control).map(refOf));
  if (selections.length > 2) throw new Error("Accessories allows a maximum of 2 selections.");
  return selections.length ? { mode: "manual", selections } : undefined;
}

function adaptAtmosphere(source = {}) {
  const action = entry(source, "atmosphere.selection");
  const manual = activeManualEntries(source, { exclude: ["atmosphere.selection"] });
  const ids = manual.flatMap(([, control]) => selectedValues(control).map((value) => value?.value ?? value));
  if ((action?.mode === "random" || action?.mode === "none") && ids.length) throw new Error("Atmosphere Random/None cannot be combined with manual Atmosphere selections.");
  if (action?.mode === "random") return { mode: "random" };
  if (action?.mode === "none") return { mode: "none" };
  if (ids.length > 2) throw new Error("Atmosphere allows a maximum of 2 selections.");
  return ids.length ? { mode: "manual", ids } : undefined;
}

function adaptTimeOfDay(source = {}) {
  const control = entry(source, "time-of-day.selection");
  if (!control || control.mode === "unselected") return undefined;
  if (control.mode === "random" || control.mode === "none") return { mode: control.mode };
  if (control.mode === "manual") {
    const selected = selectedValues(control);
    if (selected.length === 1) {
      const value = selected[0]?.value ?? selected[0];
      const variant = TIME_OF_DAY_CONFIG.randomVariants.find((entry) => entry.uiValue === value);
      if (variant) return { mode: "random", bucket: variant.id };
    }
    return { mode: "manual", ...manualRef(control, "Time of Day") };
  }
  throw new Error(`Time of Day does not support UI mode ${control.mode}.`);
}

function adaptConfigured(source = {}, prefix) {
  const out = {};
  for (const [fullId, control] of Object.entries(source)) {
    if (!fullId.startsWith(`${prefix}.`)) continue;
    if (!control || control.mode === "unselected") continue;
    const id = fullId.replace(new RegExp(`^${prefix}\\.`), "");
    if (control.mode === "default" || control.mode === "none") {
      out[id] = { mode: control.mode };
      continue;
    }
    if (control.mode !== "manual") throw new Error(`${prefix} ${id} does not support UI mode ${control.mode}.`);
    const values = selectedValues(control);
    if (values.length > 1) out[id] = { mode: "manual", ids: values.map((value) => value?.value ?? value) };
    else out[id] = { mode: "manual", id: values[0]?.value ?? values[0] };
  }
  return out;
}

function adaptCamera(source = {}) {
  const filtered = Object.fromEntries(Object.entries(source).filter(([id]) => id !== "camera.custom-pov"));
  const out = adaptConfigured(filtered, "camera");
  const custom = entry(source, "camera.custom-pov");
  if (!custom || custom.mode === "unselected") return out;
  if (custom.mode !== "manual") throw new Error(`Camera Custom POV does not support UI mode ${custom.mode}.`);
  if (out["viewer-pov"]?.mode === "manual") throw new Error("Choose either a preset Viewer POV or Custom POV, not both.");
  const value = selectedValues(custom)[0];
  if (typeof value !== "string") throw new Error("Custom POV must be text.");
  const cleaned = value.replace(/\s+/gu, " ").trim();
  if (!cleaned) throw new Error("Custom POV cannot be blank.");
  out["custom-pov"] = { mode: "manual", text: cleaned };
  return out;
}

function adaptThemes(source = {}) {
  const action = entry(source, "themes.selection");
  const manual = activeManualEntries(source, { exclude: ["themes.selection"] });
  const selections = manual.flatMap(([, control]) => selectedValues(control).map(refOf));
  if ((action?.mode === "random" || action?.mode === "none") && selections.length) {
    throw new Error("Themes Random/None cannot be combined with manual Themes.");
  }
  if (action?.mode === "random" || action?.mode === "none") return { mode: action.mode };
  if (selections.length > 3) throw new Error("Themes allows a maximum of 3 selections.");
  return selections.length ? { mode: "manual", selections } : undefined;
}

function adaptCovers(source = {}) {
  const typeControl = entry(source, "covers.type");
  const styleControl = entry(source, "covers.style");
  const eraControl = entry(source, "covers.era");
  const metadataEntries = Object.entries(source).filter(([id, control]) => (
    id.startsWith("covers.metadata.") && control?.mode === "manual" && selectedValues(control).length
  ));
  const subordinateActive = [styleControl, eraControl].some((control) => control && !["unselected", "none"].includes(control.mode)) || metadataEntries.length;

  if (!typeControl || typeControl.mode === "unselected") {
    if (subordinateActive) throw new Error("Covers Style, Era, and text require a Cover Type.");
    return undefined;
  }
  if (!["manual", "random"].includes(typeControl.mode)) throw new Error(`Cover Type does not support UI mode ${typeControl.mode}.`);

  const type = typeControl.mode === "random" ? { mode: "random" } : { mode: "manual", ...manualRef(typeControl, "Cover Type") };
  const out = { type };

  if (styleControl && styleControl.mode !== "unselected") {
    if (type.mode === "random") throw new Error("Random Cover Type resolves its contextual Style automatically.");
    if (styleControl.mode === "random") out.style = { mode: "random" };
    else if (styleControl.mode === "manual") out.style = { mode: "manual", ...manualRef(styleControl, "Cover Style") };
    else throw new Error(`Cover Style does not support UI mode ${styleControl.mode}.`);
  }

  if (eraControl && eraControl.mode !== "unselected") {
    if (eraControl.mode === "random" || eraControl.mode === "none") out.era = { mode: eraControl.mode };
    else if (eraControl.mode === "manual") out.era = { mode: "manual", ...manualRef(eraControl, "Cover Era") };
    else throw new Error(`Cover Era does not support UI mode ${eraControl.mode}.`);
  }

  if (metadataEntries.length) {
    if (type.mode === "random") throw new Error("Manual Covers text requires an explicit Cover Type.");
    const metadata = {};
    for (const [id, control] of metadataEntries) {
      const [, , typeId, fieldId] = id.split(".");
      if (typeId !== type.id) throw new Error(`Covers text for ${typeId} cannot be used with ${type.id}.`);
      const value = selectedValues(control)[0];
      if (typeof value !== "string") throw new Error(`${fieldId} must be text.`);
      const cleaned = value.replace(/\s+/gu, " ").trim();
      if (cleaned) metadata[fieldId] = cleaned;
    }
    if (Object.keys(metadata).length) out.metadata = metadata;
  }

  return out;
}

export function uiStateToGenerationControls(ui = {}) {
  const controls = {};
  const aspectRatio = adaptAspectRatio(ui["aspect-ratio"]); if (aspectRatio) controls.aspectRatio = aspectRatio;
  const character = adaptCharacter(ui); if (Object.keys(character).length) controls.character = character;
  const tattoos = adaptTattoos(ui.tattoos ?? []); if (Array.isArray(tattoos) ? tattoos.length : tattoos) controls.tattoos = tattoos;
  const clothing = adaptClothing(ui); if (Object.keys(clothing).length) controls.clothing = clothing;
  const footwear = adaptSingleSplitDomain(ui.footwear, "footwear.selection", "Footwear"); if (footwear) controls.footwear = footwear;
  const accessories = adaptAccessories(ui.accessories); if (accessories) controls.accessories = accessories;
  const location = adaptSingleSplitDomain(ui.location, "location.selection", "Location"); if (location) controls.location = location;
  const atmosphere = adaptAtmosphere(ui.atmosphere); if (atmosphere) controls.atmosphere = atmosphere;
  const timeOfDay = adaptTimeOfDay(ui["time-of-day"]); if (timeOfDay) controls.timeOfDay = timeOfDay;
  const camera = adaptCamera(ui.camera); if (Object.keys(camera).length) controls.camera = camera;
  const effects = adaptConfigured({ ...(ui.effects ?? {}), ...(ui.camera ?? {}) }, "effects"); if (Object.keys(effects).length) controls.effects = effects;
  const themes = adaptThemes(ui.themes); if (themes) controls.themes = themes;
  const covers = adaptCovers(ui.covers); if (covers) controls.covers = covers;
  return controls;
}

export function hasRandomControl(value) {
  if (!value || typeof value !== "object") return false;
  if (value.mode === "random") return true;
  return Object.values(value).some(hasRandomControl);
}

export function createUiSeed(cryptoObject = globalThis.crypto) {
  if (!cryptoObject?.getRandomValues) throw new Error("This browser cannot create a Random seed.");
  const values = new Uint32Array(1);
  cryptoObject.getRandomValues(values);
  return values[0];
}

export function runUiGeneration({ uiState, randomState, createSeed = createUiSeed } = {}) {
  const controls = uiStateToGenerationControls(uiState);
  const random = { state: randomState };
  const seed = hasRandomControl(controls) ? createSeed() : null;
  if (seed != null) random.seed = seed;
  const result = prepareGeneration({ controls, random });
  return Object.freeze({ controls, seed, result, prompt: result.prompt.prompt });
}
