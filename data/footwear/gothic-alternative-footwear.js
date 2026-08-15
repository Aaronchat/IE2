export const GOTHIC_ALTERNATIVE_FOOTWEAR = Object.freeze({
  id: "gothic-alternative-footwear",
  name: "Gothic & Alternative Footwear",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "platform-boots",
      name: "Platform Boots",
      prompt: "platform boots",
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
      id: "platform-combat-boots",
      name: "Platform Combat Boots",
      prompt: "platform combat boots",
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
      id: "platform-ankle-boots",
      name: "Platform Ankle Boots",
      prompt: "platform ankle boots",
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
      id: "platform-knee-high-boots",
      name: "Platform Knee-High Boots",
      prompt: "platform knee-high boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "casual",
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
      id: "lace-up-gothic-boots",
      name: "Lace-Up Gothic Boots",
      prompt: "lace-up gothic boots",
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
      id: "buckle-boots",
      name: "Buckle Boots",
      prompt: "buckle boots",
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
      id: "victorian-button-boots",
      name: "Victorian Button Boots",
      prompt: "victorian button boots",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "smart-casual",
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
      id: "creepers",
      name: "Creepers",
      prompt: "creepers",
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
      id: "platform-mary-janes",
      name: "Platform Mary Janes",
      prompt: "platform mary janes",
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
      id: "gothic-platform-heels",
      name: "Gothic Platform Heels",
      prompt: "gothic platform heels",
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
  ]),
});
