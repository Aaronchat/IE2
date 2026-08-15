const standardMiniDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

const blazerMiniDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-leg", side: "both" },
    { region: "upper-arm", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const MINI_DRESSES = Object.freeze({
  id: "mini-dresses",
  name: "Mini Dresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardMiniDressCoverage,
    temperature: Object.freeze(["very-hot", "warm", "moderate"]),
    season: Object.freeze(["spring", "summer", "autumn"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "fitted-mini-dress",
      name: "Fitted Mini Dress",
      prompt: "fitted mini dress",
    },
    {
      id: "deep-v-mini-dress",
      name: "Deep-V Mini Dress",
      prompt: "deep-V mini dress",
    },
    {
      id: "sweetheart-mini-dress",
      name: "Sweetheart Mini Dress",
      prompt: "sweetheart mini dress",
    },
    {
      id: "strapless-mini-dress",
      name: "Strapless Mini Dress",
      prompt: "strapless mini dress",
    },
    {
      id: "halter-mini-dress",
      name: "Halter Mini Dress",
      prompt: "halter mini dress",
    },
    {
      id: "one-shoulder-mini-dress",
      name: "One-Shoulder Mini Dress",
      prompt: "one-shoulder mini dress",
    },
    {
      id: "off-shoulder-mini-dress",
      name: "Off-Shoulder Mini Dress",
      prompt: "off-shoulder mini dress",
    },
    {
      id: "wrap-mini-dress",
      name: "Wrap Mini Dress",
      prompt: "wrap mini dress",
    },
    {
      id: "blazer-mini-dress",
      name: "Blazer Mini Dress",
      prompt: "blazer mini dress",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: blazerMiniDressCoverage,
    },
    {
      id: "cutout-mini-dress",
      name: "Cutout Mini Dress",
      prompt: "cutout mini dress",
    },
  ]),
});
