export const FLATS_CLASSIC_SHOES = Object.freeze({
  id: "flats-classic-shoes",
  name: "Flats & Classic Shoes",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "ballet-flats",
      name: "Ballet Flats",
      prompt: "ballet flats",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "pointed-toe-flats",
      name: "Pointed-Toe Flats",
      prompt: "pointed-toe flats",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "loafers",
      name: "Loafers",
      prompt: "loafers",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "oxfords",
      name: "Oxfords",
      prompt: "oxfords",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "mary-janes",
      name: "Mary Janes",
      prompt: "mary janes",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "espadrilles",
      name: "Espadrilles",
      prompt: "espadrilles",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "mules",
      name: "Mules",
      prompt: "mules",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "slingback-flats",
      name: "Slingback Flats",
      prompt: "slingback flats",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "dorsay-flats",
      name: "D’Orsay Flats",
      prompt: "d’orsay flats",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "driving-moccasins",
      name: "Driving Moccasins",
      prompt: "driving moccasins",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
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
  ]),
});
