import { CHARACTER_NAMES } from "../data/character/names.js";

const PRIMARY_RANDOM_ID = "clothing.primary-random";
const PRIMARY_PAIR_SECTIONS = Object.freeze(["clothing.tops", "clothing.bottoms"]);
const PRIMARY_STANDALONE_SECTIONS = Object.freeze([
  "clothing.dresses",
  "clothing.one-piece",
  "clothing.swimwear",
  "clothing.sleepwear",
  "clothing.packages",
]);
const PRIMARY_SECTIONS = Object.freeze([...PRIMARY_PAIR_SECTIONS, ...PRIMARY_STANDALONE_SECTIONS]);

const SPLIT_DOMAIN_ACTIONS = Object.freeze({
  footwear: "footwear.selection",
  accessories: "accessories.selection",
  location: "location.selection",
  atmosphere: "atmosphere.selection",
  themes: "themes.selection",
});

const GLOBAL_LIMITS = Object.freeze({
  accessories: 2,
  atmosphere: 2,
  themes: 3,
});

const DOMAIN_LABELS = Object.freeze({
  accessories: "Accessories",
  atmosphere: "Atmosphere",
  themes: "Themes",
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

function clearPrefix(state, prefix, { except = [] } = {}) {
  const keep = new Set(except);
  for (const id of state.keys()) if (id.startsWith(`${prefix}.`) && !keep.has(id)) clearEntry(state, id);
}

function clothingSectionFor(controlId) {
  return [
    ...PRIMARY_SECTIONS,
    "clothing.outerwear",
    "clothing.hosiery",
    "clothing.lingerie",
  ].find((prefix) => controlId === `${prefix}.selection` || controlId.startsWith(`${prefix}.`)) ?? null;
}

function clothingActionId(sectionId) {
  return `${sectionId}.selection`;
}

function clearClothingSection(state, sectionId, { preserveAction = false } = {}) {
  const actionId = clothingActionId(sectionId);
  clearPrefix(state, sectionId, { except: preserveAction ? [actionId] : [] });
  if (!preserveAction) clearEntry(state, actionId);
}

function clearPrimarySelections(state) {
  for (const sectionId of PRIMARY_SECTIONS) clearClothingSection(state, sectionId);
}

function clearConflictingPrimarySections(state, sectionId) {
  clearEntry(state, PRIMARY_RANDOM_ID);
  if (PRIMARY_PAIR_SECTIONS.includes(sectionId)) {
    for (const other of PRIMARY_STANDALONE_SECTIONS) clearClothingSection(state, other);
    return;
  }
  if (PRIMARY_STANDALONE_SECTIONS.includes(sectionId)) {
    for (const other of PRIMARY_SECTIONS) if (other !== sectionId) clearClothingSection(state, other);
  }
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
  if (controlId === PRIMARY_RANDOM_ID && mode === "random") clearPrimarySelections(state);

  const clothingSection = clothingSectionFor(controlId);
  if (clothingSection && controlId === clothingActionId(clothingSection)) {
    clearClothingSection(state, clothingSection, { preserveAction: true });
    if (mode === "random" && PRIMARY_SECTIONS.includes(clothingSection)) clearConflictingPrimarySections(state, clothingSection);
  }

  for (const [domain, actionId] of Object.entries(SPLIT_DOMAIN_ACTIONS)) {
    if (controlId !== actionId) continue;
    if (mode === "random" || mode === "none") clearSplitDomainManualSelections(state, domain);
  }

  if (controlId === "character.ethnicity") clearManualNameIfNeeded(state, mode, null);
}

export function applyManualGuardrails(state, controlId, selectedValue) {
  const clothingSection = clothingSectionFor(controlId);
  if (clothingSection && controlId !== clothingActionId(clothingSection) && !controlId.startsWith(`${clothingSection}.advanced.`)) {
    clearEntry(state, clothingActionId(clothingSection));
    const advancedIds = [...state.keys()].filter((id) => id.startsWith(`${clothingSection}.advanced.`));
    clearPrefix(state, clothingSection, { except: [controlId, clothingActionId(clothingSection), ...advancedIds] });
    if (PRIMARY_SECTIONS.includes(clothingSection)) clearConflictingPrimarySections(state, clothingSection);
  }

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
      return { allowed: false, message: `${DOMAIN_LABELS[domain]} allows a maximum of ${max} selections.` };
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
