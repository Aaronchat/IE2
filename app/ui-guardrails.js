import { CHARACTER_NAMES } from "../data/character/names.js";

const PRIMARY_RANDOM_ID = "clothing.primary-random";
const PRIMARY_PAIR_IDS = Object.freeze([
  "clothing.tops.selection",
  "clothing.bottoms.selection",
]);
const PRIMARY_STANDALONE_IDS = Object.freeze([
  "clothing.dresses.selection",
  "clothing.one-piece.selection",
  "clothing.swimwear.selection",
  "clothing.sleepwear.selection",
  "clothing.packages.selection",
]);
const PRIMARY_IDS = Object.freeze([...PRIMARY_PAIR_IDS, ...PRIMARY_STANDALONE_IDS]);

const SPLIT_DOMAIN_ACTIONS = Object.freeze({
  footwear: "footwear.selection",
  accessories: "accessories.selection",
  location: "location.selection",
  atmosphere: "atmosphere.selection",
});

const GLOBAL_LIMITS = Object.freeze({
  accessories: 2,
  atmosphere: 2,
});

function stateEntry(state, id) {
  return state.get(id);
}

function clearEntry(state, id) {
  const current = stateEntry(state, id);
  if (!current) return false;
  const changed = current.mode !== "unselected" || current.values.length > 0;
  current.mode = "unselected";
  current.values = [];
  return changed;
}

function selectedCount(state, prefix, excludeId = null) {
  let count = 0;
  for (const [id, current] of state) {
    if (id === excludeId || !id.startsWith(`${prefix}.`) || current.mode !== "manual") continue;
    count += current.values.length;
  }
  return count;
}

function clearSplitDomainManualSelections(state, domain) {
  const actionId = SPLIT_DOMAIN_ACTIONS[domain];
  for (const id of state.keys()) {
    if (id !== actionId && id.startsWith(`${domain}.`)) clearEntry(state, id);
  }
}

function clearSplitDomainAction(state, domain) {
  clearEntry(state, SPLIT_DOMAIN_ACTIONS[domain]);
}

function clearPrimaryManualSelections(state) {
  for (const id of PRIMARY_IDS) clearEntry(state, id);
}

function clearConflictingPrimarySelections(state, controlId) {
  clearEntry(state, PRIMARY_RANDOM_ID);
  if (PRIMARY_PAIR_IDS.includes(controlId)) {
    for (const id of PRIMARY_STANDALONE_IDS) clearEntry(state, id);
    return;
  }
  if (PRIMARY_STANDALONE_IDS.includes(controlId)) {
    for (const id of PRIMARY_IDS) if (id !== controlId) clearEntry(state, id);
  }
}

function clearManualNameIfNeeded(state, ethnicityMode, ethnicityValue) {
  const name = stateEntry(state, "character.name");
  if (!name || name.mode !== "manual" || !name.values.length) return;
  if (ethnicityMode === "random") {
    clearEntry(state, "character.name");
    return;
  }
  const ethnicity = ethnicityValue ?? CHARACTER_NAMES.defaultEthnicity;
  const eligible = CHARACTER_NAMES.ethnicities.find((entry) => entry.name === ethnicity)?.names ?? [];
  const selectedName = name.values[0]?.value ?? name.values[0];
  if (!eligible.includes(selectedName)) clearEntry(state, "character.name");
}

export function applyModeGuardrails(state, controlId, mode) {
  if (controlId === PRIMARY_RANDOM_ID && mode === "random") clearPrimaryManualSelections(state);

  for (const [domain, actionId] of Object.entries(SPLIT_DOMAIN_ACTIONS)) {
    if (controlId !== actionId) continue;
    if (mode === "random" || mode === "none") clearSplitDomainManualSelections(state, domain);
  }

  if (controlId === "character.ethnicity") clearManualNameIfNeeded(state, mode, null);
}

export function applyManualGuardrails(state, controlId, selectedValue) {
  if (PRIMARY_IDS.includes(controlId)) clearConflictingPrimarySelections(state, controlId);

  for (const [domain, actionId] of Object.entries(SPLIT_DOMAIN_ACTIONS)) {
    if (controlId !== actionId && controlId.startsWith(`${domain}.`)) clearSplitDomainAction(state, domain);
  }

  if (controlId === "character.ethnicity") {
    const ethnicity = selectedValue?.value ?? selectedValue;
    clearManualNameIfNeeded(state, "manual", ethnicity);
  }
}

export function canAddManualSelection(state, controlId, selectedValue) {
  for (const [domain, max] of Object.entries(GLOBAL_LIMITS)) {
    const actionId = SPLIT_DOMAIN_ACTIONS[domain];
    if (controlId === actionId || !controlId.startsWith(`${domain}.`)) continue;
    const current = stateEntry(state, controlId);
    const value = selectedValue?.value ?? selectedValue;
    const alreadySelected = current?.values.some((entry) => (entry?.value ?? entry) === value);
    if (alreadySelected) return { allowed: true, message: "" };
    if (selectedCount(state, domain) >= max) {
      return { allowed: false, message: `${domain === "accessories" ? "Accessories" : "Atmosphere"} allows a maximum of ${max} selections.` };
    }
  }
  return { allowed: true, message: "" };
}

export function activeCharacterEthnicity(state) {
  const current = stateEntry(state, "character.ethnicity");
  if (!current || current.mode === "unselected" || current.mode === "default") return CHARACTER_NAMES.defaultEthnicity;
  if (current.mode === "random") return null;
  return current.values[0]?.value ?? current.values[0] ?? CHARACTER_NAMES.defaultEthnicity;
}

export function eligibleNameGroups(state, groupedOptions) {
  const ethnicity = activeCharacterEthnicity(state);
  if (ethnicity == null) return [];
  return groupedOptions.filter((group) => group.label === ethnicity);
}
