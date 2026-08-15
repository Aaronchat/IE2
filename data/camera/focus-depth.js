export const FOCUS_DEPTH = Object.freeze({
  id: "focus-depth",
  name: "Focus / Depth",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "shallow-depth-of-field",
      name: "Shallow Depth of Field",
      prompt: "shallow depth of field",
    }),
    Object.freeze({
      id: "balanced-focus",
      name: "Balanced Focus",
      prompt: "balanced focus",
    }),
    Object.freeze({
      id: "deep-focus",
      name: "Deep Focus",
      prompt: "deep focus",
    }),
  ]),
});
