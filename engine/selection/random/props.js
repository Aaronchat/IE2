import { PROP_GROUPS } from "../../../data/props/props.js";
import { chooseItem } from "./core.js";

const PROP_ENTRIES = Object.freeze(PROP_GROUPS.flatMap((group) => group.items.map((record) => Object.freeze({
  groupId: group.id,
  record,
  enabled: record.enabled ?? group.defaults?.enabled ?? true,
  selectionWeight: record.selectionWeight ?? group.defaults?.selectionWeight ?? 1,
}))));

export function selectRandomProp({ rng, state }) {
  const selected = chooseItem({
    items: PROP_ENTRIES,
    rng,
    state,
    namespace: "prop",
    getId: (entry) => `${entry.groupId}:${entry.record.id}`,
    getBaseWeight: (entry) => entry.selectionWeight,
    isEnabled: (entry) => entry.enabled,
    lifetimeKey: (entry) => `prop:${entry.groupId}:${entry.record.id}`,
  });

  return Object.freeze({ category: selected.groupId, record: selected.record });
}
