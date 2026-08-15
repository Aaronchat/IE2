export const CAMERA_BODY = Object.freeze({
  id: "camera-body",
  name: "Camera Body / Capture Device",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "canon-eos-r5",
      name: "Canon EOS R5",
      prompt: "captured with a Canon EOS R5",
    }),
    Object.freeze({
      id: "sony-a7r-v",
      name: "Sony A7R V",
      prompt: "captured with a Sony A7R V",
    }),
    Object.freeze({
      id: "nikon-z9",
      name: "Nikon Z9",
      prompt: "captured with a Nikon Z9",
    }),
    Object.freeze({
      id: "canon-eos-1d-x-mark-iii",
      name: "Canon EOS-1D X Mark III",
      prompt: "captured with a Canon EOS-1D X Mark III",
    }),
    Object.freeze({
      id: "sony-a1",
      name: "Sony A1",
      prompt: "captured with a Sony A1",
    }),
    Object.freeze({
      id: "nikon-d6",
      name: "Nikon D6",
      prompt: "captured with a Nikon D6",
    }),
    Object.freeze({
      id: "fujifilm-gfx-100-ii",
      name: "Fujifilm GFX 100 II",
      prompt: "captured with a Fujifilm GFX 100 II",
    }),
    Object.freeze({
      id: "leica-m11",
      name: "Leica M11",
      prompt: "captured with a Leica M11",
    }),
    Object.freeze({
      id: "hasselblad-x2d",
      name: "Hasselblad X2D",
      prompt: "captured with a Hasselblad X2D",
    }),
    Object.freeze({
      id: "sports-press-camera",
      name: "Sports Press Camera",
      prompt: "captured with a sports press camera",
    }),
    Object.freeze({
      id: "broadcast-tv-camera",
      name: "Broadcast TV Camera",
      prompt: "captured with a broadcast TV camera",
    }),
    Object.freeze({
      id: "security-camera",
      name: "Security Camera",
      prompt: "security-camera capture",
    }),
    Object.freeze({
      id: "disposable-camera",
      name: "Disposable Camera",
      prompt: "captured with a disposable camera",
    }),
    Object.freeze({
      id: "polaroid-camera",
      name: "Polaroid Camera",
      prompt: "captured with a Polaroid camera",
    }),
    Object.freeze({
      id: "smartphone-camera",
      name: "Smartphone Camera",
      prompt: "captured with a smartphone camera",
    }),
  ]),
});
