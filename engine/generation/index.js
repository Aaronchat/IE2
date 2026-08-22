import { selectGeneration } from "../selection/index.js";
import { resolveGeneration } from "../resolution/index.js";
import { buildPromptWithProps } from "../prompt-building/with-props.js";

/**
 * Runs one complete Infinite Engine prompt generation.
 *
 * RandomRuntimeState remains caller-owned and explicit. Recovery advances only
 * after Selection, Resolution, and Prompt Building all succeed.
 */
export function prepareGeneration({ controls = {}, random = {} } = {}) {
  const selection = selectGeneration({ controls, random });
  const resolved = resolveGeneration(selection);
  const prompt = buildPromptWithProps(resolved);

  selection.randomState.completeGeneration();

  return Object.freeze({
    selection,
    resolved,
    prompt,
    randomState: selection.randomState,
  });
}
