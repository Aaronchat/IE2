export const BELTS = Object.freeze({
  id: "belts",
  name: "Belts",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "leather-belt",
      name: "Leather Belt",
      prompt: "leather belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "wide-waist-belt",
      name: "Wide Waist Belt",
      prompt: "wide waist belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-abdomen", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "chain-belt",
      name: "Chain Belt",
      prompt: "chain belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "corset-belt",
      name: "Corset Belt",
      prompt: "corset belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-abdomen", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "western-belt",
      name: "Western Belt",
      prompt: "western belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "studded-belt",
      name: "Studded Belt",
      prompt: "studded belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "utility-belt",
      name: "Utility Belt",
      prompt: "utility belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "fashion-belt",
      name: "Fashion Belt",
      prompt: "fashion belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "decorative-belt",
      name: "Decorative Belt",
      prompt: "decorative belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "statement-belt",
      name: "Statement Belt",
      prompt: "statement belt",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
  ]),
});
