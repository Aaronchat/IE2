const req = (region, side) => Object.freeze({ region, ...(side ? { side } : {}) });
const pattern = (id, name, sizePrompt, placementPrompt, requiredRegions, format = "tattoo") => Object.freeze({
  id,
  name,
  sizePrompt,
  placementPrompt,
  format,
  requiredRegions: Object.freeze(requiredRegions),
});
const placement = (id, name, patterns) => Object.freeze({ id, name, patterns: Object.freeze(patterns) });

const both = (region) => [req(region, "left"), req(region, "right")];
const wholeAbdomen = Object.freeze([
  req("upper-abdomen", "left"), req("upper-abdomen", "right"),
  req("lower-abdomen", "left"), req("lower-abdomen", "right"),
]);

function simplePatterns(placementPrompt, requiredRegions) {
  return [
    pattern("small", "Small", "small", placementPrompt, requiredRegions),
    pattern("large", "Large", "large", placementPrompt, requiredRegions),
  ];
}

function armPatterns(side) {
  return [
    pattern("upper-small", "Upper Arm — Small", "small", `upper ${side} arm`, [req("upper-arm", side)]),
    pattern("upper-large", "Upper Arm — Large", "large", `upper ${side} arm`, [req("upper-arm", side)]),
    pattern("lower-small", "Lower Arm — Small", "small", `lower ${side} arm`, [req("lower-arm", side)]),
    pattern("lower-large", "Lower Arm — Large", "large", `lower ${side} arm`, [req("lower-arm", side)]),
    pattern("half-sleeve-upper", "Half Sleeve — Upper Arm", "half", `upper ${side} arm`, [req("upper-arm", side)], "sleeve"),
    pattern("half-sleeve-lower", "Half Sleeve — Lower Arm", "half", `lower ${side} arm`, [req("lower-arm", side)], "sleeve"),
    pattern("full-sleeve", "Full Sleeve", "full", `${side} arm`, [req("upper-arm", side), req("lower-arm", side)], "sleeve"),
  ];
}

function legPatterns(side) {
  return [
    pattern("upper-small", "Upper Leg — Small", "small", `upper ${side} leg`, [req("upper-leg", side)]),
    pattern("upper-large", "Upper Leg — Large", "large", `upper ${side} leg`, [req("upper-leg", side)]),
    pattern("lower-small", "Lower Leg — Small", "small", `lower ${side} leg`, [req("lower-leg", side)]),
    pattern("lower-large", "Lower Leg — Large", "large", `lower ${side} leg`, [req("lower-leg", side)]),
    pattern("half-leg-upper", "Half Leg — Upper", "half", `upper ${side} leg`, [req("upper-leg", side)], "leg"),
    pattern("half-leg-lower", "Half Leg — Lower", "half", `lower ${side} leg`, [req("lower-leg", side)], "leg"),
    pattern("full-leg", "Full Leg", "full", `${side} leg`, [req("upper-leg", side), req("lower-leg", side)], "leg"),
  ];
}

export const TATTOO_PLACEMENTS = Object.freeze([
  placement("upper-chest", "Upper Chest", simplePatterns("upper chest", both("upper-chest"))),
  placement("abdomen", "Abdomen", [
    ...simplePatterns("abdomen", wholeAbdomen),
    pattern("upper-small", "Upper Abdomen — Small", "small", "upper abdomen", [req("upper-abdomen", "left"), req("upper-abdomen", "right")]),
    pattern("upper-large", "Upper Abdomen — Large", "large", "upper abdomen", [req("upper-abdomen", "left"), req("upper-abdomen", "right")]),
    pattern("lower-small", "Lower Abdomen — Small", "small", "lower abdomen", [req("lower-abdomen", "left"), req("lower-abdomen", "right")]),
    pattern("lower-large", "Lower Abdomen — Large", "large", "lower abdomen", [req("lower-abdomen", "left"), req("lower-abdomen", "right")]),
  ]),
  placement("left-shoulder", "Left Shoulder", simplePatterns("left shoulder", [req("shoulder", "left")])),
  placement("right-shoulder", "Right Shoulder", simplePatterns("right shoulder", [req("shoulder", "right")])),
  placement("left-arm", "Left Arm", armPatterns("left")),
  placement("right-arm", "Right Arm", armPatterns("right")),
  placement("left-leg", "Left Leg", legPatterns("left")),
  placement("right-leg", "Right Leg", legPatterns("right")),
]);

export const TATTOO_GENERIC_STYLES = Object.freeze([
  Object.freeze({ id: "traditional", name: "Traditional", prompt: "traditional" }),
  Object.freeze({ id: "neo-traditional", name: "Neo-Traditional", prompt: "neo-traditional" }),
  Object.freeze({ id: "japanese", name: "Japanese", prompt: "Japanese" }),
  Object.freeze({ id: "tribal", name: "Tribal", prompt: "tribal" }),
  Object.freeze({ id: "blackwork", name: "Blackwork", prompt: "blackwork" }),
  Object.freeze({ id: "fine-line", name: "Fine-Line", prompt: "fine-line" }),
  Object.freeze({ id: "watercolor", name: "Watercolor", prompt: "watercolor" }),
  Object.freeze({ id: "realism", name: "Realism", prompt: "realism" }),
  Object.freeze({ id: "geometric", name: "Geometric", prompt: "geometric" }),
  Object.freeze({ id: "biomechanical", name: "Biomechanical", prompt: "biomechanical" }),
]);

export const TATTOOS_CONFIG = Object.freeze({
  placements: TATTOO_PLACEMENTS,
  genericStyles: TATTOO_GENERIC_STYLES,
  designModes: Object.freeze(["generic", "specific"]),
});
