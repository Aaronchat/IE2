const standardBikiniBottomCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const highWaistedBikiniBottomCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "lower-abdomen", side: "both" },
    { region: "groin" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const boyshortBikiniBottomCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
export const BIKINI_BOTTOMS = Object.freeze({
  id: "bikini-bottoms",
  name: "Bikini Bottoms",
  defaults: Object.freeze({
    category: "swimwear",
    slot: "bottom",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardBikiniBottomCoverage,
    temperature: Object.freeze(["very-hot", "warm"]),
    season: Object.freeze(["spring", "summer"]),
    formality: "very-casual",
  }),
  items: Object.freeze([
    { id: "classic-bikini-bottom", name: "Classic Bikini Bottom", prompt: "classic bikini bottom" },
    { id: "brazilian-bikini-bottom", name: "Brazilian Bikini Bottom", prompt: "Brazilian bikini bottom" },
    { id: "thong-bikini-bottom", name: "Thong Bikini Bottom", prompt: "thong bikini bottom" },
    {
      id: "high-waisted-bikini-bottom",
      name: "High-Waisted Bikini Bottom",
      prompt: "high-waisted bikini bottom",
      coverage: highWaistedBikiniBottomCoverage,
    },
    { id: "hipster-bikini-bottom", name: "Hipster Bikini Bottom", prompt: "hipster bikini bottom" },
    { id: "cheeky-bikini-bottom", name: "Cheeky Bikini Bottom", prompt: "cheeky bikini bottom" },
    { id: "side-tie-bikini-bottom", name: "Side-Tie Bikini Bottom", prompt: "side-tie bikini bottom" },
    { id: "high-cut-bikini-bottom", name: "High-Cut Bikini Bottom", prompt: "high-cut bikini bottom" },
    { id: "ruched-bikini-bottom", name: "Ruched Bikini Bottom", prompt: "ruched bikini bottom" },
    {
      id: "boyshort-bikini-bottom",
      name: "Boyshort Bikini Bottom",
      prompt: "boyshort bikini bottom",
      coverage: boyshortBikiniBottomCoverage,
    },
  ]),
});
