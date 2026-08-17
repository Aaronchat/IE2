import { CATALOGS } from "./catalogs.js";
import { CAMERA_CONFIG } from "../../data/camera/config.js";
import { EFFECTS_CONFIG } from "../../data/effects/config.js";
import { ATMOSPHERE_CONFIG } from "../../data/weather/config.js";
import { TIME_OF_DAY_CONFIG } from "../../data/time-of-day/config.js";
import { THEMES_CONFIG } from "../../data/themes/config.js";
import { assertMode, enforceMax, findEnabledRecord, result } from "./controls.js";
import { selectRandomFootwear } from "./random/footwear.js";
import { selectRandomAccessories } from "./random/accessories.js";
import { selectRandomLocation } from "./random/locations.js";
import { selectRandomAtmosphere } from "./random/atmosphere.js";
import { selectRandomTimeOfDay } from "./random/time-of-day.js";
import { selectRandomThemes } from "./random/themes.js";

export function selectSingleRecord(control, groups, label, randomSelector, context, { none = false } = {}) {
  assertMode(control, ["manual", ...(none ? ["none"] : []), ...(randomSelector ? ["random"] : [])], label);
  if (control.mode === "none") return result("none", null);
  if (control.mode === "random") return result("random", randomSelector(context));
  return result("manual", findEnabledRecord(groups, control.id, label, control.groupId));
}

export function selectFootwear(control, context) {
  if (!control) return undefined;
  return selectSingleRecord(control, CATALOGS.footwear, "Footwear", selectRandomFootwear, context);
}

export function selectAccessories(control, context) {
  if (!control) return undefined;
  assertMode(control, ["manual", "random"], "Accessories");
  if (control.mode === "random") return result("random", selectRandomAccessories(context));
  enforceMax(control.selections, 2, "Accessories");
  const values = control.selections.map(({ id, groupId }) => {
    const record = findEnabledRecord(CATALOGS.accessories, id, "Accessory", groupId);
    const group = CATALOGS.accessories.find((entry) => entry.items.includes(record));
    return Object.freeze({ category: group.id, record });
  });
  return result("manual", Object.freeze(values));
}

export function selectLocation(control, context) {
  if (!control) return undefined;
  return selectSingleRecord(control, CATALOGS.locations, "Location", selectRandomLocation, context);
}

export function selectAtmosphere(control, context, location) {
  if (!control) return undefined;
  assertMode(control, ["manual", "none", "random"], "Atmosphere");
  if (control.mode === "none") return result("none", Object.freeze([]));
  if (control.mode === "random") {
    const count = control.count ?? 1;
    return result("random", selectRandomAtmosphere({ ...context, count, location }));
  }
  enforceMax(control.ids, ATMOSPHERE_CONFIG.maxSelections, "Atmosphere");
  return result("manual", Object.freeze(control.ids.map((id) => findEnabledRecord(CATALOGS.atmosphere, id, "Atmosphere"))));
}

export function selectTimeOfDay(control, context) {
  if (!control) return undefined;
  if (TIME_OF_DAY_CONFIG.maxSelections !== 1) throw new Error("Unsupported Time of Day configuration.");
  return selectSingleRecord(control, CATALOGS.timeOfDay, "Time of Day", selectRandomTimeOfDay, context, { none: true });
}

export function selectThemes(control, context) {
  if (!control) return undefined;
  assertMode(control, ["manual", "none", "random"], "Themes");
  if (control.mode === "none") return result("none", Object.freeze([]));
  if (control.mode === "random") return result("random", selectRandomThemes(context));

  const selections = control.selections;
  enforceMax(selections?.map((selection) => selection.id), THEMES_CONFIG.maxSelections, "Themes");
  if (selections.length === 0) throw new Error("Themes Manual requires at least one selection.");
  return result("manual", Object.freeze(selections.map(({ id, groupId }) =>
    findEnabledRecord(CATALOGS.themes, id, "Theme", groupId),
  )));
}

function selectConfiguredControls(controls, groupsByControl, config, domain) {
  const out = {};
  for (const [controlId, controlConfig] of Object.entries(config.controls)) {
    const control = controls?.[controlId] ?? { mode: "default" };
    assertMode(control, ["manual", "default", ...(controlConfig.none ? ["none"] : [])], `${domain} ${controlId}`);
    const group = groupsByControl[controlId];
    if (control.mode === "none") { out[controlId] = result("none", controlConfig.maxSelections > 1 ? Object.freeze([]) : null); continue; }
    if (control.mode === "default") {
      const defaults = controlConfig.defaultSelections ?? (controlConfig.defaultSelection == null ? [] : [controlConfig.defaultSelection]);
      const records = defaults.map((id) => findEnabledRecord([group], id, `${domain} ${controlId}`));
      out[controlId] = result("default", controlConfig.maxSelections > 1 ? Object.freeze(records) : (records[0] ?? null));
      continue;
    }
    const ids = control.ids ?? (control.id ? [control.id] : []);
    enforceMax(ids, controlConfig.maxSelections, `${domain} ${controlId}`);
    const records = ids.map((id) => findEnabledRecord([group], id, `${domain} ${controlId}`));
    out[controlId] = result("manual", controlConfig.maxSelections > 1 ? Object.freeze(records) : records[0]);
  }
  return Object.freeze(out);
}

export function selectCamera(controls = {}) { return selectConfiguredControls(controls, CATALOGS.camera, CAMERA_CONFIG, "Camera"); }
export function selectEffects(controls = {}) { return selectConfiguredControls(controls, CATALOGS.effects, EFFECTS_CONFIG, "Effects"); }
