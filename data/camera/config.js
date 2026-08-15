export const CAMERA_CONFIG = Object.freeze({
  controls: Object.freeze({
    "camera-body": Object.freeze({
      maxSelections: 1,
      defaultSelection: "canon-eos-r5",
    }),
    "capture-medium": Object.freeze({
      maxSelections: 1,
      defaultSelection: "digital",
    }),
    "lens-look": Object.freeze({
      maxSelections: 1,
      defaultSelection: "50mm-standard",
    }),
    "focus-depth": Object.freeze({
      maxSelections: 1,
      defaultSelection: "balanced-focus",
    }),
    framing: Object.freeze({
      maxSelections: 1,
      defaultSelection: "full-body",
    }),
    "camera-angle": Object.freeze({
      maxSelections: 1,
      defaultSelection: "eye-level",
    }),
    "subject-view": Object.freeze({
      maxSelections: 1,
      defaultSelection: "straight-on-view",
    }),
    "viewer-pov": Object.freeze({
      maxSelections: 1,
      defaultSelection: "direct-portrait-view",
    }),
    "spatial-safe-framing": Object.freeze({
      maxSelections: 1,
      defaultSelection: null,
      none: Object.freeze({
        exclusive: true,
        contributesPrompt: false,
      }),
    }),
  }),
});
