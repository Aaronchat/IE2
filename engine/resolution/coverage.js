import { BODY_REGIONS } from "../../data/vocabulary/body-regions.js";
import { CATALOGS } from "../selection/catalogs.js";

const rank = Object.freeze({ uncovered: 0, partiallyCovered: 1, covered: 2 });
function effective(group, record, field) { return record?.[field] ?? group?.defaults?.[field]; }
function locate(groups, record) { return groups.find((group) => group.items.includes(record)); }
function garmentCoverage(record) { const group = locate(CATALOGS.clothing, record); return effective(group, record, "coverage"); }
function footwearCoverage(record) { const group = locate(CATALOGS.footwear, record); return effective(group, record, "coverage"); }
function accessoryCoverage(record) { const group = locate(CATALOGS.accessories, record); return effective(group, record, "coverage"); }
function packageCoverage(record) { const group = locate(CATALOGS.packages, record); return effective(group, record, "coverage"); }

function clothingRecords(clothing) {
  const records = [];
  const primary = clothing?.primary?.value;
  if (primary?.path === "package") records.push({ type: "package", record: primary.package });
  if (primary?.path === "built-outfit") {
    const built = primary.builtOutfit;
    if (built.structure === "top-bottom") records.push({ type: "clothing", record: built.outfit.top }, { type: "clothing", record: built.outfit.bottom });
    else if (built.structure === "swimwear") for (const record of built.outfit) records.push({ type: "clothing", record });
    else records.push({ type: "clothing", record: built.outfit });
  }
  for (const key of ["outerwear", "hosiery", "lingerie"]) if (clothing?.[key]?.value) records.push({ type: "clothing", record: clothing[key].value });
  return records;
}

function apply(map, coverage) {
  if (!coverage) return;
  for (const [bucket, status] of [["partiallyCovered", "partiallyCovered"], ["covered", "covered"]]) {
    for (const entry of coverage[bucket] ?? []) {
      const region = BODY_REGIONS.find((r) => r.id === entry.region);
      const sides = !region?.supportsSide ? [null] : entry.side === "both" || !entry.side ? ["left", "right"] : [entry.side];
      for (const side of sides) {
        const key = `${entry.region}:${side ?? "none"}`;
        if (rank[status] > rank[map.get(key) ?? "uncovered"]) map.set(key, status);
      }
    }
  }
}

export function resolveCoverage(selections) {
  const map = new Map();
  for (const { type, record } of clothingRecords(selections.clothing)) apply(map, type === "package" ? packageCoverage(record) : garmentCoverage(record));
  if (selections.footwear?.value) apply(map, footwearCoverage(selections.footwear.value));
  for (const accessory of selections.accessories?.value ?? []) apply(map, accessoryCoverage(accessory.record));
  const finalCoverage = [];
  const tattooVisibility = [];
  for (const region of BODY_REGIONS) {
    const sides = region.supportsSide ? ["left", "right"] : [null];
    for (const side of sides) {
      const status = map.get(`${region.id}:${side ?? "none"}`) ?? "uncovered";
      finalCoverage.push(Object.freeze({ region: region.id, ...(side ? { side } : {}), status }));
      tattooVisibility.push(Object.freeze({ region: region.id, ...(side ? { side } : {}), allowed: status === "uncovered" }));
    }
  }
  return Object.freeze({ finalCoverage: Object.freeze(finalCoverage), tattooVisibility: Object.freeze(tattooVisibility) });
}
