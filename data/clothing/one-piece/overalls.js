const overallBaseCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

const overallFullLegCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "upper-back", side: "both" },
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

export const OVERALLS = Object.freeze({
  id: "overalls",
  name: "Overalls",
  defaults: Object.freeze({
    category: "one-piece",
    slot: "one-piece",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: overallBaseCoverage,
    temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
    season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "classic-denim-overalls",
      name: "Classic Denim Overalls",
      prompt: "classic denim overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "fitted-denim-overalls",
      name: "Fitted Denim Overalls",
      prompt: "fitted denim overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "short-overalls",
      name: "Short Overalls",
      prompt: "short overalls",
    },
    {
      id: "distressed-denim-overalls",
      name: "Distressed Denim Overalls",
      prompt: "distressed denim overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "black-denim-overalls",
      name: "Black Denim Overalls",
      prompt: "black denim overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "white-denim-overalls",
      name: "White Denim Overalls",
      prompt: "white denim overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "wide-leg-overalls",
      name: "Wide-Leg Overalls",
      prompt: "wide-leg overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "flared-overalls",
      name: "Flared Overalls",
      prompt: "flared overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "utility-overalls",
      name: "Utility Overalls",
      prompt: "utility overalls",
      coverage: overallFullLegCoverage,
    },
    {
      id: "bib-overalls",
      name: "Bib Overalls",
      prompt: "bib overalls",
      coverage: overallFullLegCoverage,
    },
  ]),
});
