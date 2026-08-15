const standardSundressCoverage = Object.freeze({
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

const sundressUpperBackCoverage = Object.freeze({
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
    { region: "upper-back", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const SUNDRESSES = Object.freeze({
  id: "sundresses",
  name: "Sundresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardSundressCoverage,
    temperature: Object.freeze(["very-hot", "warm", "moderate"]),
    season: Object.freeze(["spring", "summer", "autumn"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "spaghetti-strap-sundress",
      name: "Spaghetti-Strap Sundress",
      prompt: "spaghetti-strap sundress",
    },
    {
      id: "halter-sundress",
      name: "Halter Sundress",
      prompt: "halter sundress",
    },
    {
      id: "sweetheart-sundress",
      name: "Sweetheart Sundress",
      prompt: "sweetheart sundress",
    },
    {
      id: "wrap-sundress",
      name: "Wrap Sundress",
      prompt: "wrap sundress",
    },
    {
      id: "button-front-sundress",
      name: "Button-Front Sundress",
      prompt: "button-front sundress",
    },
    {
      id: "tie-back-sundress",
      name: "Tie-Back Sundress",
      prompt: "tie-back sundress",
      coverage: sundressUpperBackCoverage,
    },
    {
      id: "off-shoulder-sundress",
      name: "Off-Shoulder Sundress",
      prompt: "off-shoulder sundress",
    },
    {
      id: "empire-waist-sundress",
      name: "Empire-Waist Sundress",
      prompt: "empire-waist sundress",
    },
    {
      id: "smocked-bodice-sundress",
      name: "Smocked-Bodice Sundress",
      prompt: "smocked-bodice sundress",
    },
    {
      id: "backless-sundress",
      name: "Backless Sundress",
      prompt: "backless sundress",
      coverage: sundressUpperBackCoverage,
    },
  ]),
});
