export const ASPECT_RATIOS = Object.freeze({
  id: "aspect-ratios",
  name: "Aspect Ratio",
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze([
    Object.freeze({ id: "9-16", name: "9:16", prompt: "9:16 aspect ratio" }),
    Object.freeze({ id: "9-19-5", name: "9:19.5", prompt: "9:19.5 aspect ratio" }),
  ]),
});
