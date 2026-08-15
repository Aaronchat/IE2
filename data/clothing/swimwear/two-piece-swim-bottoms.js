const shortSwimBottomCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const highWaistedSwimShortsCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "lower-abdomen", side: "both" },
    { region: "groin" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const longSwimBottomCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
export const TWO_PIECE_SWIM_BOTTOMS = Object.freeze({
  id: "two-piece-swim-bottoms",
  name: "Two-Piece Swim Bottoms",
  defaults: Object.freeze({
    category: "swimwear",
    slot: "bottom",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: shortSwimBottomCoverage,
    temperature: Object.freeze(["very-hot", "warm"]),
    season: Object.freeze(["spring", "summer"]),
    formality: "very-casual",
  }),
  items: Object.freeze([
    { id: "swim-shorts", name: "Swim Shorts", prompt: "swim shorts" },
    {
      id: "high-waisted-swim-shorts",
      name: "High-Waisted Swim Shorts",
      prompt: "high-waisted swim shorts",
      coverage: highWaistedSwimShortsCoverage,
    },
    { id: "board-shorts", name: "Board Shorts", prompt: "board shorts" },
    {
      id: "swim-pants",
      name: "Swim Pants",
      prompt: "swim pants",
      coverage: longSwimBottomCoverage,
    },
    { id: "boyleg-swim-shorts", name: "Boyleg Swim Shorts", prompt: "boyleg swim shorts" },
    { id: "swim-skirt", name: "Swim Skirt", prompt: "swim skirt" },
    { id: "skirted-swim-shorts", name: "Skirted Swim Shorts", prompt: "skirted swim shorts" },
    { id: "swim-skort", name: "Swim Skort", prompt: "swim skort" },
    {
      id: "swim-leggings",
      name: "Swim Leggings",
      prompt: "swim leggings",
      coverage: longSwimBottomCoverage,
    },
    {
      id: "capri-swim-leggings",
      name: "Capri Swim Leggings",
      prompt: "capri swim leggings",
      coverage: longSwimBottomCoverage,
    },
  ]),
});
