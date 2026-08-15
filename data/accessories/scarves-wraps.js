export const SCARVES_WRAPS = Object.freeze({
  id: "scarves-wraps",
  name: "Scarves & Wraps",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "silk-scarf",
      name: "Silk Scarf",
      prompt: "silk scarf",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "neck-scarf",
      name: "Neck Scarf",
      prompt: "neck scarf",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "knit-scarf",
      name: "Knit Scarf",
      prompt: "knit scarf",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter", "spring"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "sheer-wrap",
      name: "Sheer Wrap",
      prompt: "sheer wrap",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "shoulder", side: "both" }),
          Object.freeze({ region: "upper-arm", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
          Object.freeze({ region: "upper-back", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "shawl",
      name: "Shawl",
      prompt: "shawl",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "shoulder", side: "both" }),
          Object.freeze({ region: "upper-arm", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
          Object.freeze({ region: "upper-back", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "pashmina",
      name: "Pashmina",
      prompt: "pashmina",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "shoulder", side: "both" }),
          Object.freeze({ region: "upper-arm", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
          Object.freeze({ region: "upper-back", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "fur-stole",
      name: "Fur Stole",
      prompt: "fur stole",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
          Object.freeze({ region: "shoulder", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
          Object.freeze({ region: "upper-back", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "feather-boa",
      name: "Feather Boa",
      prompt: "feather boa",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "bandana",
      name: "Bandana",
      prompt: "bandana",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "hooded-scarf",
      name: "Hooded Scarf",
      prompt: "hooded scarf",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter", "spring"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
          Object.freeze({ region: "neck", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
        ]),
      }),
    }),
  ]),
});
