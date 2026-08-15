export const VIEWER_POV = Object.freeze({
  id: "viewer-pov",
  name: "Viewer POV",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "direct-portrait-view",
      name: "Direct Portrait View",
      prompt: "direct portrait viewpoint",
    }),
    Object.freeze({
      id: "over-the-shoulder-view",
      name: "Over-the-Shoulder View",
      prompt: "over-the-shoulder viewpoint",
    }),
    Object.freeze({
      id: "candid-observer-view",
      name: "Candid Observer View",
      prompt: "candid-observer viewpoint",
    }),
    Object.freeze({
      id: "street-photographer-view",
      name: "Street Photographer View",
      prompt: "street-photographer viewpoint",
    }),
    Object.freeze({
      id: "sports-sideline-photographer-view",
      name: "Sports Sideline Photographer View",
      prompt: "sports-sideline-photographer viewpoint",
    }),
    Object.freeze({
      id: "courtside-photographer-view",
      name: "Courtside Photographer View",
      prompt: "courtside-photographer viewpoint",
    }),
    Object.freeze({
      id: "front-row-view",
      name: "Front Row View",
      prompt: "front-row viewpoint",
    }),
    Object.freeze({
      id: "across-the-room-view",
      name: "Across-the-Room View",
      prompt: "across-the-room viewpoint",
    }),
    Object.freeze({
      id: "crowd-level-view",
      name: "Crowd-Level View",
      prompt: "crowd-level viewpoint",
    }),
    Object.freeze({
      id: "paparazzi-view",
      name: "Paparazzi View",
      prompt: "paparazzi viewpoint",
    }),
    Object.freeze({
      id: "surveillance-view",
      name: "Surveillance View",
      prompt: "surveillance viewpoint",
    }),
  ]),
});
