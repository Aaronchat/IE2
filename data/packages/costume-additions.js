export const SAFARI_GUIDE_COSTUME = Object.freeze({
  id: "safari-guide",
  name: "Safari Guide",
  prompt: "safari guide outfit (khaki short-sleeve safari shirt, utility shorts, field belt)",
  temperature: Object.freeze(["very-hot", "warm", "moderate"]),
  season: Object.freeze(["spring", "summer", "autumn"]),
  formality: "very-casual",
  coverage: Object.freeze({
    covered: Object.freeze([
      Object.freeze({ region: "shoulder", side: "both" }),
      Object.freeze({ region: "upper-chest", side: "both" }),
      Object.freeze({ region: "chest", side: "both" }),
      Object.freeze({ region: "upper-abdomen", side: "both" }),
      Object.freeze({ region: "lower-abdomen", side: "both" }),
      Object.freeze({ region: "side-torso-ribs", side: "both" }),
      Object.freeze({ region: "upper-back", side: "both" }),
      Object.freeze({ region: "lower-back", side: "both" }),
      Object.freeze({ region: "groin" }),
      Object.freeze({ region: "outer-hip", side: "both" }),
      Object.freeze({ region: "buttocks", side: "both" }),
    ]),
    partiallyCovered: Object.freeze([
      Object.freeze({ region: "upper-arm", side: "both" }),
      Object.freeze({ region: "upper-leg", side: "both" }),
    ]),
  }),
});
