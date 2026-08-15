const standardBallGownCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
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

export const BALL_GOWNS = Object.freeze({
  id: "ball-gowns",
  name: "Ball Gowns",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardBallGownCoverage,
    temperature: Object.freeze(["warm", "moderate", "cool"]),
    season: Object.freeze(["spring", "summer", "autumn", "winter"]),
    formality: "formal",
  }),
  items: Object.freeze([
    {
      id: "classic-ball-gown",
      name: "Classic Ball Gown",
      prompt: "classic ball gown",
    },
    {
      id: "princess-ball-gown",
      name: "Princess Ball Gown",
      prompt: "princess ball gown",
    },
    {
      id: "corset-bodice-ball-gown",
      name: "Corset-Bodice Ball Gown",
      prompt: "corset-bodice ball gown",
    },
    {
      id: "sweetheart-ball-gown",
      name: "Sweetheart Ball Gown",
      prompt: "sweetheart ball gown",
    },
    {
      id: "strapless-ball-gown",
      name: "Strapless Ball Gown",
      prompt: "strapless ball gown",
    },
    {
      id: "off-shoulder-ball-gown",
      name: "Off-Shoulder Ball Gown",
      prompt: "off-shoulder ball gown",
    },
    {
      id: "halter-ball-gown",
      name: "Halter Ball Gown",
      prompt: "halter ball gown",
    },
    {
      id: "one-shoulder-ball-gown",
      name: "One-Shoulder Ball Gown",
      prompt: "one-shoulder ball gown",
    },
    {
      id: "high-low-ball-gown",
      name: "High-Low Ball Gown",
      prompt: "high-low ball gown",
    },
    {
      id: "open-back-ball-gown",
      name: "Open-Back Ball Gown",
      prompt: "open-back ball gown",
    },
  ]),
});
