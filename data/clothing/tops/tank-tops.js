const standardTankCoverage = Object.freeze({
  covered: Object.freeze([
    { region: "chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "lower-abdomen", side: "both" },
    { region: "lower-back", side: "both" },
  ]),
  partiallyCovered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
});

const croppedTankCoverage = Object.freeze({
  covered: Object.freeze([{ region: "chest", side: "both" }]),
  partiallyCovered: Object.freeze([
    { region: "upper-chest", side: "both" },
    { region: "upper-abdomen", side: "both" },
    { region: "side-torso-ribs", side: "both" },
    { region: "upper-back", side: "both" },
  ]),
});

export const TANK_TOPS = Object.freeze({
  id: "tank-tops",
  name: "Tank Tops",
  defaults: Object.freeze({
    category: "tops",
    slot: "top",
    layer: "primary",
    enabled: true,
    selectionWeight: 1,
    coverage: standardTankCoverage,
  }),
  items: Object.freeze([
    {
      id: "fitted-tank-top",
      name: "Fitted Tank Top",
      prompt: "fitted tank top",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "ribbed-tank-top",
      name: "Ribbed Tank Top",
      prompt: "ribbed tank top",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "scoop-neck-tank-top",
      name: "Scoop-Neck Tank Top",
      prompt: "scoop-neck tank top",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "square-neck-tank-top",
      name: "Square-Neck Tank Top",
      prompt: "square-neck tank top",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "v-neck-tank-top",
      name: "V-Neck Tank Top",
      prompt: "V-neck tank top",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "halter-tank-top",
      name: "Halter Tank Top",
      prompt: "halter tank top",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "racerback-tank-top",
      name: "Racerback Tank Top",
      prompt: "racerback tank top",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "very-casual",
    },
    {
      id: "spaghetti-strap-camisole",
      name: "Spaghetti-Strap Camisole",
      prompt: "spaghetti-strap camisole",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "cowl-neck-camisole",
      name: "Cowl-Neck Camisole",
      prompt: "cowl-neck camisole",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
    },
    {
      id: "cropped-tank-top",
      name: "Cropped Tank Top",
      prompt: "cropped tank top",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "very-casual",
      coverage: croppedTankCoverage,
    },
  ]),
});
