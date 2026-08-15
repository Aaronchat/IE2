const thighHighSocksCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
    { region: "ankle", side: "both" },
    { region: "foot", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const kneeHighSocksCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "lower-leg", side: "both" },
    { region: "ankle", side: "both" },
    { region: "foot", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const ankleSocksCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "ankle", side: "both" },
    { region: "foot", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
const legWarmersCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "lower-leg", side: "both" },
    { region: "ankle", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});
export const SOCKS_LEG_WARMERS = Object.freeze({
  id: "socks-leg-warmers",
  name: "Socks & Leg Warmers",
  defaults: Object.freeze({
    category: "hosiery",
    slot: "hosiery",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    {
      id: "thigh-high-socks",
      name: "Thigh-High Socks",
      prompt: "thigh-high socks",
      temperature: Object.freeze(["cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "casual",
      coverage: thighHighSocksCoverage,
    },
    {
      id: "over-the-knee-socks",
      name: "Over-the-Knee Socks",
      prompt: "over-the-knee socks",
      temperature: Object.freeze(["cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "casual",
      coverage: thighHighSocksCoverage,
    },
    {
      id: "knee-high-socks",
      name: "Knee-High Socks",
      prompt: "knee-high socks",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: kneeHighSocksCoverage,
    },
    {
      id: "striped-knee-high-socks",
      name: "Striped Knee-High Socks",
      prompt: "striped knee-high socks",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: kneeHighSocksCoverage,
    },
    {
      id: "athletic-knee-high-socks",
      name: "Athletic Knee-High Socks",
      prompt: "athletic knee-high socks",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "very-casual",
      coverage: kneeHighSocksCoverage,
    },
    {
      id: "slouch-socks",
      name: "Slouch Socks",
      prompt: "slouch socks",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "very-casual",
      coverage: kneeHighSocksCoverage,
    },
    {
      id: "crew-socks",
      name: "Crew Socks",
      prompt: "crew socks",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: kneeHighSocksCoverage,
    },
    {
      id: "ankle-socks",
      name: "Ankle Socks",
      prompt: "ankle socks",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "very-casual",
      coverage: ankleSocksCoverage,
    },
    {
      id: "ruffled-ankle-socks",
      name: "Ruffled Ankle Socks",
      prompt: "ruffled ankle socks",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "casual",
      coverage: ankleSocksCoverage,
    },
    {
      id: "leg-warmers",
      name: "Leg Warmers",
      prompt: "leg warmers",
      temperature: Object.freeze(["cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "very-casual",
      coverage: legWarmersCoverage,
    },
  ]),
});
