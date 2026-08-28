import { prepareGeneration } from "../engine/generation/index.js";
import {
  createUiSeed,
  hasRandomControl,
  uiStateToGenerationControls as baseUiStateToGenerationControls,
} from "./generation-adapter-2.1h.js";

const CONFIGURATION_PREFIX = "ie2.configuration.v1.";
const LOCATION_RANDOM_VARIANTS = Object.freeze({
  "random-indoor": "indoor",
  "random-outdoor": "outdoor",
});

function selectedValues(control) {
  if (!control) return [];
  if (Array.isArray(control.values)) return control.values;
  return control.value == null ? [] : [control.value];
}

function selectedValue(control) {
  const value = selectedValues(control)[0];
  return value && typeof value === "object" ? value.value : value;
}

function sanitizedUiForBase(ui = {}) {
  const character = { ...(ui.character ?? {}) };
  for (const id of ["character.skin-condition", "character.features"]) {
    if (character[id]?.mode === "random") character[id] = { mode: "unselected", values: [] };
  }

  const props = { ...(ui.props ?? {}) };
  if (props["props.selection"]?.mode === "random") props["props.selection"] = { mode: "unselected", values: [] };

  const location = { ...(ui.location ?? {}) };
  const locationAction = location["location.selection"];
  if (locationAction?.mode === "manual" && LOCATION_RANDOM_VARIANTS[selectedValue(locationAction)]) {
    location["location.selection"] = { mode: "unselected", value: null };
  }

  return { ...ui, character, props, location };
}

function adaptLocationRandomVariant(source = {}) {
  const action = source["location.selection"];
  if (action?.mode !== "manual") return null;
  const environment = LOCATION_RANDOM_VARIANTS[selectedValue(action)];
  if (!environment) return null;

  const manualLocations = Object.entries(source).filter(([id, control]) => (
    id !== "location.selection" && control?.mode === "manual" && selectedValues(control).length
  ));
  if (manualLocations.length) throw new Error("Random Indoor / Random Outdoor cannot be combined with a manual Location.");
  return { mode: "random", environment };
}

export function uiStateToGenerationControls(ui = {}) {
  const base = baseUiStateToGenerationControls(sanitizedUiForBase(ui));
  const controls = { ...base };

  const character = { ...(controls.character ?? {}) };
  if (ui.character?.["character.skin-condition"]?.mode === "random") character["skin-condition"] = { mode: "random" };
  if (ui.character?.["character.features"]?.mode === "random") character.features = { mode: "random" };
  if (Object.keys(character).length) controls.character = character;

  if (ui.props?.["props.selection"]?.mode === "random") controls.props = { mode: "random" };

  const locationVariant = adaptLocationRandomVariant(ui.location);
  if (locationVariant) controls.location = locationVariant;

  return controls;
}

function fnv1a32(text) {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

function codeFromText(text) {
  return String(fnv1a32(text)).padStart(10, "0");
}

function storageKey(code) {
  return `${CONFIGURATION_PREFIX}${code}`;
}

function normalizedCode(value) {
  if (value == null) return "";
  const code = String(value).trim();
  if (!code) return "";
  if (!/^\d{10}$/u.test(code)) throw new Error("Configuration Code must be exactly 10 digits.");
  return code;
}

function requestedCodeFromPage() {
  if (typeof document === "undefined") return "";
  return document.querySelector("#configuration-code-input")?.value ?? "";
}

function storeConfiguration(payload, storage) {
  const serialized = JSON.stringify(payload);
  let attempt = 0;
  while (attempt < 100) {
    const code = codeFromText(attempt === 0 ? serialized : `${serialized}|${attempt}`);
    if (!storage?.getItem || !storage?.setItem) return code;
    const key = storageKey(code);
    const existing = storage.getItem(key);
    if (existing == null || existing === serialized) {
      storage.setItem(key, serialized);
      return code;
    }
    attempt += 1;
  }
  throw new Error("Could not allocate a Configuration Code.");
}

function loadConfiguration(code, storage) {
  if (!storage?.getItem) throw new Error("Configuration Codes are not available in this browser.");
  const serialized = storage.getItem(storageKey(code));
  if (!serialized) throw new Error(`Configuration Code ${code} is not saved in this browser.`);
  try {
    const payload = JSON.parse(serialized);
    if (!payload || payload.version !== 1 || typeof payload.prompt !== "string") throw new Error("invalid");
    return payload;
  } catch {
    throw new Error(`Configuration Code ${code} is damaged and cannot be loaded.`);
  }
}

export function createConfigurationCode(payload, storage = globalThis.localStorage) {
  return storeConfiguration(payload, storage);
}

export { createUiSeed, hasRandomControl };

export function runUiGeneration({
  uiState,
  randomState,
  createSeed = createUiSeed,
  configurationCode = null,
  storage = globalThis.localStorage,
} = {}) {
  globalThis.__IE2_LAST_CONFIGURATION_CODE = null;
  globalThis.__IE2_CONFIGURATION_REPLAYED = false;

  const requested = normalizedCode(configurationCode ?? requestedCodeFromPage());
  if (requested) {
    const saved = loadConfiguration(requested, storage);
    globalThis.__IE2_LAST_CONFIGURATION_CODE = requested;
    globalThis.__IE2_CONFIGURATION_REPLAYED = true;
    return Object.freeze({
      controls: saved.controls ?? {},
      seed: saved.seed ?? null,
      result: null,
      prompt: saved.prompt,
      configurationCode: requested,
      replayed: true,
    });
  }

  const controls = uiStateToGenerationControls(uiState);
  const random = { state: randomState };
  const seed = hasRandomControl(controls) ? createSeed() : null;
  if (seed != null) random.seed = seed;
  const result = prepareGeneration({ controls, random });
  const prompt = result.prompt.prompt;
  const payload = Object.freeze({ version: 1, uiState, controls, seed, prompt });
  const code = storeConfiguration(payload, storage);
  globalThis.__IE2_LAST_CONFIGURATION_CODE = code;

  return Object.freeze({ controls, seed, result, prompt, configurationCode: code, replayed: false });
}
