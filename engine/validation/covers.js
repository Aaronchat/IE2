import { fileURLToPath } from "node:url";
import path from "node:path";

import { COVER_TYPES } from "../../data/covers/cover-types.js";
import { COVER_STYLE_GROUPS } from "../../data/covers/styles.js";
import { COVER_ERAS } from "../../data/covers/eras.js";
import { COVERS_CONFIG } from "../../data/covers/config.js";

const EXPECTED = Object.freeze({
  "cover-types": Object.freeze([
    ["novel", "Novel", "novel cover"], ["album", "Album", "album cover"],
    ["dvd", "DVD", "movie DVD cover"], ["movie-poster", "Movie Poster", "movie poster"],
    ["magazine", "Magazine", "magazine cover"],
  ]),
  "novel-styles": Object.freeze([
    ["romance", "Romance", "cheesy romance novel cover"], ["mystery", "Mystery", "mystery novel cover"],
    ["horror", "Horror", "horror novel cover"],
  ]),
  "album-styles": Object.freeze([
    ["metal", "Metal", "heavy metal album cover"], ["rap", "Rap", "rap album cover"],
    ["yodeling", "Yodeling", "yodeling album cover"],
  ]),
  "dvd-styles": Object.freeze([
    ["romance", "Romance", "romance movie DVD cover"], ["action", "Action", "action movie DVD cover"],
    ["horror", "Horror", "horror movie DVD cover"],
  ]),
  "magazine-styles": Object.freeze([
    ["mens-magazine", "Men's Magazine", "men's magazine cover"],
    ["home-garden", "Home & Garden", "home and garden magazine cover"],
    ["fitness", "Fitness", "fitness magazine cover"],
    ["sports-magazine", "Sports Magazine", "sports magazine cover"],
    ["hunting-magazine", "Hunting Magazine", "hunting magazine cover"],
  ]),
  "cover-eras": Object.freeze(["1950s", "1960s", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"].map((value) => [value, value, value])),
});

const ALLOWED_GROUP_KEYS = new Set(["id", "name", "defaults", "items"]);
const ALLOWED_RECORD_KEYS = new Set(["id", "name", "prompt", "enabled", "selectionWeight"]);

function requireString(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} must be a non-empty string.`);
}

function validateGroup(group) {
  const expected = EXPECTED[group?.id];
  if (!expected) throw new Error(`Unknown Covers catalog group ${group?.id}.`);
  for (const key of Object.keys(group)) if (!ALLOWED_GROUP_KEYS.has(key)) throw new Error(`${group.id}: unapproved group field ${key}.`);
  if (group?.defaults?.enabled !== true || group?.defaults?.selectionWeight !== 1) throw new Error(`${group.id}: defaults must enable equal-weight selection.`);
  if (!Array.isArray(group.items) || group.items.length !== expected.length) throw new Error(`${group.id}: expected ${expected.length} records.`);
  const expectedById = new Map(expected.map(([id, name, prompt]) => [id, { name, prompt }]));
  const ids = new Set();
  for (const record of group.items) {
    requireString(record?.id, `${group.id} record id`);
    requireString(record?.name, `${record?.id ?? group.id} name`);
    requireString(record?.prompt, `${record?.id ?? group.id} prompt`);
    if (ids.has(record.id)) throw new Error(`${group.id}: duplicate record ${record.id}.`);
    ids.add(record.id);
    const match = expectedById.get(record.id);
    if (!match || match.name !== record.name || match.prompt !== record.prompt) throw new Error(`${record.id}: record does not match the approved Covers catalog.`);
    for (const key of Object.keys(record)) if (!ALLOWED_RECORD_KEYS.has(key)) throw new Error(`${record.id}: unapproved record field ${key}.`);
    const enabled = record.enabled ?? group.defaults.enabled;
    const weight = record.selectionWeight ?? group.defaults.selectionWeight;
    if (typeof enabled !== "boolean") throw new Error(`${record.id}: effective enabled must be boolean.`);
    if (typeof weight !== "number" || !Number.isFinite(weight) || weight < 0) throw new Error(`${record.id}: effective selectionWeight must be non-negative.`);
    if (record.id.toLowerCase() === "random" || record.name.toLowerCase() === "random") throw new Error("Random must remain a Covers control mode, not catalog data.");
  }
}

function validateConfig(config) {
  const expectedStyles = { novel: "novel-styles", album: "album-styles", dvd: "dvd-styles", magazine: "magazine-styles" };
  if (JSON.stringify(config?.styleGroupByType) !== JSON.stringify(expectedStyles)) throw new Error("Covers contextual Style mappings do not match the approved catalog.");
  if (config?.randomTypeResolvesStyle !== true) throw new Error("Random Cover Type must resolve a valid contextual Style when one exists.");
  const expectedFields = {
    novel: ["title", "author"],
    album: ["album-title", "artist-band"],
    dvd: ["movie-title", "tagline", "starring-name"],
    "movie-poster": ["movie-title", "tagline", "starring-name"],
    magazine: ["magazine-name", "primary-headline"],
  };
  if (Object.keys(config?.metadataFieldsByType ?? {}).length !== Object.keys(expectedFields).length) throw new Error("Covers metadata configuration has an unexpected Cover Type.");
  for (const [typeId, ids] of Object.entries(expectedFields)) {
    const fields = config.metadataFieldsByType[typeId];
    if (!Array.isArray(fields) || JSON.stringify(fields.map((field) => field.id)) !== JSON.stringify(ids)) throw new Error(`${typeId}: metadata fields do not match the approved initial set.`);
    for (const field of fields) requireString(field.label, `${typeId} ${field.id} label`);
  }
}

export function validateCovers(catalogs = { types: COVER_TYPES, styles: COVER_STYLE_GROUPS, eras: COVER_ERAS }, config = COVERS_CONFIG) {
  validateGroup(catalogs.types);
  if (!Array.isArray(catalogs.styles) || catalogs.styles.length !== 4) throw new Error("Covers requires exactly four approved contextual Style groups.");
  for (const group of catalogs.styles) validateGroup(group);
  validateGroup(catalogs.eras);
  if (catalogs.styles.some((group) => group.id === "movie-poster-styles")) throw new Error("Movie Poster styles are not yet approved.");
  const allNames = [catalogs.types, ...catalogs.styles, catalogs.eras].flatMap((group) => group.items.map((record) => record.name.toLowerCase()));
  if (allNames.includes("misogynistic magazine")) throw new Error("Misogynistic Magazine is not an approved Covers value.");
  validateConfig(config);
  return Object.freeze({ typeCount: catalogs.types.items.length, styleCount: catalogs.styles.reduce((sum, group) => sum + group.items.length, 0), eraCount: catalogs.eras.items.length });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;
if (invokedFile === currentFile) {
  const result = validateCovers();
  console.log(`Covers validation passed: ${result.typeCount} types, ${result.styleCount} styles, ${result.eraCount} eras.`);
}
