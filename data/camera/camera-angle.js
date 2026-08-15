export const CAMERA_ANGLE = Object.freeze({
  id: "camera-angle",
  name: "Camera Angle",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "eye-level",
      name: "Eye-Level",
      prompt: "at eye level",
    }),
    Object.freeze({
      id: "slight-low-angle",
      name: "Slight Low Angle",
      prompt: "from a slight low angle",
    }),
    Object.freeze({
      id: "low-angle",
      name: "Low Angle",
      prompt: "from a low angle",
    }),
    Object.freeze({
      id: "slight-high-angle",
      name: "Slight High Angle",
      prompt: "from a slight high angle",
    }),
    Object.freeze({
      id: "high-angle",
      name: "High Angle",
      prompt: "from a high angle",
    }),
    Object.freeze({
      id: "dutch-angle",
      name: "Dutch Angle",
      prompt: "with a Dutch angle",
    }),
    Object.freeze({
      id: "overhead-view",
      name: "Overhead View",
      prompt: "from an overhead view",
    }),
  ]),
});
