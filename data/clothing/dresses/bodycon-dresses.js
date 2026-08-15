const standardBodyconCoverage = Object.freeze({
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
    { region: "lower-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

const longSleeveBodyconCoverage = Object.freeze({
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
    { region: "lower-leg", side: "both" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const BODYCON_DRESSES = Object.freeze({
  id: "bodycon-dresses",
  name: "Bodycon Dresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardBodyconCoverage,
    temperature: Object.freeze(["very-hot", "warm", "moderate"]),
    season: Object.freeze(["spring", "summer", "autumn"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "scoop-neck-bodycon-dress",
      name: "Scoop-Neck Bodycon Dress",
      prompt: "scoop-neck bodycon dress",
    },
    {
      id: "square-neck-bodycon-dress",
      name: "Square-Neck Bodycon Dress",
      prompt: "square-neck bodycon dress",
    },
    {
      id: "deep-v-bodycon-dress",
      name: "Deep-V Bodycon Dress",
      prompt: "deep-V bodycon dress",
    },
    {
      id: "sweetheart-bodycon-dress",
      name: "Sweetheart Bodycon Dress",
      prompt: "sweetheart bodycon dress",
    },
    {
      id: "halter-bodycon-dress",
      name: "Halter Bodycon Dress",
      prompt: "halter bodycon dress",
    },
    {
      id: "strapless-bodycon-dress",
      name: "Strapless Bodycon Dress",
      prompt: "strapless bodycon dress",
    },
    {
      id: "one-shoulder-bodycon-dress",
      name: "One-Shoulder Bodycon Dress",
      prompt: "one-shoulder bodycon dress",
    },
    {
      id: "off-shoulder-bodycon-dress",
      name: "Off-Shoulder Bodycon Dress",
      prompt: "off-shoulder bodycon dress",
    },
    {
      id: "long-sleeve-bodycon-dress",
      name: "Long-Sleeve Bodycon Dress",
      prompt: "long-sleeve bodycon dress",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      coverage: longSleeveBodyconCoverage,
    },
    {
      id: "ruched-bodycon-dress",
      name: "Ruched Bodycon Dress",
      prompt: "ruched bodycon dress",
    },
  ]),
});
