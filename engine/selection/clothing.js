import { CATALOGS } from "./catalogs.js";
import { assertMode, findEnabledRecord, result } from "./controls.js";
import { selectRandomPrimaryClothing, selectRandomOuterwear, selectRandomHosiery } from "./random/clothing.js";

function garment(ref, label) {
  if (!ref || typeof ref !== "object") throw new Error(`${label} record reference is required.`);
  return findEnabledRecord(CATALOGS.clothing, ref.id, label, ref.groupId);
}
function manualBuiltOutfit(control) {
  const { structure, outfit } = control;
  if (!outfit) throw new Error("Manual Built Outfit requires outfit selections.");
  switch (structure) {
    case "top-bottom": return Object.freeze({ structure, outfit: Object.freeze({ top: garment(outfit.top, "Clothing top"), bottom: garment(outfit.bottom, "Clothing bottom") }) });
    case "dress": case "one-piece": case "sleepwear": return Object.freeze({ structure, outfit: garment(outfit, `Clothing ${structure}`) });
    case "swimwear": {
      const refs = Array.isArray(outfit) ? outfit : [outfit];
      return Object.freeze({ structure, outfit: Object.freeze(refs.map((ref) => garment(ref, "Clothing swimwear"))) });
    }
    default: throw new Error(`Unknown Built Outfit structure ${structure}.`);
  }
}
export function selectClothing(controls = {}, context) {
  const out = {};
  if (controls.primary) {
    assertMode(controls.primary, ["manual", "random"], "Clothing primary");
    if (controls.primary.mode === "random") out.primary = result("random", selectRandomPrimaryClothing({ ...context, swimwearResolver: context.swimwearResolver }));
    else if (controls.primary.path === "package") out.primary = result("manual", Object.freeze({ path: "package", package: findEnabledRecord(CATALOGS.packages, controls.primary.id, "Package", controls.primary.groupId) }));
    else if (controls.primary.path === "built-outfit") out.primary = result("manual", Object.freeze({ path: "built-outfit", builtOutfit: manualBuiltOutfit(controls.primary) }));
    else throw new Error(`Unknown Clothing path ${controls.primary.path}.`);
  }
  if (controls.outerwear) {
    assertMode(controls.outerwear, ["manual", "random"], "Outerwear");
    out.outerwear = controls.outerwear.mode === "random" ? result("random", selectRandomOuterwear(context)) : result("manual", garment(controls.outerwear, "Outerwear"));
  }
  if (controls.hosiery) {
    assertMode(controls.hosiery, ["manual", "random"], "Hosiery");
    out.hosiery = controls.hosiery.mode === "random" ? result("random", selectRandomHosiery({ ...context, outfit: out.primary?.value, hosieryEligibilityResolver: context.hosieryEligibilityResolver })) : result("manual", garment(controls.hosiery, "Hosiery"));
  }
  if (controls.lingerie) {
    assertMode(controls.lingerie, ["manual"], "Lingerie");
    out.lingerie = result("manual", garment(controls.lingerie, "Lingerie"));
  }
  return Object.freeze(out);
}
