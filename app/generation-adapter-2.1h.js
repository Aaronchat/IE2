import { prepareGeneration } from "../engine/generation/index.js";
import {
  createUiSeed,
  hasRandomControl,
  uiStateToGenerationControls as baseUiStateToGenerationControls,
} from "./generation-adapter.js";

function selectedValues(control) {
  if (!control) return [];
  if (Array.isArray(control.values)) return control.values;
  return control.value == null ? [] : [control.value];
}

function refOf(value) {
  if (value && typeof value === "object") return { id: value.value, ...(value.groupId ? { groupId: value.groupId } : {}) };
  return { id: value };
}

function adaptProps(source = {}) {
  const control = source["props.selection"];
  if (!control || control.mode === "unselected") return undefined;
  if (control.mode !== "manual") throw new Error(`Props does not support UI mode ${control.mode}.`);
  const selections = selectedValues(control).map(refOf);
  if (selections.length > 3) throw new Error("Props allows a maximum of 3 selections.");
  return selections.length ? { mode: "manual", selections } : undefined;
}

export function uiStateToGenerationControls(ui = {}) {
  const base = baseUiStateToGenerationControls(ui);
  const props = adaptProps(ui.props);
  return props ? { ...base, props } : base;
}

export { createUiSeed, hasRandomControl };

export function runUiGeneration({ uiState, randomState, createSeed = createUiSeed } = {}) {
  const controls = uiStateToGenerationControls(uiState);
  const random = { state: randomState };
  const seed = hasRandomControl(controls) ? createSeed() : null;
  if (seed != null) random.seed = seed;
  const result = prepareGeneration({ controls, random });
  return Object.freeze({ controls, seed, result, prompt: result.prompt.prompt });
}
