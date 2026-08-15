import { prepareGeneration } from "../engine/generation/index.js";

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
    if (id === "features") {
      if (control.mode !== "manual") throw new Error("Character Features supports manual selections only.");
      out.features = { mode: "manual", values: selectedValues(control).map((value) => value?.value ?? value) };
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

function adaptClothing(ui) {
  const source = ui.clothing ?? {};
  const out = {};
  const primaryRandom = entry(source, "clothing.primary-random")?.mode === "random";
  const primaryIds = [
    "clothing.tops.selection", "clothing.bottoms.selection", "clothing.dresses.selection",
    "clothing.one-piece.selection", "clothing.swimwear.selection", "clothing.sleepwear.selection",
    "clothing.packages.selection",
  ];
  const manual = primaryIds.filter((id) => entry(source, id)?.mode === "manual" && selectedValues(entry(source, id)).length);
  if (primaryRandom && manual.length) throw new Error("Primary Outfit Random cannot be combined with a manual primary clothing selection.");

  if (primaryRandom) {
    out.primary = { mode: "random" };
  } else if (manual.length) {
    const top = entry(source, "clothing.tops.selection");
    const bottom = entry(source, "clothing.bottoms.selection");
    const hasTop = top?.mode === "manual" && selectedValues(top).length;
    const hasBottom = bottom?.mode === "manual" && selectedValues(bottom).length;
    const standalone = [
      ["clothing.dresses.selection", "dress"],
      ["clothing.one-piece.selection", "one-piece"],
      ["clothing.swimwear.selection", "swimwear"],
      ["clothing.sleepwear.selection", "sleepwear"],
      ["clothing.packages.selection", "package"],
    ].filter(([id]) => entry(source, id)?.mode === "manual" && selectedValues(entry(source, id)).length);

    if (hasTop !== hasBottom) throw new Error("A Built Outfit using Tops/Bottoms requires both a Top and a Bottom.");
    const structures = (hasTop && hasBottom ? 1 : 0) + standalone.length;
    if (structures !== 1) throw new Error("Choose only one primary clothing structure or Package at a time.");

    if (hasTop && hasBottom) {
      out.primary = {
        mode: "manual", path: "built-outfit", structure: "top-bottom",
        outfit: { top: manualRef(top, "Top"), bottom: manualRef(bottom, "Bottom") },
      };
    } else {
      const [id, structure] = standalone[0];
      const ref = manualRef(entry(source, id), structure);
      if (structure === "package") out.primary = { mode: "manual", path: "package", ...ref };
      else out.primary = { mode: "manual", path: "built-outfit", structure, outfit: structure === "swimwear" ? [ref] : ref };
    }
  }

  for (const [uiId, engineId] of [
    ["clothing.outerwear.selection", "outerwear"],
    ["clothing.hosiery.selection", "hosiery"],
    ["clothing.lingerie.selection", "lingerie"],
  ]) {
    const control = entry(source, uiId);
    if (!control || control.mode === "unselected") continue;
    if (control.mode === "random") out[engineId] = { mode: "random" };
    else if (control.mode === "manual") out[engineId] = { mode: "manual", ...manualRef(control, engineId) };
    else throw new Error(`${engineId} does not support UI mode ${control.mode}.`);
  }
  return out;
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
  if (control.mode === "manual") return { mode: "manual", ...manualRef(control, "Time of Day") };
  throw new Error(`Time of Day does not support UI mode ${control.mode}.`);
}

function adaptConfigured(source = {}, prefix) {
  const out = {};
  for (const [fullId, control] of Object.entries(source)) {
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

export function uiStateToGenerationControls(ui = {}) {
  const controls = {};
  const character = adaptCharacter(ui); if (Object.keys(character).length) controls.character = character;
  const clothing = adaptClothing(ui); if (Object.keys(clothing).length) controls.clothing = clothing;
  const footwear = adaptSingleSplitDomain(ui.footwear, "footwear.selection", "Footwear"); if (footwear) controls.footwear = footwear;
  const accessories = adaptAccessories(ui.accessories); if (accessories) controls.accessories = accessories;
  const location = adaptSingleSplitDomain(ui.location, "location.selection", "Location"); if (location) controls.location = location;
  const atmosphere = adaptAtmosphere(ui.atmosphere); if (atmosphere) controls.atmosphere = atmosphere;
  const timeOfDay = adaptTimeOfDay(ui["time-of-day"]); if (timeOfDay) controls.timeOfDay = timeOfDay;
  const camera = adaptConfigured(ui.camera, "camera"); if (Object.keys(camera).length) controls.camera = camera;
  const effects = adaptConfigured(ui.effects, "effects"); if (Object.keys(effects).length) controls.effects = effects;
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
