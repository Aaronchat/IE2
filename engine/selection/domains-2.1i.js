import { CATALOGS } from "./catalogs.js";
import { assertMode, findEnabledRecord, result } from "./controls.js";
import { selectRandomLocation } from "./random/locations-2.1i.js";

export {
  selectAspectRatio,
  selectFootwear,
  selectAccessories,
  selectAtmosphere,
  selectTimeOfDay,
  selectCamera,
  selectEffects,
  selectThemes,
  selectCovers,
  selectTattoos,
} from "./domains.js";

export function selectLocation(control, context) {
  if (!control) return undefined;
  assertMode(control, ["manual", "random"], "Location");
  if (control.mode === "random") {
    const environment = control.environment ?? null;
    return result("random", selectRandomLocation({ ...context, environment }));
  }
  return result("manual", findEnabledRecord(CATALOGS.locations, control.id, "Location", control.groupId));
}
