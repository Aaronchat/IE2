import { CATALOGS } from "../engine/selection/catalogs.js";
import { TATTOO_UI_CONFIG, UI_CATEGORIES as BASE_UI_CATEGORIES } from "./ui-data.js";

const option = (value, label, groupId) => Object.freeze({ value, label, groupId });
const groupedOptions = Object.freeze(CATALOGS.props.map((group) => Object.freeze({
  groupId: group.id,
  label: group.name,
  options: Object.freeze(group.items.map((item) => option(item.id, item.name, group.id))),
})));

const propsAction = Object.freeze({
  id: "props.selection",
  label: "Props",
  options: Object.freeze([]),
  groupedOptions,
  random: false,
  none: false,
  noneLabel: "None",
  defaultValue: null,
  defaultMode: "unselected",
  maxSelections: 3,
  note: "Manual multi-select. Maximum three Props.",
  inputType: "select",
  placeholder: "",
  toggle: false,
});

const propsCategory = Object.freeze({
  id: "props",
  label: "Props",
  sections: Object.freeze([]),
  action: propsAction,
  repeatable: null,
  modifiers: Object.freeze([]),
});

const locationIndex = BASE_UI_CATEGORIES.findIndex((entry) => entry.id === "location");
const insertAt = locationIndex < 0 ? BASE_UI_CATEGORIES.length : locationIndex;

export const UI_CATEGORIES = Object.freeze([
  ...BASE_UI_CATEGORIES.slice(0, insertAt),
  propsCategory,
  ...BASE_UI_CATEGORIES.slice(insertAt),
]);

export { TATTOO_UI_CONFIG };
