import { CATALOGS } from "./catalogs.js";
import { assertMode, findEnabledRecord, result } from "./controls.js";
import {
  TOP_RANDOM_BUCKETS,
  BOTTOM_RANDOM_BUCKETS,
  selectRandomGarmentFromGroups,
  selectRandomPrimaryClothing,
  selectRandomOuterwear,
  selectRandomHosiery,
  selectRandomDress,
  selectRandomOnePiece,
  selectRandomSleepwear,
  selectRandomSwimwear,
} from "./random/clothing.js";
import { selectRandomPackage } from "./random/packages.js";

function garment(ref, label) {
  if (!ref || typeof ref !== "object") throw new Error(`${label} record reference is required.`);
  return findEnabledRecord(CATALOGS.clothing, ref.id, label, ref.groupId);
}

function slotSelection(control, { groups, label, bucketNamespace, context }) {
  if (!control || control.mode === "unselected" || control.mode === "none") {
    return Object.freeze({ mode: control?.mode ?? "unselected", record: null });
  }
  if (control.mode === "manual") return Object.freeze({ mode: "manual", record: garment(control, label) });
  if (control.mode === "random") {
    return Object.freeze({
      mode: "random",
      record: selectRandomGarmentFromGroups({ groups, rng: context.rng, state: context.state, bucketNamespace }),
    });
  }
  if (control.id) return Object.freeze({ mode: "manual", record: garment(control, label) });
  throw new Error(`${label} does not support mode ${control.mode}.`);
}

function standaloneSelection(control, structure, context) {
  if (!control) throw new Error(`Manual Built Outfit ${structure} requires a selection.`);
  if (control.mode === "manual") return garment(control, `Clothing ${structure}`);
  if (control.mode !== "random") throw new Error(`Clothing ${structure} does not support mode ${control.mode}.`);
  switch (structure) {
    case "dress": return selectRandomDress(context);
    case "one-piece": return selectRandomOnePiece(context);
    case "sleepwear": return selectRandomSleepwear(context);
    case "swimwear": return selectRandomSwimwear({ ...context, swimwearResolver: context.swimwearResolver });
    default: throw new Error(`Unknown Built Outfit structure ${structure}.`);
  }
}

function manualBuiltOutfit(control, context) {
  const { structure, outfit } = control;
  if (!outfit) throw new Error("Manual Built Outfit requires outfit selections.");
  switch (structure) {
    case "top-bottom": {
      const top = slotSelection(outfit.top, { groups: TOP_RANDOM_BUCKETS, label: "Clothing top", bucketNamespace: "clothing:tops:bucket", context });
      const bottom = slotSelection(outfit.bottom, { groups: BOTTOM_RANDOM_BUCKETS, label: "Clothing bottom", bucketNamespace: "clothing:bottoms:bucket", context });
      if (!top.record && !bottom.record) throw new Error("Top/Bottom clothing requires at least one selected or Random garment.");
      return Object.freeze({
        structure,
        outfit: Object.freeze({ top: top.record, bottom: bottom.record }),
        slotModes: Object.freeze({ top: top.mode, bottom: bottom.mode }),
      });
    }
    case "dress":
    case "one-piece":
    case "sleepwear": {
      const record = outfit.mode ? standaloneSelection(outfit, structure, context) : garment(outfit, `Clothing ${structure}`);
      return Object.freeze({ structure, outfit: record, selectionMode: outfit.mode ?? "manual" });
    }
    case "swimwear": {
      if (outfit.mode === "random") {
        return Object.freeze({ structure, outfit: standaloneSelection(outfit, structure, context), selectionMode: "random" });
      }
      const refs = Array.isArray(outfit) ? outfit : [outfit];
      return Object.freeze({ structure, outfit: Object.freeze(refs.map((ref) => garment(ref, "Clothing swimwear"))), selectionMode: "manual" });
    }
    default: throw new Error(`Unknown Built Outfit structure ${structure}.`);
  }
}

export function selectClothing(controls = {}, context) {
  const out = {};
  if (controls.primary) {
    assertMode(controls.primary, ["manual", "random"], "Clothing primary");
    if (controls.primary.mode === "random") {
      out.primary = result("random", selectRandomPrimaryClothing({ ...context, swimwearResolver: context.swimwearResolver }));
    } else if (controls.primary.path === "package") {
      const selection = controls.primary.selection;
      if (selection?.mode === "random") {
        out.primary = result("manual", Object.freeze({ path: "package", package: selectRandomPackage(context), selectionMode: "random" }));
      } else {
        const ref = selection?.mode === "manual" ? selection : controls.primary;
        out.primary = result("manual", Object.freeze({ path: "package", package: findEnabledRecord(CATALOGS.packages, ref.id, "Package", ref.groupId), selectionMode: "manual" }));
      }
    } else if (controls.primary.path === "built-outfit") {
      out.primary = result("manual", Object.freeze({ path: "built-outfit", builtOutfit: manualBuiltOutfit(controls.primary, context) }));
    } else {
      throw new Error(`Unknown Clothing path ${controls.primary.path}.`);
    }
  }

  if (controls.outerwear) {
    assertMode(controls.outerwear, ["manual", "random", "none"], "Outerwear");
    out.outerwear = controls.outerwear.mode === "none"
      ? result("none", null)
      : controls.outerwear.mode === "random"
        ? result("random", selectRandomOuterwear(context))
        : result("manual", garment(controls.outerwear, "Outerwear"));
  }
  if (controls.hosiery) {
    assertMode(controls.hosiery, ["manual", "random", "none"], "Hosiery");
    out.hosiery = controls.hosiery.mode === "none"
      ? result("none", null)
      : controls.hosiery.mode === "random"
        ? result("random", selectRandomHosiery({ ...context, outfit: out.primary?.value, hosieryEligibilityResolver: context.hosieryEligibilityResolver }))
        : result("manual", garment(controls.hosiery, "Hosiery"));
  }
  if (controls.lingerie) {
    assertMode(controls.lingerie, ["manual", "none"], "Lingerie");
    out.lingerie = controls.lingerie.mode === "none" ? result("none", null) : result("manual", garment(controls.lingerie, "Lingerie"));
  }
  return Object.freeze(out);
}
