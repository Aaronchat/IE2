import { SCI_FI_PACKAGES } from "../../../data/packages/sci-fi.js";
import { HISTORICAL_PACKAGES } from "../../../data/packages/historical.js";
import { ATHLETIC_PACKAGES } from "../../../data/packages/athletic.js";
import { OCCUPATION_PACKAGES } from "../../../data/packages/occupations.js";
import { HOOTERS_WAITRESS_UNIFORM } from "../../../data/packages/occupation-additions.js";
import { COSTUME_PACKAGES } from "../../../data/packages/costumes.js";
import { SAFARI_GUIDE } from "../../../data/packages/costume-additions.js";
import { CULTURAL_PACKAGES } from "../../../data/packages/cultural.js";

import { chooseItem } from "./core.js";

const OCCUPATION_PACKAGES_WITH_ADDITIONS = Object.freeze({
  ...OCCUPATION_PACKAGES,
  items: Object.freeze([...OCCUPATION_PACKAGES.items, HOOTERS_WAITRESS_UNIFORM]),
});

const COSTUME_PACKAGES_WITH_ADDITIONS = Object.freeze({
  ...COSTUME_PACKAGES,
  items: Object.freeze([...COSTUME_PACKAGES.items, SAFARI_GUIDE]),
});

export const PACKAGE_ORGANIZATIONAL_GROUPS = Object.freeze([
  SCI_FI_PACKAGES,
  HISTORICAL_PACKAGES,
  ATHLETIC_PACKAGES,
  OCCUPATION_PACKAGES_WITH_ADDITIONS,
  COSTUME_PACKAGES_WITH_ADDITIONS,
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
