export const ATMOSPHERE_CONFIG = Object.freeze({
  maxSelections: 2,
  none: Object.freeze({
    exclusive: true,
    contributesPrompt: false,
  }),
  prohibitedFamilyPairs: Object.freeze([
    Object.freeze(["clear", "non-clear"]),
    Object.freeze(["wind", "wind"]),
  ]),
  preventSameGroupStacking: true,
  locationEnvironmentBehavior: Object.freeze({
    indoor: "none",
    outdoor: "active",
    "indoor-exterior-view": "active",
  }),
  locationRestrictions: Object.freeze({
    "rainy-neon-alley": Object.freeze({
      blockedFamilies: Object.freeze(["clear"]),
    }),
  }),
});
