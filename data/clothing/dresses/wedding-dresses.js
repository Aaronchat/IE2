const traditionalWeddingDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

const modernSleekWeddingDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const WEDDING_DRESSES = Object.freeze({
  id: "wedding-dresses",
  name: "Wedding Dresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    temperature: Object.freeze(["warm", "moderate", "cool"]),
    season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    formality: "formal",
  }),
  items: Object.freeze([
    {
      id: "traditional-wedding-dress",
      name: "Traditional Wedding Dress",
      prompt: "traditional wedding dress",
      coverage: traditionalWeddingDressCoverage,
    },
    {
      id: "modern-sleek-wedding-dress",
      name: "Modern Sleek Wedding Dress",
      prompt: "modern sleek wedding dress",
      coverage: modernSleekWeddingDressCoverage,
    },
  ]),
});
