export const WIND_ATMOSPHERE = Object.freeze({
  id: "wind",
  name: "Wind",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "breezy",
      name: "Breezy",
      prompt: "breezy",
      group: "wind",
      families: Object.freeze(["wind"]),
    }),
    Object.freeze({
      id: "windy",
      name: "Windy",
      prompt: "windy",
      group: "wind",
      families: Object.freeze(["wind"]),
    }),
    Object.freeze({
      id: "strong-winds",
      name: "Strong Winds",
      prompt: "strong winds",
      group: "wind",
      families: Object.freeze(["wind"]),
    }),
  ]),
});
