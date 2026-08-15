export const SNEAKERS_ATHLETIC_SHOES = Object.freeze({
  id: "sneakers-athletic-shoes",
  name: "Sneakers & Athletic Shoes",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "classic-sneakers",
      name: "Classic Sneakers",
      prompt: "classic sneakers",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "running-shoes",
      name: "Running Shoes",
      prompt: "running shoes",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "skate-shoes",
      name: "Skate Shoes",
      prompt: "skate shoes",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "high-top-sneakers",
      name: "High-Top Sneakers",
      prompt: "high-top sneakers",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "retro-sneakers",
      name: "Retro Sneakers",
      prompt: "retro sneakers",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "canvas-sneakers",
      name: "Canvas Sneakers",
      prompt: "canvas sneakers",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "slip-on-sneakers",
      name: "Slip-On Sneakers",
      prompt: "slip-on sneakers",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "trail-shoes",
      name: "Trail Shoes",
      prompt: "trail shoes",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "chunky-sneakers",
      name: "Chunky Sneakers",
      prompt: "chunky sneakers",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "cross-training-shoes",
      name: "Cross-Training Shoes",
      prompt: "cross-training shoes",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
  ]),
});
