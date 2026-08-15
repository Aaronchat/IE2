export const SUBJECT_VIEW = Object.freeze({
  id: "subject-view",
  name: "Subject View",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "straight-on-view",
      name: "Straight-On View",
      prompt: "straight-on subject view",
    }),
    Object.freeze({
      id: "three-quarter-view",
      name: "Three-Quarter View",
      prompt: "three-quarter subject view",
    }),
    Object.freeze({
      id: "side-profile",
      name: "Side Profile",
      prompt: "side-profile subject view",
    }),
  ]),
});
