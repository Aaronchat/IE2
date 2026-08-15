import { SCI_FI_PACKAGES } from "../../../data/packages/sci-fi.js";
import { HISTORICAL_PACKAGES } from "../../../data/packages/historical.js";
import { ATHLETIC_PACKAGES } from "../../../data/packages/athletic.js";
import { OCCUPATION_PACKAGES } from "../../../data/packages/occupations.js";
import { COSTUME_PACKAGES } from "../../../data/packages/costumes.js";
import { CULTURAL_PACKAGES } from "../../../data/packages/cultural.js";

import { chooseItem } from "./core.js";

export const PACKAGE_ORGANIZATIONAL_GROUPS = Object.freeze([
  SCI_FI_PACKAGES,
  HISTORICAL_PACKAGES,
  ATHLETIC_PACKAGES,
  OCCUPATION_PACKAGES,
  COSTUME_PACKAGES,
  CULTURAL_PACKAGES,
]);

function flatPackagePool() {
  return PACKAGE_ORGANIZATIONAL_GROUPS.flatMap((group) =>
    group.items.map((record) =>
      Object.freeze({
        record,
        enabled: record.enabled ?? group.defaults.enabled,
        selectionWeight: record.selectionWeight ?? group.defaults.selectionWeight,
      }),
    ),
  );
}

export function selectRandomPackage({ rng, state }) {
  return chooseItem({
    items: flatPackagePool(),
    rng,
    state,
    namespace: "package",
    getId: (entry) => entry.record.id,
    getBaseWeight: (entry) => entry.selectionWeight,
    isEnabled: (entry) => entry.enabled,
    lifetimeKey: (entry) => `package:${entry.record.id}`,
  }).record;
}
