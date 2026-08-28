import { CHARACTER_PHYSICAL_APPEARANCE } from "../data/character/physical-appearance.js";
import { TATTOO_UI_CONFIG, UI_CATEGORIES as BASE_UI_CATEGORIES } from "./ui-data-2.1h.js";

const option = (value, label = value, groupId = null) => Object.freeze({ value, label, groupId });

function cloneControl(control, changes = {}) {
  return Object.freeze({ ...control, ...changes });
}

function pregnancyControl() {
  return Object.freeze({
    id: "character.pregnancy",
    label: "Pregnancy",
    options: Object.freeze(CHARACTER_PHYSICAL_APPEARANCE.pregnancy.map((value) => option(value))),
    groupedOptions: Object.freeze([]),
    random: false,
    none: false,
    noneLabel: "None",
    defaultValue: null,
    defaultMode: "unselected",
    maxSelections: 1,
    note: "Optional. Blank means no pregnancy setting.",
    inputType: "select",
    placeholder: "",
    toggle: false,
  });
}

function rewriteCharacter(category) {
  const sections = category.sections.map((section) => {
    if (section.id === "skin") {
      return Object.freeze({
        ...section,
        controls: Object.freeze(section.controls.map((control) => control.id === "character.skin-condition"
          ? cloneControl(control, { random: true, note: "Manual multi-select, or Random for one condition." })
          : control)),
      });
    }
    if (section.id === "physical-appearance") {
      const controls = section.controls.some((control) => control.id === "character.pregnancy")
        ? section.controls
        : [...section.controls, pregnancyControl()];
      return Object.freeze({ ...section, controls: Object.freeze(controls) });
    }
    if (section.id === "features") {
      return Object.freeze({
        ...section,
        controls: Object.freeze(section.controls.map((control) => control.id === "character.features"
          ? cloneControl(control, { random: true, note: "Manual multi-select, or Random for one feature." })
          : control)),
      });
    }
    return section;
  });
  return Object.freeze({ ...category, sections: Object.freeze(sections) });
}

function rewriteProps(category) {
  return Object.freeze({
    ...category,
    action: cloneControl(category.action, {
      random: true,
      note: "Manual multi-select up to three Props, or Random for one Prop.",
    }),
  });
}

function rewriteLocation(category) {
  const randomVariants = Object.freeze({
    groupId: "random-variants",
    label: "Random Subsets",
    options: Object.freeze([
      option("random-indoor", "Random Indoor", "random-variants"),
      option("random-outdoor", "Random Outdoor", "random-variants"),
    ]),
  });
  return Object.freeze({
    ...category,
    action: cloneControl(category.action, {
      groupedOptions: Object.freeze([randomVariants, ...(category.action.groupedOptions ?? [])]),
      note: "Use Random for any Location, or choose Random Indoor / Random Outdoor.",
    }),
  });
}

export const UI_CATEGORIES = Object.freeze(BASE_UI_CATEGORIES.map((category) => {
  if (category.id === "character") return rewriteCharacter(category);
  if (category.id === "props") return rewriteProps(category);
  if (category.id === "location") return rewriteLocation(category);
  return category;
}));

export { TATTOO_UI_CONFIG };
