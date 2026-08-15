const standardSweaterDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

const turtleneckSweaterDressCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "shoulder", side: "both" },
    { region: "upper-chest", side: "both" },
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
    { region: "lower-back", side: "both" },
    { region: "outer-hip", side: "both" },
    { region: "buttocks", side: "both" },
    { region: "groin" },
    { region: "upper-arm", side: "both" },
    { region: "lower-arm", side: "both" },
    { region: "upper-leg", side: "both" },
    { region: "lower-leg", side: "both" },
    { region: "neck", side: "both" },
  ]),
  partiallyCovered: Object.freeze([]),
});

export const SWEATER_DRESSES = Object.freeze({
  id: "sweater-dresses",
  name: "Sweater Dresses",
  defaults: Object.freeze({
    category: "dresses",
    slot: "dress",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardSweaterDressCoverage,
    temperature: Object.freeze(["moderate", "cool", "cold"]),
    season: Object.freeze(["autumn", "winter", "spring"]),
    formality: "casual",
  }),
  items: Object.freeze([
    {
      id: "fitted-sweater-dress",
      name: "Fitted Sweater Dress",
      prompt: "fitted sweater dress",
    },
    {
      id: "ribbed-sweater-dress",
      name: "Ribbed Sweater Dress",
      prompt: "ribbed sweater dress",
    },
    {
      id: "off-shoulder-sweater-dress",
      name: "Off-Shoulder Sweater Dress",
      prompt: "off-shoulder sweater dress",
    },
    {
      id: "fitted-turtleneck-sweater-dress",
      name: "Fitted Turtleneck Sweater Dress",
      prompt: "fitted turtleneck sweater dress",
      coverage: turtleneckSweaterDressCoverage,
    },
    {
      id: "mock-neck-sweater-dress",
      name: "Mock-Neck Sweater Dress",
      prompt: "mock-neck sweater dress",
    },
    {
      id: "v-neck-sweater-dress",
      name: "V-Neck Sweater Dress",
      prompt: "V-neck sweater dress",
    },
    {
      id: "scoop-neck-sweater-dress",
      name: "Scoop-Neck Sweater Dress",
      prompt: "scoop-neck sweater dress",
    },
    {
      id: "sweetheart-sweater-dress",
      name: "Sweetheart Sweater Dress",
      prompt: "sweetheart sweater dress",
    },
    {
      id: "wrap-sweater-dress",
      name: "Wrap Sweater Dress",
      prompt: "wrap sweater dress",
    },
    {
      id: "button-front-sweater-dress",
      name: "Button-Front Sweater Dress",
      prompt: "button-front sweater dress",
    },
  ]),
});
