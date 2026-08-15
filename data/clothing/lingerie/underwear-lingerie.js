const braPantySetCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "chest", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
  ]),
  partiallyCovered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
});
const camiTapShortsCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
});
const garterLingerieCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "chest", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "groin" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "upper-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
});
export const UNDERWEAR_LINGERIE = Object.freeze({
  id: "underwear-lingerie",
  name: "Underwear & Lingerie",
  defaults: Object.freeze({
    category: "lingerie",
    enabled: true,
    selectionWeight: 1,
    formality: "very-casual",
    coverage: braPantySetCoverage,
  }),
  items: Object.freeze([
    {
      id: "bra-and-panty-set",
      name: "Bra and Panty Set",
      prompt: "bra and panty set",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    },
    {
      id: "matching-lingerie-set",
      name: "Matching Lingerie Set",
      prompt: "matching lingerie set",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    },
    {
      id: "camisole-and-tap-shorts-set",
      name: "Camisole and Tap Shorts Set",
      prompt: "camisole and tap shorts set",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      coverage: camiTapShortsCoverage,
    },
    {
      id: "satin-slip",
      name: "Satin Slip",
      prompt: "satin slip",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      coverage: camiTapShortsCoverage,
    },
    {
      id: "babydoll-lingerie-set",
      name: "Babydoll Lingerie Set",
      prompt: "babydoll lingerie set",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      coverage: camiTapShortsCoverage,
    },
    {
      id: "garter-lingerie-set",
      name: "Garter Lingerie Set",
      prompt: "garter lingerie set",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      coverage: garterLingerieCoverage,
    },
  ]),
});
