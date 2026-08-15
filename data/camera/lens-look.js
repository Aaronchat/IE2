export const LENS_LOOK = Object.freeze({
  id: "lens-look",
  name: "Lens / Look",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "24mm-wide-angle",
      name: "24mm Wide-Angle",
      prompt: "24mm wide-angle lens",
    }),
    Object.freeze({
      id: "35mm-documentary",
      name: "35mm Documentary",
      prompt: "35mm documentary lens",
    }),
    Object.freeze({
      id: "50mm-standard",
      name: "50mm Standard",
      prompt: "50mm standard lens",
    }),
    Object.freeze({
      id: "85mm-portrait",
      name: "85mm Portrait",
      prompt: "85mm portrait lens",
    }),
    Object.freeze({
      id: "100mm-editorial-portrait",
      name: "100mm Editorial Portrait",
      prompt: "100mm editorial portrait lens",
    }),
    Object.freeze({
      id: "135mm-glamour-portrait",
      name: "135mm Glamour Portrait",
      prompt: "135mm glamour portrait lens",
    }),
    Object.freeze({
      id: "70-200mm-sports-telephoto",
      name: "70-200mm Sports Telephoto",
      prompt: "70-200mm sports telephoto lens",
    }),
    Object.freeze({
      id: "telephoto-compression",
      name: "Telephoto Compression",
      prompt: "telephoto compression",
    }),
    Object.freeze({
      id: "soft-portrait-lens",
      name: "Soft Portrait Lens",
      prompt: "soft portrait lens",
    }),
  ]),
});
