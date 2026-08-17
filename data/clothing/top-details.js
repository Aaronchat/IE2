const detail = (id, prompt) => Object.freeze({ id, name: prompt, prompt });

export const CLOTHING_CONDITION = Object.freeze({
  label: "Condition",
  options: Object.freeze([
    detail("ripped", "ripped"),
    detail("blood-stained", "blood-stained"),
    detail("oil-stained", "oil-stained"),
    detail("weathered", "weathered"),
  ]),
});

export const TOP_DETAIL_CONFIG = Object.freeze({
  color: Object.freeze({
    label: "Color",
    options: Object.freeze([
      detail("red", "red"),
      detail("burnt-orange", "burnt-orange"),
      detail("black", "black"),
      detail("white", "white"),
    ]),
  }),
  fabric: Object.freeze({
    label: "Fabric",
    options: Object.freeze([
      detail("cotton", "cotton"),
      detail("silk", "silk"),
      detail("denim", "denim"),
      detail("leather", "leather"),
    ]),
  }),
  condition: CLOTHING_CONDITION,
  graphic: Object.freeze({
    label: "Graphic",
    options: Object.freeze([
      detail("longhorn-emblem", "with a Longhorn emblem"),
      detail("my-little-pony", "with a My Little Pony graphic"),
      detail("transformers-logo", "with a Transformers logo"),
    ]),
  }),
});
