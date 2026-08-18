function visibilityKey(entry) {
  return `${entry.region}:${entry.side ?? "none"}`;
}

export function resolveTattoos(selection, tattooVisibility) {
  if (!selection) return undefined;
  if (!Array.isArray(selection.value)) throw new Error("Resolved Tattoos selection must contain an array value.");
  if (!Array.isArray(tattooVisibility)) throw new Error("Tattoo Resolution requires tattooVisibility.");

  const allowed = new Map(tattooVisibility.map((entry) => [visibilityKey(entry), entry.allowed === true]));
  const visible = [];
  const omitted = [];

  selection.value.forEach((tattoo, index) => {
    const required = tattoo.pattern?.requiredRegions;
    if (!Array.isArray(required) || required.length === 0) throw new Error(`Tattoo ${index + 1} has no required visibility regions.`);
    const blockedRegions = required.filter((entry) => allowed.get(visibilityKey(entry)) !== true);
    if (blockedRegions.length) {
      omitted.push(Object.freeze({ index, tattoo, blockedRegions: Object.freeze(blockedRegions) }));
    } else {
      visible.push(tattoo);
    }
  });

  return Object.freeze({
    ...selection,
    resolution: Object.freeze({
      visible: Object.freeze(visible),
      omitted: Object.freeze(omitted),
    }),
  });
}
