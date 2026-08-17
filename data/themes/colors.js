export const THEME_COLORS = Object.freeze({
  id: "colors",
  name: "Colors",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({ id: "red", name: "Red", prompt: "red" }),
    Object.freeze({ id: "white", name: "White", prompt: "white" }),
    Object.freeze({ id: "pink", name: "Pink", prompt: "pink" }),
    Object.freeze({ id: "hot-pink", name: "Hot Pink", prompt: "hot pink" }),
    Object.freeze({ id: "purple", name: "Purple", prompt: "purple" }),
  ]),
});
