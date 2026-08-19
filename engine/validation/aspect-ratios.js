import { fileURLToPath } from "node:url";
import path from "node:path";
import { ASPECT_RATIOS } from "../../data/aspect-ratios/aspect-ratios.js";

const EXPECTED = Object.freeze([
  Object.freeze(["9-16", "9:16", "9:16 aspect ratio"]),
  Object.freeze(["9-19-5", "9:19.5", "9:19.5 aspect ratio"]),
]);

export function validateAspectRatios(group = ASPECT_RATIOS) {
  if (group?.id !== "aspect-ratios" || group?.name !== "Aspect Ratio") throw new Error("Aspect Ratio catalog identity does not match the approved domain.");
  if (group?.defaults?.enabled !== true || group?.defaults?.selectionWeight !== 1) throw new Error("Aspect Ratio defaults must enable equal-weight catalog records.");
  if (!Array.isArray(group.items) || group.items.length !== EXPECTED.length) throw new Error(`Aspect Ratio requires exactly ${EXPECTED.length} approved records.`);
  const actual = group.items.map((record) => [record.id, record.name, record.prompt]);
  if (JSON.stringify(actual) !== JSON.stringify(EXPECTED)) throw new Error("Aspect Ratio records do not match the approved catalog.");
  for (const record of group.items) {
    const enabled = record.enabled ?? group.defaults.enabled;
    const weight = record.selectionWeight ?? group.defaults.selectionWeight;
    if (typeof enabled !== "boolean") throw new Error(`${record.id}: effective enabled must be boolean.`);
    if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) throw new Error(`${record.id}: effective selectionWeight must be non-negative.`);
  }
  return Object.freeze({ recordCount: group.items.length });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedFile === currentFile) console.log(`Aspect Ratio validation passed: ${validateAspectRatios().recordCount} records.`);
