export const GLOVES = Object.freeze({
  id: "gloves",
  name: "Gloves",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "leather-gloves",
      name: "Leather Gloves",
      prompt: "leather gloves",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "lace-gloves",
      name: "Lace Gloves",
      prompt: "lace gloves",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "fingerless-gloves",
      name: "Fingerless Gloves",
      prompt: "fingerless gloves",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "opera-gloves",
      name: "Opera Gloves",
      prompt: "opera gloves",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "very-formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "lower-arm", side: "both" }),
          Object.freeze({ region: "upper-arm", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "driving-gloves",
      name: "Driving Gloves",
      prompt: "driving gloves",
      temperature: Object.freeze(["warm", "moderate", "cool"]),
      season: Object.freeze(["spring", "summer", "autumn"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "satin-gloves",
      name: "Satin Gloves",
      prompt: "satin gloves",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "mesh-gloves",
      name: "Mesh Gloves",
      prompt: "mesh gloves",
      temperature: Object.freeze(["very-hot", "warm", "moderate"]),
      season: Object.freeze(["spring", "summer"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "wrist-length-gloves",
      name: "Wrist-Length Gloves",
      prompt: "wrist-length gloves",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["autumn", "winter"]),
      formality: "smart-casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
    Object.freeze({
      id: "elbow-length-gloves",
      name: "Elbow-Length Gloves",
      prompt: "elbow-length gloves",
      temperature: Object.freeze(["warm", "moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "summer", "autumn", "winter"]),
      formality: "formal",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
          Object.freeze({ region: "wrist", side: "both" }),
          Object.freeze({ region: "lower-arm", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
        ]),
      }),
    }),
    Object.freeze({
      id: "studded-gloves",
      name: "Studded Gloves",
      prompt: "studded gloves",
      temperature: Object.freeze(["moderate", "cool", "cold"]),
      season: Object.freeze(["spring", "autumn", "winter"]),
      formality: "casual",
      coverage: Object.freeze({
        covered: Object.freeze([
          Object.freeze({ region: "hand", side: "both" }),
        ]),
        partiallyCovered: Object.freeze([
          Object.freeze({ region: "wrist", side: "both" }),
        ]),
      }),
    }),
  ]),
});
