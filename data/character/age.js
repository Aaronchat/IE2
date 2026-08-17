const exactAge = (age) => Object.freeze({ id: `age-${age}`, name: String(age), prompt: `${age} years old` });
const ageRange = (id, name, prompt) => Object.freeze({ id, name, prompt });

const group = (name, start, end, rangePrompt) => Object.freeze({
  id: `ages-${start}-${end}`,
  name,
  items: Object.freeze([
    ageRange(`age-range-${start}-${end}`, `Any age ${start}–${end}`, rangePrompt),
    ...Array.from({ length: end - start + 1 }, (_, index) => exactAge(start + index)),
  ]),
});

export const CHARACTER_AGE_GROUPS = Object.freeze([
  group("19–29", 19, 29, "between 19 and 29 years old"),
  group("30–39", 30, 39, "in her thirties"),
  group("40–49", 40, 49, "in her forties"),
  group("50–59", 50, 59, "in her fifties"),
  group("60–74", 60, 74, "between 60 and 74 years old"),
  Object.freeze({
    id: "ages-75-plus",
    name: "75+",
    items: Object.freeze([
      ageRange("age-range-75-plus", "Any age 75+", "75 years old or older"),
      ...Array.from({ length: 25 }, (_, index) => exactAge(75 + index)),
    ]),
  }),
]);

export const CHARACTER_AGE_OPTIONS = Object.freeze(CHARACTER_AGE_GROUPS.flatMap((entry) => entry.items));
