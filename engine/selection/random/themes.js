import { THEME_COLORS } from "../../../data/themes/colors.js";
import { THEME_HOLIDAYS_EVENTS } from "../../../data/themes/holidays-events.js";
import { THEME_GENRES_AESTHETICS } from "../../../data/themes/genres-aesthetics.js";
import { THEMES_CONFIG } from "../../../data/themes/config.js";

import { chooseItem, effectiveRecord, weightedChoice } from "./core.js";

export const THEME_RANDOM_GROUPS = Object.freeze([
  THEME_COLORS,
  THEME_HOLIDAYS_EVENTS,
  THEME_GENRES_AESTHETICS,
]);

export function selectRandomThemes({ rng, state }) {
  const count = weightedChoice(THEMES_CONFIG.randomStackSizeWeights, {
    rng,
    getWeight: (entry) => entry.weight,
  }).count;
  const pool = THEME_RANDOM_GROUPS.flatMap((group) =>
    group.items.map((record) => effectiveRecord(group, record)),
  );
  const selected = [];

  for (let index = 0; index < count; index += 1) {
    const selectedIds = new Set(selected.map((record) => record.id));
    const eligible = pool.filter((entry) => !selectedIds.has(entry.record.id));
    const choice = chooseItem({
      items: eligible,
      rng,
      state,
      namespace: "themes",
      getId: (entry) => entry.record.id,
      getBaseWeight: (entry) => entry.selectionWeight,
      isEnabled: (entry) => entry.enabled,
      lifetimeKey: (entry) => `themes:${entry.record.id}`,
    });
    selected.push(choice.record);
  }

  return Object.freeze(selected);
}
