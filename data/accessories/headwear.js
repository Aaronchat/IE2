export const HEADWEAR = Object.freeze({
  id: "headwear",
  name: "Headwear",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "baseball-cap",
      name: "Baseball Cap",
      prompt: "baseball cap",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
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
      id: "beanie",
      name: "Beanie",
      prompt: "beanie",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter", "spring"]),
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
      id: "cowboy-hat",
      name: "Cowboy Hat",
      prompt: "cowboy hat",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
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
      id: "sun-hat",
      name: "Sun Hat",
      prompt: "sun hat",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "wide-brim-hat",
      name: "Wide-Brim Hat",
      prompt: "wide-brim hat",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
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
      id: "beret",
      name: "Beret",
      prompt: "beret",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter", "spring"]),
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
      id: "bucket-hat",
      name: "Bucket Hat",
      prompt: "bucket hat",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
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
      id: "newsboy-cap",
      name: "Newsboy Cap",
      prompt: "newsboy cap",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
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
      id: "fascinator",
      name: "Fascinator",
      prompt: "fascinator",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "witch-hat",
      name: "Witch Hat",
      prompt: "witch hat",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "very-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "head-scalp", side: "both" }),
        ]),
      }),
    }),
  ]),
});
