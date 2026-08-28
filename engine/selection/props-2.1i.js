import { CATALOGS } from "./catalogs.js";
import { assertMode, enforceMax, findEnabledRecord, result } from "./controls.js";
import { selectRandomProp } from "./random/props.js";

export function selectProps(control, context) {
  if (!control) return undefined;
  assertMode(control, ["manual", "random"], "Props");
  if (control.mode === "random") return result("random", Object.freeze([selectRandomProp(context)]));

  enforceMax(control.selections, 3, "Props");
  const values = control.selections.map(({ id, groupId }) => {
    const record = findEnabledRecord(CATALOGS.props, id, "Prop", groupId);
    const group = CATALOGS.props.find((entry) => entry.items.includes(record));
    return Object.freeze({ category: group.id, record });
  });
  return result("manual", Object.freeze(values));
}
