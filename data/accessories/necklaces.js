export const NECKLACES = Object.freeze({
  id: "necklaces",
  name: "Necklaces",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "gold-necklace",
      name: "Gold Necklace",
      prompt: "gold necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "silver-necklace",
      name: "Silver Necklace",
      prompt: "silver necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "chain-necklace",
      name: "Chain Necklace",
      prompt: "chain necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
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
      id: "pendant-necklace",
      name: "Pendant Necklace",
      prompt: "pendant necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "gold-necklace-with-spade-pendant",
      name: "Gold Necklace with Spade Pendant",
      prompt: "gold necklace with spade pendant",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "silver-necklace-with-spade-pendant",
      name: "Silver Necklace with Spade Pendant",
      prompt: "silver necklace with spade pendant",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "layered-necklace",
      name: "Layered Necklace",
      prompt: "layered necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "pearl-necklace",
      name: "Pearl Necklace",
      prompt: "pearl necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "formal",
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
      id: "lariat-necklace",
      name: "Lariat Necklace",
      prompt: "lariat necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "statement-necklace",
      name: "Statement Necklace",
      prompt: "statement necklace",
      temperature: Object.freeze(["very-hot", "warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "neck", side: "both" }),
          Object.freeze({ region: "upper-chest", side: "both" }),
        ]),
      }),
    }),
  ]),
});
