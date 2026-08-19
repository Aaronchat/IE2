import { fileURLToPath } from "node:url";
import path from "node:path";

import { BODY_REGIONS, BODY_SIDES } from "../../data/vocabulary/body-regions.js";
import { TEMPERATURES } from "../../data/vocabulary/temperatures.js";
import { SEASONS } from "../../data/vocabulary/seasons.js";
import { FORMALITIES } from "../../data/vocabulary/formalities.js";

import { ATHLETIC_PANTS } from "../../data/clothing/bottoms/athletic-pants.js";
import { ATHLETIC_SHORTS } from "../../data/clothing/bottoms/athletic-shorts.js";
import { CASUAL_PANTS } from "../../data/clothing/bottoms/casual-pants.js";
import { CASUAL_SHORTS } from "../../data/clothing/bottoms/casual-shorts.js";
import { DRESS_PANTS } from "../../data/clothing/bottoms/dress-pants.js";
import { JEANS } from "../../data/clothing/bottoms/jeans.js";
import { LONG_SKIRTS } from "../../data/clothing/bottoms/long-skirts.js";
import { MINI_SKIRTS } from "../../data/clothing/bottoms/mini-skirts.js";
import { SKORTS } from "../../data/clothing/bottoms/skorts.js";
import { BALL_GOWNS } from "../../data/clothing/dresses/ball-gowns.js";
import { BODYCON_DRESSES } from "../../data/clothing/dresses/bodycon-dresses.js";
import { EVENING_GOWNS } from "../../data/clothing/dresses/evening-gowns.js";
import { MAXI_DRESSES } from "../../data/clothing/dresses/maxi-dresses.js";
import { MINI_DRESSES } from "../../data/clothing/dresses/mini-dresses.js";
import { SUNDRESSES } from "../../data/clothing/dresses/sundresses.js";
import { SWEATER_DRESSES } from "../../data/clothing/dresses/sweater-dresses.js";
import { WEDDING_DRESSES } from "../../data/clothing/dresses/wedding-dresses.js";
import { SOCKS_LEG_WARMERS } from "../../data/clothing/hosiery/socks-leg-warmers.js";
import { STOCKINGS } from "../../data/clothing/hosiery/stockings.js";
import { TIGHTS_PANTYHOSE } from "../../data/clothing/hosiery/tights-pantyhose.js";
import { UNDERWEAR_LINGERIE } from "../../data/clothing/lingerie/underwear-lingerie.js";
import { BODYSUITS } from "../../data/clothing/one-piece/bodysuits.js";
import { CATSUITS_UNITARDS } from "../../data/clothing/one-piece/catsuits-unitards.js";
import { COVERALLS_BOILERSUITS } from "../../data/clothing/one-piece/coveralls-boilersuits.js";
import { JUMPSUITS } from "../../data/clothing/one-piece/jumpsuits.js";
import { OVERALLS } from "../../data/clothing/one-piece/overalls.js";
import { ROMPERS_PLAYSUITS } from "../../data/clothing/one-piece/rompers-playsuits.js";
import { BLAZERS } from "../../data/clothing/outerwear/blazers.js";
import { CAPES_WRAPS } from "../../data/clothing/outerwear/capes-wraps.js";
import { COATS } from "../../data/clothing/outerwear/coats.js";
import { JACKETS } from "../../data/clothing/outerwear/jackets.js";
import { VESTS } from "../../data/clothing/outerwear/vests.js";
import { LOUNGEWEAR_SETS } from "../../data/clothing/sleepwear/loungewear-sets.js";
import { NIGHTGOWNS_SLEEP_SHIRTS } from "../../data/clothing/sleepwear/nightgowns-sleep-shirts.js";
import { PAJAMA_SETS } from "../../data/clothing/sleepwear/pajama-sets.js";
import { ROBES } from "../../data/clothing/sleepwear/robes.js";
import { BIKINI_BOTTOMS } from "../../data/clothing/swimwear/bikini-bottoms.js";
import { BIKINI_TOPS } from "../../data/clothing/swimwear/bikini-tops.js";
import { ONE_PIECE_SWIMSUITS } from "../../data/clothing/swimwear/one-piece-swimsuits.js";
import { SPECIALTY_SWIMWEAR } from "../../data/clothing/swimwear/specialty-swimwear.js";
import { TWO_PIECE_SWIM_BOTTOMS } from "../../data/clothing/swimwear/two-piece-swim-bottoms.js";
import { TWO_PIECE_SWIM_TOPS } from "../../data/clothing/swimwear/two-piece-swim-tops.js";
import { BLOUSES } from "../../data/clothing/tops/blouses.js";
import { BUTTON_UP_SHIRTS } from "../../data/clothing/tops/button-up-shirts.js";
import { LONG_SLEEVE_TOPS } from "../../data/clothing/tops/long-sleeve-tops.js";
import { SHORT_SLEEVE_TOPS } from "../../data/clothing/tops/short-sleeve-tops.js";
import { SPECIALTY_STATEMENT_TOPS } from "../../data/clothing/tops/specialty-statement-tops.js";
import { SPORTS_ATHLETIC_TOPS } from "../../data/clothing/tops/sports-athletic-tops.js";
import { STRAPLESS_TOPS } from "../../data/clothing/tops/strapless-tops.js";
import { SWEATERS } from "../../data/clothing/tops/sweaters.js";
import { TANK_TOPS } from "../../data/clothing/tops/tank-tops.js";

const APPROVED_GROUP_IDS = Object.freeze([
  "athletic-pants",
  "athletic-shorts",
  "casual-pants",
  "casual-shorts",
  "dress-pants",
  "jeans",
  "long-skirts",
  "mini-skirts",
  "skorts",
  "ball-gowns",
  "bodycon-dresses",
  "evening-gowns",
  "maxi-dresses",
  "mini-dresses",
  "sundresses",
  "sweater-dresses",
  "wedding-dresses",
  "socks-leg-warmers",
  "stockings",
  "tights-pantyhose",
  "underwear-lingerie",
  "bodysuits",
  "catsuits-unitards",
  "coveralls-boilersuits",
  "jumpsuits",
  "overalls",
  "rompers-playsuits",
  "blazers",
  "capes-wraps",
  "coats",
  "jackets",
  "vests",
  "loungewear-sets",
  "nightgowns-sleep-shirts",
  "pajama-sets",
  "robes",
  "bikini-bottoms",
  "bikini-tops",
  "one-piece-swimsuits",
  "specialty-swimwear",
  "two-piece-swim-bottoms",
  "two-piece-swim-tops",
  "blouses",
  "button-up-shirts",
  "long-sleeve-tops",
  "short-sleeve-tops",
  "specialty-statement-tops",
  "sports-athletic-tops",
  "strapless-tops",
  "sweaters",
  "tank-tops",
]);

const CLOTHING_GROUPS = Object.freeze([
  ATHLETIC_PANTS,
  ATHLETIC_SHORTS,
  CASUAL_PANTS,
  CASUAL_SHORTS,
  DRESS_PANTS,
  JEANS,
  LONG_SKIRTS,
  MINI_SKIRTS,
  SKORTS,
  BALL_GOWNS,
  BODYCON_DRESSES,
  EVENING_GOWNS,
  MAXI_DRESSES,
  MINI_DRESSES,
  SUNDRESSES,
  SWEATER_DRESSES,
  WEDDING_DRESSES,
  SOCKS_LEG_WARMERS,
  STOCKINGS,
  TIGHTS_PANTYHOSE,
  UNDERWEAR_LINGERIE,
  BODYSUITS,
  CATSUITS_UNITARDS,
  COVERALLS_BOILERSUITS,
  JUMPSUITS,
  OVERALLS,
  ROMPERS_PLAYSUITS,
  BLAZERS,
  CAPES_WRAPS,
  COATS,
  JACKETS,
  VESTS,
  LOUNGEWEAR_SETS,
  NIGHTGOWNS_SLEEP_SHIRTS,
  PAJAMA_SETS,
  ROBES,
  BIKINI_BOTTOMS,
  BIKINI_TOPS,
  ONE_PIECE_SWIMSUITS,
  SPECIALTY_SWIMWEAR,
  TWO_PIECE_SWIM_BOTTOMS,
  TWO_PIECE_SWIM_TOPS,
  BLOUSES,
  BUTTON_UP_SHIRTS,
  LONG_SLEEVE_TOPS,
  SHORT_SLEEVE_TOPS,
  SPECIALTY_STATEMENT_TOPS,
  SPORTS_ATHLETIC_TOPS,
  STRAPLESS_TOPS,
  SWEATERS,
  TANK_TOPS,
]);

const BODY_REGION_BY_ID = new Map(BODY_REGIONS.map((region) => [region.id, region]));
const BODY_SIDE_SET = new Set(BODY_SIDES);
const TEMPERATURE_ID_SET = new Set(TEMPERATURES.map((value) => value.id));
const SEASON_ID_SET = new Set(SEASONS.map((value) => value.id));
const FORMALITY_ID_SET = new Set(FORMALITIES.map((value) => value.id));
const APPROVED_GROUP_ID_SET = new Set(APPROVED_GROUP_IDS);
const DEFERRED_FIELDS = Object.freeze(["style", "mood", "themeAffinity"]);

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateCoverage(recordId, coverage) {
  if (!coverage || !Array.isArray(coverage.covered) || !Array.isArray(coverage.partiallyCovered)) {
    throw new Error(`${recordId}: coverage must contain covered and partiallyCovered arrays.`);
  }

  const seenCovered = new Set();
  const seenPartial = new Set();

  for (const [bucketName, entries, seen] of [
    ["covered", coverage.covered, seenCovered],
    ["partiallyCovered", coverage.partiallyCovered, seenPartial],
  ]) {
    for (const entry of entries) {
      const region = BODY_REGION_BY_ID.get(entry?.region);
      if (!region) {
        throw new Error(`${recordId}: unknown body region ${entry?.region}.`);
      }

      let key;
      if (region.supportsSide) {
        if (!BODY_SIDE_SET.has(entry.side)) {
          throw new Error(`${recordId}: ${entry.region} requires a valid side.`);
        }
        key = `${entry.region}|${entry.side}`;
      } else {
        if (Object.prototype.hasOwnProperty.call(entry, "side")) {
          throw new Error(`${recordId}: ${entry.region} does not support side.`);
        }
        key = `${entry.region}|`;
      }

      if (seen.has(key)) {
        throw new Error(`${recordId}: duplicate ${bucketName} coverage entry ${key}.`);
      }
      seen.add(key);
    }
  }

  for (const key of seenCovered) {
    if (seenPartial.has(key)) {
      throw new Error(`${recordId}: coverage entry ${key} appears in both coverage buckets.`);
    }
  }
}

function rejectDeferredFields(recordId, object) {
  for (const field of DEFERRED_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(object, field)) {
      throw new Error(`${recordId}: deferred field ${field} is not allowed.`);
    }
  }
}

export function validateClothing(groups = CLOTHING_GROUPS) {
  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  let recordCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Clothing group id");
    if (!APPROVED_GROUP_ID_SET.has(group.id)) {
      throw new Error(`Unknown Clothing group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Clothing group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }

    rejectDeferredFields(group.id, group.defaults);

    for (const record of group.items) {
      recordCount += 1;
      requireNonEmptyString(record?.id, `${group.id} Clothing id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Clothing record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      const effectiveCategory = record.category ?? group.defaults.category;
      requireNonEmptyString(effectiveCategory, `${record.id} effective category`);

      const effectiveTemperature = record.temperature ?? group.defaults.temperature;
      if (!Array.isArray(effectiveTemperature) || effectiveTemperature.length === 0) {
        throw new Error(`${record.id}: effective temperature must be a non-empty array.`);
      }
      for (const value of effectiveTemperature) {
        if (!TEMPERATURE_ID_SET.has(value)) {
          throw new Error(`${record.id}: unknown Temperature ${value}.`);
        }
      }

      const effectiveSeason = record.season ?? group.defaults.season;
      if (!Array.isArray(effectiveSeason) || effectiveSeason.length === 0) {
        throw new Error(`${record.id}: effective season must be a non-empty array.`);
      }
      for (const value of effectiveSeason) {
        if (!SEASON_ID_SET.has(value)) {
          throw new Error(`${record.id}: unknown Season ${value}.`);
        }
      }

      const effectiveFormality = record.formality ?? group.defaults.formality;
      if (!FORMALITY_ID_SET.has(effectiveFormality)) {
        throw new Error(`${record.id}: unknown effective Formality ${effectiveFormality}.`);
      }

      const effectiveEnabled = record.enabled ?? group.defaults.enabled;
      if (typeof effectiveEnabled !== "boolean") {
        throw new Error(`${record.id}: effective enabled must be boolean.`);
      }

      const effectiveSelectionWeight = record.selectionWeight ?? group.defaults.selectionWeight;
      if (
        typeof effectiveSelectionWeight !== "number" ||
        !Number.isFinite(effectiveSelectionWeight) ||
        effectiveSelectionWeight < 0
      ) {
        throw new Error(`${record.id}: effective selectionWeight must be a finite non-negative number.`);
      }

      const effectiveCoverage = record.coverage ?? group.defaults.coverage;
      validateCoverage(record.id, effectiveCoverage);

      rejectDeferredFields(record.id, record);
    }
  }

  if (seenGroupIds.size !== APPROVED_GROUP_ID_SET.size) {
    throw new Error(`Expected ${APPROVED_GROUP_ID_SET.size} Clothing groups, found ${seenGroupIds.size}.`);
  }

  return Object.freeze({ groupCount: seenGroupIds.size, recordCount });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateClothing();
  console.log(`Clothing validation passed: ${result.groupCount} groups, ${result.recordCount} records.`);
}
