export const SPATIAL_SAFE_FRAMING = Object.freeze({
  id: "spatial-safe-framing",
  name: "Spatial-Safe Framing",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "spatial-scene-safe",
      name: "Spatial Scene Safe",
      prompt: "generous headroom and side margins, with extra surrounding space keeping the selected framing comfortably inside the image for later spatial/depth cropping",
    }),
  ]),
});
