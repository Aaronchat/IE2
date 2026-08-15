export const TIME_OF_DAY = Object.freeze({
  id: "time-of-day",
  name: "Time of Day",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({
      id: "sunrise",
      name: "Sunrise",
      prompt: "at sunrise",
    }),
    Object.freeze({
      id: "early-morning",
      name: "Early Morning",
      prompt: "in the early morning",
    }),
    Object.freeze({
      id: "morning",
      name: "Morning",
      prompt: "in the morning",
    }),
    Object.freeze({
      id: "late-morning",
      name: "Late Morning",
      prompt: "in the late morning",
    }),
    Object.freeze({
      id: "midday",
      name: "Midday",
      prompt: "at midday",
    }),
    Object.freeze({
      id: "afternoon",
      name: "Afternoon",
      prompt: "in the afternoon",
    }),
    Object.freeze({
      id: "golden-hour",
      name: "Golden Hour",
      prompt: "at golden hour",
    }),
    Object.freeze({
      id: "sunset",
      name: "Sunset",
      prompt: "at sunset",
    }),
    Object.freeze({
      id: "blue-hour",
      name: "Blue Hour",
      prompt: "during blue hour",
    }),
    Object.freeze({
      id: "evening",
      name: "Evening",
      prompt: "in the evening",
    }),
    Object.freeze({
      id: "night",
      name: "Night",
      prompt: "at night",
    }),
    Object.freeze({
      id: "late-night",
      name: "Late Night",
      prompt: "late at night",
    }),
    Object.freeze({
      id: "midnight",
      name: "Midnight",
      prompt: "at midnight",
    }),
  ]),
});
