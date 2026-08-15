const standardBikiniTopCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const bandeauBikiniTopCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const longlineBikiniTopCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "shoulder", side: "both" },
    { region: "upper-abdomen", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
export const BIKINI_TOPS = Object.freeze({
  id: "bikini-tops",
  name: "Bikini Tops",
  defaults: Object.freeze({
    category: "swimwear",
    slot: "top",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardBikiniTopCoverage,
    temperature: Object.freeze(["very-hot", "warm"]),
    season: Object.freeze(["spring", "summer"]),
    formality: "very-casual",
  }),
  items: Object.freeze([
    { id: "triangle-bikini-top", name: "Triangle Bikini Top", prompt: "triangle bikini top" },
    { id: "string-bikini-top", name: "String Bikini Top", prompt: "string bikini top" },
    {
      id: "bandeau-bikini-top",
      name: "Bandeau Bikini Top",
      prompt: "bandeau bikini top",
      coverage: bandeauBikiniTopCoverage,
    },
    { id: "halter-bikini-top", name: "Halter Bikini Top", prompt: "halter bikini top" },
    { id: "underwire-bikini-top", name: "Underwire Bikini Top", prompt: "underwire bikini top" },
    { id: "balconette-bikini-top", name: "Balconette Bikini Top", prompt: "balconette bikini top" },
    { id: "high-neck-bikini-top", name: "High-Neck Bikini Top", prompt: "high-neck bikini top" },
    {
      id: "longline-bikini-top",
      name: "Longline Bikini Top",
      prompt: "longline bikini top",
      coverage: longlineBikiniTopCoverage,
    },
    { id: "one-shoulder-bikini-top", name: "One-Shoulder Bikini Top", prompt: "one-shoulder bikini top" },
    { id: "strappy-bikini-top", name: "Strappy Bikini Top", prompt: "strappy bikini top" },
  ]),
});
