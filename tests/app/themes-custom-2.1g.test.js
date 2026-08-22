import assert from "node:assert/strict";
import test from "node:test";
import { RandomRuntimeState, selectGeneration } from "../../engine/selection/index.js";
import { uiStateToGenerationControls, runUiGeneration } from "../../app/generation-adapter.js";
import { applyManualGuardrails, canAddManualSelection } from "../../app/ui-guardrails.js";

test("Custom Theme adapts into the normal Theme stack and prompt", () => {
  const ui = {
    themes: {
      "themes.selection": { mode: "unselected", value: null },
      "themes.genres-aesthetics.selection": {
        mode: "manual",
        values: [{ value: "beach-party", groupId: "genres-aesthetics" }],
      },
      "themes.custom": { mode: "manual", value: "  mauve  " },
    },
  };

  assert.deepEqual(uiStateToGenerationControls(ui).themes, {
    mode: "manual",
    selections: [{ id: "beach-party", groupId: "genres-aesthetics" }],
    custom: "mauve",
  });

  const generation = runUiGeneration({ uiState: ui, randomState: new RandomRuntimeState() });
  assert.ok(generation.prompt.includes("Theme: Beach party and mauve"));
});

test("Custom Theme can be used by itself", () => {
  const themes = selectGeneration({ controls: { themes: { mode: "manual", selections: [], custom: "Gas Station Oracle" } } }).selections.themes;
  assert.equal(themes.mode, "manual");
  assert.equal(themes.value.length, 1);
  assert.equal(themes.value[0].prompt, "Gas Station Oracle");
  assert.equal(themes.value[0].custom, true);
});

test("Custom Theme counts toward the three-theme maximum", () => {
  const ui = {
    themes: {
      "themes.selection": { mode: "unselected", value: null },
      "themes.colors.selection": {
        mode: "manual",
        values: [
          { value: "red", groupId: "colors" },
          { value: "white", groupId: "colors" },
          { value: "pink", groupId: "colors" },
        ],
      },
      "themes.custom": { mode: "manual", value: "mauve" },
    },
  };
  assert.throws(() => uiStateToGenerationControls(ui), /maximum of 3/u);
});

test("Custom Theme uses the same UI guardrails as preset Themes", () => {
  const state = new Map([
    ["themes.selection", { mode: "none", values: [] }],
    ["themes.colors.selection", { mode: "manual", values: ["red", "white", "pink"] }],
  ]);

  const blocked = canAddManualSelection(state, "themes.custom", "mauve");
  assert.equal(blocked.allowed, false);
  assert.match(blocked.message, /maximum of 3/u);

  state.get("themes.colors.selection").values = ["red"];
  applyManualGuardrails(state, "themes.custom", "mauve");
  assert.equal(state.get("themes.selection").mode, "unselected");
});
