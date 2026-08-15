export const HEELS = Object.freeze({
  id: "heels",
  name: "Heels",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "pumps",
      name: "Pumps",
      prompt: "pumps",
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
      id: "stilettos",
      name: "Stilettos",
      prompt: "stilettos",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "platform-pumps",
      name: "Platform Pumps",
      prompt: "platform pumps",
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
      id: "ankle-strap-heels",
      name: "Ankle-Strap Heels",
      prompt: "ankle-strap heels",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "strappy-heels",
      name: "Strappy Heels",
      prompt: "strappy heels",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "peep-toe-heels",
      name: "Peep-Toe Heels",
      prompt: "peep-toe heels",
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
      id: "slingback-heels",
      name: "Slingback Heels",
      prompt: "slingback heels",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "block-heels",
      name: "Block Heels",
      prompt: "block heels",
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
      id: "kitten-heels",
      name: "Kitten Heels",
      prompt: "kitten heels",
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
      id: "open-toe-heels",
      name: "Open-Toe Heels",
      prompt: "open-toe heels",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "formal",
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
