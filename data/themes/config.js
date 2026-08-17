export const THEMES_CONFIG = Object.freeze({
  maxSelections: 3,
  randomStackSizeWeights: Object.freeze([
    Object.freeze({ count: 1, weight: 50 }),
    Object.freeze({ count: 2, weight: 40 }),
    Object.freeze({ count: 3, weight: 10 }),
  ]),
  none: Object.freeze({
    exclusive: true,
    contributesPrompt: false,
  }),
});
