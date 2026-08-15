const standardEveningGownCoverage = Object.freeze({
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

export const EVENING_GOWNS = Object.freeze({
  id: "evening-gowns",
  name: "Evening Gowns",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardEveningGownCoverage,
    temperature: Object.freeze(["warm", "moderate", "cool"]),
    season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    formality: "formal",
  }),
  items: Object.freeze([
    {
      id: "mermaid-evening-gown",
      name: "Mermaid Evening Gown",
      prompt: "mermaid evening gown",
    },
    {
      id: "a-line-evening-gown",
      name: "A-Line Evening Gown",
      prompt: "A-line evening gown",
    },
    {
      id: "column-evening-gown",
      name: "Column Evening Gown",
      prompt: "column evening gown",
    },
    {
      id: "sheath-evening-gown",
      name: "Sheath Evening Gown",
      prompt: "sheath evening gown",
    },
    {
      id: "deep-v-evening-gown",
      name: "Deep-V Evening Gown",
      prompt: "deep-V evening gown",
    },
    {
      id: "sweetheart-evening-gown",
      name: "Sweetheart Evening Gown",
      prompt: "sweetheart evening gown",
    },
    {
      id: "halter-evening-gown",
      name: "Halter Evening Gown",
      prompt: "halter evening gown",
    },
    {
      id: "strapless-evening-gown",
      name: "Strapless Evening Gown",
      prompt: "strapless evening gown",
    },
    {
      id: "one-shoulder-evening-gown",
      name: "One-Shoulder Evening Gown",
      prompt: "one-shoulder evening gown",
    },
    {
      id: "off-shoulder-evening-gown",
      name: "Off-Shoulder Evening Gown",
      prompt: "off-shoulder evening gown",
    },
  ]),
});
