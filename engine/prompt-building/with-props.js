import { CATALOGS } from "../selection/catalogs.js";
import { buildPrompt, PROMPT_SECTION_ORDER } from "./index.js";

function normalizeFragment(fragment) {
  if (typeof fragment !== "string") throw new Error("Prompt fragments must be strings.");
  return fragment.replace(/\s+/gu, " ").trim().replace(/[\s,;.]+$/gu, "");
}

function promptOf(record) {
  if (!record || typeof record !== "object") throw new Error("Prop record is required.");
  if (typeof record.prompt !== "string" || !record.prompt.trim()) throw new Error(`Prop record ${record.id ?? "<unknown>"} has no authoritative prompt.`);
  return normalizeFragment(record.prompt);
}

function propFragments(selection) {
  if (!selection?.value?.length) return Object.freeze([]);
  const rank = new Map();
  let index = 0;
  for (const group of CATALOGS.props) for (const record of group.items) rank.set(record, index++);
  const records = selection.value.map((entry) => entry.record).sort((a, b) => (rank.get(a) ?? Number.MAX_SAFE_INTEGER) - (rank.get(b) ?? Number.MAX_SAFE_INTEGER));
  return Object.freeze(records.map(promptOf));
}

export function buildPromptWithProps(resolvedState) {
  const base = buildPrompt(resolvedState);
  const props = propFragments(resolvedState?.selections?.props);
  if (!props.length) return base;

  const sections = Object.freeze({ ...base.sections, props });
  const order = [...PROMPT_SECTION_ORDER];
  const accessoriesIndex = order.indexOf("accessories");
  order.splice(accessoriesIndex < 0 ? order.indexOf("location") : accessoriesIndex + 1, 0, "props");
  const fragments = Object.freeze(order.flatMap((section) => sections[section] ?? []));
  const normalPrompt = fragments.join(", ");
  const cover = sections.covers?.[0];
  return Object.freeze({
    ...base,
    sections,
    fragments,
    prompt: cover ? `${normalPrompt}.\n\n${cover}` : normalPrompt,
  });
}
