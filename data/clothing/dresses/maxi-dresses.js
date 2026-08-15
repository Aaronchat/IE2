const standardMaxiDressCoverage = Object.freeze({
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

const backlessMaxiDressCoverage = Object.freeze({
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
    { region: "upper-back", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const MAXI_DRESSES = Object.freeze({
  id: "maxi-dresses",
  name: "Maxi Dresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardMaxiDressCoverage,
    temperature: Object.freeze(["warm", "moderate"]),
    season: Object.freeze(["spring", "summer", "autumn"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "deep-v-maxi-dress",
      name: "Deep-V Maxi Dress",
      prompt: "deep-V maxi dress",
    },
    {
      id: "sweetheart-maxi-dress",
      name: "Sweetheart Maxi Dress",
      prompt: "sweetheart maxi dress",
    },
    {
      id: "halter-maxi-dress",
      name: "Halter Maxi Dress",
      prompt: "halter maxi dress",
    },
    {
      id: "strapless-maxi-dress",
      name: "Strapless Maxi Dress",
      prompt: "strapless maxi dress",
    },
    {
      id: "wrap-maxi-dress",
      name: "Wrap Maxi Dress",
      prompt: "wrap maxi dress",
    },
    {
      id: "high-slit-maxi-dress",
      name: "High-Slit Maxi Dress",
      prompt: "high-slit maxi dress",
    },
    {
      id: "off-shoulder-maxi-dress",
      name: "Off-Shoulder Maxi Dress",
      prompt: "off-shoulder maxi dress",
    },
    {
      id: "one-shoulder-maxi-dress",
      name: "One-Shoulder Maxi Dress",
      prompt: "one-shoulder maxi dress",
    },
    {
      id: "backless-maxi-dress",
      name: "Backless Maxi Dress",
      prompt: "backless maxi dress",
      coverage: backlessMaxiDressCoverage,
    },
    {
      id: "empire-waist-maxi-dress",
      name: "Empire-Waist Maxi Dress",
      prompt: "empire-waist maxi dress",
    },
  ]),
});
