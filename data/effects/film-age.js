export const FILM_AGE = Object.freeze({
  id: "film-age",
  name: "Film Age",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "brand-new",
      name: "Brand New",
      prompt: "brand-new image condition",
    }),
    Object.freeze({
      id: "well-preserved",
      name: "Well Preserved",
      prompt: "well-preserved image condition",
    }),
    Object.freeze({
      id: "slight-aging",
      name: "Slight Aging",
      prompt: "slightly aged image",
    }),
    Object.freeze({
      id: "moderate-fading",
      name: "Moderate Fading",
      prompt: "moderately faded image",
    }),
    Object.freeze({
      id: "heavy-fading",
      name: "Heavy Fading",
      prompt: "heavily faded image",
    }),
    Object.freeze({
      id: "damaged-archive",
      name: "Damaged Archive",
      prompt: "damaged archival image",
    }),
    Object.freeze({
      id: "restored-scan",
      name: "Restored Scan",
      prompt: "restored archival scan",
    }),
  ]),
});
