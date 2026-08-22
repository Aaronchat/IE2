export const THEME_GENRES_AESTHETICS = Object.freeze({
  id: "genres-aesthetics",
  name: "Genres & Aesthetics",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({ id: "gothic", name: "Gothic", prompt: "Gothic" }),
    Object.freeze({ id: "western", name: "Western", prompt: "Western" }),
    Object.freeze({ id: "victorian", name: "Victorian", prompt: "Victorian" }),
    Object.freeze({ id: "noir", name: "Noir", prompt: "Noir" }),
    Object.freeze({ id: "psychedelic", name: "Psychedelic", prompt: "Psychedelic" }),
    Object.freeze({ id: "longhorns", name: "Longhorns", prompt: "Longhorns" }),
    Object.freeze({ id: "beach-party", name: "Beach Party", prompt: "Beach party" }),
    Object.freeze({ id: "hippy", name: "Hippy", prompt: "Hippy" }),
  ]),
});
