export const EFFECTS_IMPERFECTIONS = Object.freeze({
  id: "effects-imperfections",
  name: "Effects / Imperfections",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "grain",
      name: "Grain",
      prompt: "film grain",
    }),
    Object.freeze({
      id: "dust",
      name: "Dust",
      prompt: "visible dust",
    }),
    Object.freeze({
      id: "scratches",
      name: "Scratches",
      prompt: "surface scratches",
    }),
    Object.freeze({
      id: "light-leak",
      name: "Light Leak",
      prompt: "light leak",
    }),
    Object.freeze({
      id: "lens-flare",
      name: "Lens Flare",
      prompt: "lens flare",
    }),
    Object.freeze({
      id: "motion-blur",
      name: "Motion Blur",
      prompt: "motion blur",
    }),
    Object.freeze({
      id: "soft-focus",
      name: "Soft Focus",
      prompt: "soft-focus effect",
    }),
    Object.freeze({
      id: "chromatic-aberration",
      name: "Chromatic Aberration",
      prompt: "chromatic aberration",
    }),
    Object.freeze({
      id: "film-gate",
      name: "Film Gate",
      prompt: "visible film gate",
    }),
    Object.freeze({
      id: "double-exposure",
      name: "Double Exposure",
      prompt: "double-exposure effect",
    }),
    Object.freeze({
      id: "chemical-stains",
      name: "Chemical Stains",
      prompt: "chemical stains",
    }),
    Object.freeze({
      id: "fingerprints",
      name: "Fingerprints",
      prompt: "visible fingerprints",
    }),
    Object.freeze({
      id: "torn-edges",
      name: "Torn Edges",
      prompt: "torn image edges",
    }),
  ]),
});
