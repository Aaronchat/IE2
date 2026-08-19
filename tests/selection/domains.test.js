import test from "node:test";
import assert from "node:assert/strict";
import { selectGeneration, RandomRuntimeState } from "../../engine/selection/index.js";

test("Location, Atmosphere, and Time of Day Random are seeded reproducibly", () => {
  const input = { controls: { location: { mode: "random" }, atmosphere: { mode: "random", count: 2 }, timeOfDay: { mode: "random" } }, random: { seed: "domains" } };
  const a = selectGeneration(input).selections;
  const b = selectGeneration(input).selections;
  assert.equal(a.location.value.id, b.location.value.id);
  assert.deepEqual(a.atmosphere.value.map(x => x.id), b.atmosphere.value.map(x => x.id));
  assert.equal(a.timeOfDay.value.id, b.timeOfDay.value.id);
  assert.ok(a.atmosphere.value.length <= 2);
});

test("Atmosphere max selections and Accessories manual max 2 are enforced", () => {
  assert.throws(() => selectGeneration({ controls: { atmosphere: { mode: "manual", ids: ["clear-skies", "light-rain", "heavy-rain"] } } }), /at most 2/);
  assert.throws(() => selectGeneration({ controls: { accessories: { mode: "manual", selections: [{id:"aviator-sunglasses"},{id:"hoop-earrings"},{id:"choker-necklace"}] } } }), /at most 2/);
});

test("Random state recovers only when generation owner completes generation", () => {
  const state = new RandomRuntimeState();
  selectGeneration({ controls: { location: { mode: "random" } }, random: { seed: "life", state } });
  const before = state.snapshot();
  assert.ok(Object.keys(before.lifetime).length > 0);
  assert.ok(Object.keys(before.decay.item).length > 0);
  state.completeGeneration();
  const after = state.snapshot();
  assert.notDeepEqual(after.decay, before.decay);
  assert.deepEqual(after.lifetime, before.lifetime);
});

test("Footwear and Accessories delegate Random through the top-level Selection Engine", () => {
  const { selections } = selectGeneration({ controls: { footwear: { mode: "random" }, accessories: { mode: "random" } }, random: { seed: "wearables" } });
  assert.equal(selections.footwear.mode, "random");
  assert.ok(selections.footwear.value?.id);
  assert.equal(selections.accessories.mode, "random");
  assert.ok(selections.accessories.value.length <= 2);
});

test("Effects explicit stacking honors the configured maximum", () => {
  const one = selectGeneration({ controls: { effects: { "effects-imperfections": { mode: "manual", ids: ["grain"] } } } }).selections.effects["effects-imperfections"];
  assert.equal(one.mode, "manual");
  assert.equal(one.value.length, 1);
  assert.throws(() => selectGeneration({ controls: { effects: { "effects-imperfections": { mode: "manual", ids: ["grain", "light-leak", "dust"] } } } }), /at most 2/);
});

test("Themes Manual permits same-category and mixed stacks but rejects duplicates and a fourth", () => {
  const sameCategory = selectGeneration({ controls: { themes: { mode: "manual", selections: [
    { id: "red", groupId: "colors" },
    { id: "white", groupId: "colors" },
    { id: "pink", groupId: "colors" },
  ] } } }).selections.themes;
  assert.equal(sameCategory.mode, "manual");
  assert.deepEqual(sameCategory.value.map((record) => record.id), ["red", "white", "pink"]);

  assert.doesNotThrow(() => selectGeneration({ controls: { themes: { mode: "manual", selections: [
    { id: "red" }, { id: "christmas" }, { id: "gothic" },
  ] } } }));
  assert.throws(() => selectGeneration({ controls: { themes: { mode: "manual", selections: [
    { id: "red" }, { id: "red" },
  ] } } }), /cannot contain duplicates/);
  assert.throws(() => selectGeneration({ controls: { themes: { mode: "manual", selections: [
    { id: "red" }, { id: "white" }, { id: "christmas" }, { id: "gothic" },
  ] } } }), /at most 3/);
});

test("Themes None preserves silent provenance", () => {
  const themes = selectGeneration({ controls: { themes: { mode: "none" } } }).selections.themes;
  assert.equal(themes.mode, "none");
  assert.deepEqual(themes.value, []);
});

test("Theme Random follows 50/40/10 stack-size thresholds and allows same-category stacks", () => {
  const withFirst = (first) => {
    let initial = true;
    return () => {
      if (initial) { initial = false; return first; }
      return 0;
    };
  };
  const single = selectGeneration({ controls: { themes: { mode: "random" } }, random: { rng: withFirst(0.49) } }).selections.themes.value;
  const double = selectGeneration({ controls: { themes: { mode: "random" } }, random: { rng: withFirst(0.5) } }).selections.themes.value;
  const triple = selectGeneration({ controls: { themes: { mode: "random" } }, random: { rng: withFirst(0.9) } }).selections.themes.value;
  assert.equal(single.length, 1);
  assert.deepEqual(double.map((record) => record.id), ["red", "white"]);
  assert.deepEqual(triple.map((record) => record.id), ["red", "white", "pink"]);
  assert.equal(new Set(triple.map((record) => record.id)).size, triple.length);
});

test("Theme Random is reproducible with a seed", () => {
  const input = { controls: { themes: { mode: "random" } }, random: { seed: "themes" } };
  const first = selectGeneration(input).selections.themes.value.map((record) => record.id);
  const second = selectGeneration(input).selections.themes.value.map((record) => record.id);
  assert.deepEqual(first, second);
  assert.ok(first.length >= 1 && first.length <= 3);
});

test("Covers enforces contextual Styles, optional Era, and explicit-type metadata", () => {
  const selected = selectGeneration({ controls: { covers: {
    type: { mode: "manual", id: "dvd" },
    style: { mode: "manual", id: "horror" },
    era: { mode: "manual", id: "1970s" },
    metadata: { "movie-title": "Castle Blood" },
  } } }).selections.covers;
  assert.equal(selected.value.type.value.id, "dvd");
  assert.equal(selected.value.style.value.id, "horror");
  assert.equal(selected.value.era.value.id, "1970s");
  assert.deepEqual(selected.value.metadata, { "movie-title": "Castle Blood" });

  assert.throws(() => selectGeneration({ controls: { covers: {
    type: { mode: "manual", id: "novel" }, style: { mode: "manual", id: "metal" },
  } } }), /Unknown Novel Cover Style/);
  assert.throws(() => selectGeneration({ controls: { covers: {
    type: { mode: "manual", id: "movie-poster" }, style: { mode: "random" },
  } }, random: { seed: 1 } }), /no approved Cover Style/);
  assert.throws(() => selectGeneration({ controls: { covers: {
    type: { mode: "random" }, metadata: { title: "Nope" },
  } }, random: { seed: 1 } }), /requires an explicit Cover Type/);
});

test("Tattoos select multiple Generic and Specific designs in order and reject invalid inputs", () => {
  const tattoos = selectGeneration({ controls: { tattoos: [
    { placementId: "left-arm", patternId: "full-sleeve", design: { mode: "generic", styleId: "watercolor" } },
    { placementId: "right-arm", patternId: "lower-large", design: { mode: "specific", text: "  MBOTF  " } },
  ] } }).selections.tattoos;
  assert.equal(tattoos.mode, "manual");
  assert.equal(tattoos.value[0].placement.id, "left-arm");
  assert.equal(tattoos.value[0].design.style.id, "watercolor");
  assert.equal(tattoos.value[1].design.text, "MBOTF");
  assert.throws(() => selectGeneration({ controls: { tattoos: [{ placementId: "left-arm", patternId: "full-leg", design: { mode: "generic", styleId: "watercolor" } }] } }), /not valid for Left Arm/);
  assert.throws(() => selectGeneration({ controls: { tattoos: [{ placementId: "abdomen", patternId: "small", design: { mode: "specific", text: "   " } }] } }), /cannot be blank/);
});


test("Aspect Ratio supports only the two approved manual records", () => {
  const selected = selectGeneration({ controls: { aspectRatio: { mode: "manual", id: "9-16", groupId: "aspect-ratios" } } }).selections.aspectRatio;
  assert.equal(selected.mode, "manual");
  assert.equal(selected.value.prompt, "9:16 aspect ratio");
  assert.throws(() => selectGeneration({ controls: { aspectRatio: { mode: "random" } }, random: { seed: 1 } }), /does not support selection mode random/);
});


test("approved props, locations, and magazine styles are selectable through existing domains", () => {
  const props = selectGeneration({ controls: { accessories: { mode: "manual", selections: [{ id: "stethoscope", groupId: "themed-props" }, { id: "m16", groupId: "themed-props" }] } } }).selections.accessories.value;
  assert.deepEqual(props.map((entry) => entry.record.id), ["stethoscope", "m16"]);
  for (const id of ["hospital", "emergency-room", "operating-room", "desert", "deserted-island"]) {
    assert.equal(selectGeneration({ controls: { location: { mode: "manual", id, groupId: "general-locations" } } }).selections.location.value.id, id);
  }
  for (const id of ["sports-magazine", "hunting-magazine"]) {
    assert.equal(selectGeneration({ controls: { covers: { type: { mode: "manual", id: "magazine" }, style: { mode: "manual", id } } } }).selections.covers.value.style.value.id, id);
  }
});
