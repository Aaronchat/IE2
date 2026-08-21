export const TIME_OF_DAY_CONFIG = Object.freeze({
  maxSelections: 1,
  none: Object.freeze({
    exclusive: true,
    contributesPrompt: false,
  }),
  randomVariants: Object.freeze([
    Object.freeze({ id: "bright", label: "Bright Random", uiValue: "bright-random" }),
    Object.freeze({ id: "dark", label: "Dark Random", uiValue: "dark-random" }),
  ]),
});
