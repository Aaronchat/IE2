import { resolveAtmosphere } from "./atmosphere.js";
import { resolveCoverage } from "./coverage.js";
import { resolveTattoos } from "./tattoos.js";

export function resolveGeneration(selectionResult) {
  if (!selectionResult?.selections) throw new Error("Resolution requires a Selection result.");
  const selections = selectionResult.selections;
  const resolvedSelections = { ...selections };
  if (selections.atmosphere) resolvedSelections.atmosphere = resolveAtmosphere(selections.atmosphere, selections.location);
  const coverage = resolveCoverage(resolvedSelections);
  if (selections.tattoos) resolvedSelections.tattoos = resolveTattoos(selections.tattoos, coverage.tattooVisibility);
  return Object.freeze({
    selections: Object.freeze(resolvedSelections),
    randomState: selectionResult.randomState,
    ...coverage,
  });
}
