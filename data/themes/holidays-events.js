export const THEME_HOLIDAYS_EVENTS = Object.freeze({
  id: "holidays-events",
  name: "Holidays & Events",
  defaults: Object.freeze({
    enabled: true,
    selectionWeight: 1,
  }),
  items: Object.freeze([
    Object.freeze({ id: "christmas", name: "Christmas", prompt: "Christmas" }),
    Object.freeze({ id: "halloween", name: "Halloween", prompt: "Halloween" }),
    Object.freeze({ id: "easter", name: "Easter", prompt: "Easter" }),
    Object.freeze({ id: "valentines-day", name: "Valentine's Day", prompt: "Valentine's Day" }),
    Object.freeze({ id: "new-years-eve", name: "New Year's Eve", prompt: "New Year's Eve" }),
    Object.freeze({ id: "fourth-of-july", name: "Fourth of July", prompt: "Fourth of July" }),
  ]),
});
