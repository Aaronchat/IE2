export const BOOTS = Object.freeze({
  id: "boots",
  name: "Boots",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "ankle-boots",
      name: "Ankle Boots",
      prompt: "ankle boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
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
      id: "chelsea-boots",
      name: "Chelsea Boots",
      prompt: "chelsea boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "cowboy-boots",
      name: "Cowboy Boots",
      prompt: "cowboy boots",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "combat-boots",
      name: "Combat Boots",
      prompt: "combat boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "knee-high-boots",
      name: "Knee-High Boots",
      prompt: "knee-high boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "over-the-knee-boots",
      name: "Over-the-Knee Boots",
      prompt: "over-the-knee boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "upper-leg", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "riding-boots",
      name: "Riding Boots",
      prompt: "riding boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "slouch-boots",
      name: "Slouch Boots",
      prompt: "slouch boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "western-ankle-boots",
      name: "Western Ankle Boots",
      prompt: "western ankle boots",
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
      id: "hiking-boots",
      name: "Hiking Boots",
      prompt: "hiking boots",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
          Object.freeze({ region: "ankle", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
  ]),
});
