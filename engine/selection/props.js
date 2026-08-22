import { CATALOGS } from "./catalogs.js";
import { assertMode, enforceMax, findEnabledRecord, result } from "./controls.js";

export function selectProps(control) {
  if (!control) return undefined;
  assertMode(control, ["manual"], "Props");
  enforceMax(control.selections, 3, "Props");
  const values = control.selections.map(({ id, groupId }) => {
    const record = findEnabledRecord(CATALOGS.props, id, "Prop", groupId);
    const group = CATALOGS.props.find((entry) => entry.items.includes(record));
    return Object.freeze({ category: group.id, record });
  });
  return result("manual", Object.freeze(values));
}
