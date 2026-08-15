export const HAIR_ACCESSORIES = Object.freeze({
  id: "hair-accessories",
  name: "Hair Accessories",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "headband",
      name: "Headband",
      prompt: "headband",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "ribbon",
      name: "Ribbon",
      prompt: "ribbon",
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
      id: "hair-clip",
      name: "Hair Clip",
      prompt: "hair clip",
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
      id: "claw-clip",
      name: "Claw Clip",
      prompt: "claw clip",
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
      id: "barrette",
      name: "Barrette",
      prompt: "barrette",
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
      id: "scrunchie",
      name: "Scrunchie",
      prompt: "scrunchie",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "hair-scarf",
      name: "Hair Scarf",
      prompt: "hair scarf",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "tiara",
      name: "Tiara",
      prompt: "tiara",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-formal",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "flower-crown",
      name: "Flower Crown",
      prompt: "flower crown",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "decorative-hair-pins",
      name: "Decorative Hair Pins",
      prompt: "decorative hair pins",
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
