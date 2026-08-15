export const EFFECTS_CONFIG = Object.freeze({
  controls: Object.freeze({
    "effects-imperfections": Object.freeze({
      maxSelections: 2,
      defaultSelections: Object.freeze([]),
      none: Object.freeze({
        exclusive: true,
        contributesPrompt: false,
      }),
    }),
    "film-age": Object.freeze({
      maxSelections: 1,
      defaultSelection: null,
      none: Object.freeze({
        exclusive: true,
        contributesPrompt: false,
      }),
    }),
  }),
});
