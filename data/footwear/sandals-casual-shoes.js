export const SANDALS_CASUAL_SHOES = Object.freeze({
  id: "sandals-casual-shoes",
  name: "Sandals & Casual Shoes",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "flat-sandals",
      name: "Flat Sandals",
      prompt: "flat sandals",
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
      id: "strappy-sandals",
      name: "Strappy Sandals",
      prompt: "strappy sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "gladiator-sandals",
      name: "Gladiator Sandals",
      prompt: "gladiator sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "foot", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "ankle", side: "both" }),
          Object.freeze({ region: "lower-leg", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "slide-sandals",
      name: "Slide Sandals",
      prompt: "slide sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "flip-flops",
      name: "Flip-Flops",
      prompt: "flip-flops",
      temperature: Object.freeze(["very-hot", "warm"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "wedge-sandals",
      name: "Wedge Sandals",
      prompt: "wedge sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "platform-sandals",
      name: "Platform Sandals",
      prompt: "platform sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "thong-sandals",
      name: "Thong Sandals",
      prompt: "thong sandals",
      temperature: Object.freeze(["very-hot", "warm"]),
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
      id: "espadrille-wedges",
      name: "Espadrille Wedges",
      prompt: "espadrille wedges",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
      id: "sport-sandals",
      name: "Sport Sandals",
      prompt: "sport sandals",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
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
