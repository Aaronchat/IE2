const tankiniBaseCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const tankiniSleeveRuleCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const swimTopSleeveRuleCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const longSleeveSwimTopCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
    { region: "wrist", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
export const TWO_PIECE_SWIM_TOPS = Object.freeze({
  id: "two-piece-swim-tops",
  name: "Two-Piece Swim Tops",
  defaults: Object.freeze({
    category: "swimwear",
    slot: "top",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: tankiniSleeveRuleCoverage,
    temperature: Object.freeze(["very-hot", "warm"]),
    season: Object.freeze(["spring", "summer"]),
    formality: "very-casual",
  }),
  items: Object.freeze([
    { id: "tankini-top", name: "Tankini Top", prompt: "tankini top" },
    { id: "high-neck-tankini-top", name: "High-Neck Tankini Top", prompt: "high-neck tankini top" },
    {
      id: "halter-tankini-top",
      name: "Halter Tankini Top",
      prompt: "halter tankini top",
      coverage: tankiniBaseCoverage,
    },
    { id: "underwire-tankini-top", name: "Underwire Tankini Top", prompt: "underwire tankini top" },
    { id: "peplum-tankini-top", name: "Peplum Tankini Top", prompt: "peplum tankini top" },
    { id: "empire-waist-tankini-top", name: "Empire-Waist Tankini Top", prompt: "empire-waist tankini top" },
    {
      id: "cropped-swim-top",
      name: "Cropped Swim Top",
      prompt: "cropped swim top",
      coverage: swimTopSleeveRuleCoverage,
    },
    {
      id: "long-sleeve-swim-top",
      name: "Long-Sleeve Swim Top",
      prompt: "long-sleeve swim top",
      coverage: longSleeveSwimTopCoverage,
    },
    {
      id: "zip-front-swim-top",
      name: "Zip-Front Swim Top",
      prompt: "zip-front swim top",
      coverage: swimTopSleeveRuleCoverage,
    },
    {
      id: "wrap-swim-top",
      name: "Wrap Swim Top",
      prompt: "wrap swim top",
      coverage: swimTopSleeveRuleCoverage,
    },
  ]),
});
