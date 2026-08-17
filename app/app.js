import { UI_CATEGORIES } from "./ui-data.js";
import { RandomRuntimeState } from "../engine/selection/index.js";
import { runUiGeneration } from "./generation-adapter.js";
import { applyManualGuardrails, applyModeGuardrails, canAddManualSelection, eligibleNameGroups } from "./ui-guardrails.js";

const root = document.querySelector("#engine-controls");
const search = document.querySelector("#control-search");
const expandAll = document.querySelector("#expand-all");
const collapseAll = document.querySelector("#collapse-all");
const clearAll = document.querySelector("#clear-all");
const stateOutput = document.querySelector("#state-output");
const copyState = document.querySelector("#copy-state");
const generateButton = document.querySelector("#generate-prompt");
const copyPrompt = document.querySelector("#copy-prompt");
const promptOutput = document.querySelector("#prompt-output");
const seedOutput = document.querySelector("#seed-output");
const generationError = document.querySelector("#generation-error");

const state = new Map();
const randomState = new RandomRuntimeState();
const controlViews = new Map();
const sectionIndicators = [];
const categoryIndicators = [];

function flattenedOptions(control) {
  return control.options.length ? control.options : control.groupedOptions.flatMap((group) => group.options);
}

function initialState(control) {
  if (control.defaultValue != null) return { mode: "default", values: [control.defaultValue] };
  if (control.defaultMode === "none") return { mode: "none", values: [] };
  if (control.none && (control.id.startsWith("effects.") || control.id === "camera.spatial-safe-framing")) return { mode: "default", values: [] };
  return { mode: "unselected", values: [] };
}

function sectionControls(section) {
  return [...section.controls, ...(section.advancedControls ?? [])];
}

function stateFor(control) {
  if (!state.has(control.id)) state.set(control.id, initialState(control));
  return state.get(control.id);
}

function serializeUiState() {
  const payload = {};
  for (const category of UI_CATEGORIES) {
    const categoryState = {};
    if (category.action) {
      const current = stateFor(category.action);
      categoryState[category.action.id] = { mode: current.mode, value: current.values[0] ?? null, values: category.action.maxSelections > 1 ? current.values : undefined };
    }
    for (const section of category.sections) {
      if (section.action) {
        const current = stateFor(section.action);
        categoryState[section.action.id] = { mode: current.mode, value: current.values[0] ?? null, values: section.action.maxSelections > 1 ? current.values : undefined };
      }
      for (const control of sectionControls(section)) {
        const current = stateFor(control);
        categoryState[control.id] = {
          mode: current.mode,
          value: control.maxSelections === 1 ? (current.values[0] ?? null) : undefined,
          values: control.maxSelections > 1 ? current.values : undefined,
        };
      }
    }
    payload[category.id] = categoryState;
  }
  return payload;
}

function updateOutput() {
  stateOutput.textContent = JSON.stringify(serializeUiState(), null, 2);
}

function setButtonState(wrapper, mode) {
  wrapper.querySelectorAll("button[data-mode]").forEach((button) => button.classList.toggle("active", button.dataset.mode === mode));
}

function renderOptions(select, control) {
  select.replaceChildren();
  const placeholder = document.createElement("option");
  placeholder.value = "";
  placeholder.textContent = control.maxSelections > 1 ? "Choose options…" : "Choose an option…";
  select.append(placeholder);

  if (control.options.length) {
    for (const item of control.options) {
      const optionElement = document.createElement("option");
      optionElement.value = item.value;
      optionElement.textContent = item.label;
      select.append(optionElement);
    }
    return;
  }

  const groupedOptions = control.id === "character.name" ? eligibleNameGroups(state, control.groupedOptions) : control.groupedOptions;
  for (const group of groupedOptions) {
    const optgroup = document.createElement("optgroup");
    optgroup.label = group.label;
    for (const item of group.options) {
      const optionElement = document.createElement("option");
      optionElement.value = `${item.groupId ?? ""}::${item.value}`;
      optionElement.dataset.value = item.value;
      optionElement.dataset.groupId = item.groupId ?? "";
      optionElement.textContent = item.label;
      optgroup.append(optionElement);
    }
    select.append(optgroup);
  }
}

function addChip(chips, label, onRemove) {
  const chip = document.createElement("button");
  chip.type = "button";
  chip.className = "chip";
  chip.textContent = `${label} ×`;
  chip.addEventListener("click", onRemove);
  chips.append(chip);
}

function renderControl(control, { compact = false } = {}) {
  const wrapper = document.createElement("div");
  wrapper.className = compact ? "control-row compact-control" : "control-row";
  wrapper.dataset.controlId = control.id;
  wrapper.dataset.search = `${control.label} ${flattenedOptions(control).map((entry) => entry.label).join(" ")}`.toLowerCase();

  if (!compact || control.note) {
    const heading = document.createElement("div");
    heading.className = "control-heading";
    if (!compact) {
      const label = document.createElement("label");
      label.textContent = control.label;
      heading.append(label);
    }
    if (control.note) {
      const note = document.createElement("span");
      note.className = "control-note";
      note.textContent = control.note;
      heading.append(note);
    }
    wrapper.append(heading);
  }

  const actionRow = document.createElement("div");
  actionRow.className = "control-actions";
  const hasOptions = control.options.length > 0 || control.groupedOptions.length > 0;
  const select = hasOptions ? document.createElement("select") : null;
  if (select) {
    select.setAttribute("aria-label", control.label);
    renderOptions(select, control);
    actionRow.append(select);
  } else {
    actionRow.classList.add("mode-only");
  }

  if (control.random) {
    const randomButton = document.createElement("button");
    randomButton.type = "button";
    randomButton.className = "mode-button random-button";
    randomButton.dataset.mode = "random";
    randomButton.textContent = "Random";
    actionRow.append(randomButton);
  }

  if (control.none) {
    const noneButton = document.createElement("button");
    noneButton.type = "button";
    noneButton.className = "mode-button none-button";
    noneButton.dataset.mode = "none";
    noneButton.textContent = "None";
    actionRow.append(noneButton);
  }

  wrapper.append(actionRow);
  const chips = document.createElement("div");
  chips.className = "chips";
  wrapper.append(chips);

  function refreshOptions() {
    if (!select) return;
    renderOptions(select, control);
    if (control.id === "character.name") {
      const hasManualChoices = select.options.length > 1;
      select.disabled = !hasManualChoices;
      select.title = hasManualChoices ? "" : "Choose a specific ethnicity to select a manual name. Random Name remains available.";
    }
  }

  function redraw() {
    const current = stateFor(control);
    chips.replaceChildren();
    const allOptions = flattenedOptions(control);
    for (const selected of current.values) {
      const found = allOptions.find((item) => item.value === selected.value || item.value === selected);
      if (!found) continue;
      addChip(chips, found.label, () => {
        current.values = current.values.filter((item) => (item.value ?? item) !== (selected.value ?? selected));
        current.mode = current.values.length ? "manual" : "unselected";
        setButtonState(wrapper, current.mode);
        redraw();
        updateOutput();
      });
    }
    if (current.mode === "default" && current.values.length) {
      const found = allOptions.find((item) => item.value === current.values[0]);
      if (found) chips.firstChild?.classList.add("default-chip");
    }
    setButtonState(wrapper, current.mode);
  }

  if (select) {
  select.addEventListener("change", () => {
      if (!select.value) return;
      const selectedOption = select.selectedOptions[0];
      const current = stateFor(control);
      const selected = { value: selectedOption.dataset.value ?? selectedOption.value, groupId: selectedOption.dataset.groupId || null };
      const permission = canAddManualSelection(state, control.id, selected);
      if (!permission.allowed) {
        generationError.textContent = permission.message;
        generationError.hidden = false;
        select.value = "";
        return;
      }
      generationError.hidden = true;
      generationError.textContent = "";
      applyManualGuardrails(state, control.id, selected);
      if (control.maxSelections === 1) current.values = [selected];
      else if (!current.values.some((entry) => (entry.value ?? entry) === selected.value)) current.values = [...current.values, selected];
      current.mode = "manual";
      select.value = "";
      redrawAllAffected(control.id);
      updateOutput();
    });
  }

  wrapper.querySelectorAll("button[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const current = stateFor(control);
      current.mode = button.dataset.mode;
      current.values = [];
      applyModeGuardrails(state, control.id, current.mode);
      generationError.hidden = true;
      generationError.textContent = "";
      redrawAllAffected(control.id);
      updateOutput();
    });
  });

  controlViews.set(control.id, { redraw, refreshOptions });
  refreshOptions();
  redraw();
  return wrapper;
}

function isSpecificState(current) {
  return current?.mode === "manual" && current.values.length > 0;
}

function updateSelectionIndicators() {
  for (const { section, marker } of sectionIndicators) {
    const ids = [...(section.action ? [section.action.id] : []), ...sectionControls(section).map((control) => control.id)];
    marker.hidden = !ids.some((id) => isSpecificState(state.get(id)));
  }
  for (const { category, marker } of categoryIndicators) {
    const ids = [
      ...(category.action ? [category.action.id] : []),
      ...category.sections.flatMap((section) => [...(section.action ? [section.action.id] : []), ...sectionControls(section).map((control) => control.id)]),
    ];
    marker.hidden = !ids.some((id) => isSpecificState(state.get(id)));
  }
}

function redrawAllAffected(controlId) {
  for (const view of controlViews.values()) view.redraw();
  if (controlId === "character.ethnicity") controlViews.get("character.name")?.refreshOptions();
  updateSelectionIndicators();
}

function renderSection(section) {
  const details = document.createElement("details");
  details.className = "subcategory";
  const summary = document.createElement("summary");
  const title = document.createElement("span");
  title.textContent = section.label;
  const marker = document.createElement("span");
  marker.className = "selection-indicator";
  marker.textContent = "✓";
  marker.hidden = true;
  summary.append(title, marker);
  sectionIndicators.push({ section, marker });
  details.append(summary);
  const body = document.createElement("div");
  body.className = "subcategory-body";
  if (section.action) {
    const action = renderControl(section.action, { compact: true });
    action.classList.add("section-action");
    body.append(action);
  }
  section.controls.forEach((control) => body.append(renderControl(control)));
  if (section.advancedControls?.length) {
    const advanced = document.createElement("details");
    advanced.className = "advanced-controls";
    const advancedSummary = document.createElement("summary");
    advancedSummary.textContent = "Advanced";
    advanced.append(advancedSummary);
    const advancedBody = document.createElement("div");
    advancedBody.className = "advanced-controls-body";
    section.advancedControls.forEach((control) => advancedBody.append(renderControl(control)));
    advanced.append(advancedBody);
    body.append(advanced);
  }
  details.append(body);
  return details;
}

function renderCategory(category, index) {
  const details = document.createElement("details");
  details.className = "category";
  details.dataset.category = category.id;
  details.open = index === 0;
  const summary = document.createElement("summary");
  const title = document.createElement("span");
  title.textContent = category.label;
  const marker = document.createElement("span");
  marker.className = "selection-indicator category-indicator";
  marker.textContent = "✓";
  marker.hidden = true;
  categoryIndicators.push({ category, marker });
  const count = document.createElement("span");
  count.className = "summary-count";
  count.textContent = `${category.sections.length}`;
  summary.append(title, marker, count);
  details.append(summary);
  const body = document.createElement("div");
  body.className = "category-body";
  if (category.action) {
    const action = renderControl(category.action);
    action.classList.add("category-action");
    body.append(action);
  }
  category.sections.forEach((section) => body.append(renderSection(section)));
  details.append(body);
  return details;
}

UI_CATEGORIES.forEach((category, index) => root.append(renderCategory(category, index)));
updateSelectionIndicators();
updateOutput();

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  document.querySelectorAll(".control-row").forEach((row) => {
    const match = !query || row.dataset.search.includes(query);
    row.hidden = !match;
    if (match && query) {
      row.closest("details.subcategory").open = true;
      row.closest("details.category").open = true;
    }
  });
  document.querySelectorAll("details.subcategory").forEach((section) => {
    section.hidden = [...section.querySelectorAll(".control-row")].every((row) => row.hidden);
  });
  document.querySelectorAll("details.category").forEach((category) => {
    category.hidden = [...category.querySelectorAll("details.subcategory")].every((section) => section.hidden);
  });
});

expandAll.addEventListener("click", () => document.querySelectorAll("details").forEach((details) => { details.open = true; }));
collapseAll.addEventListener("click", () => document.querySelectorAll("details").forEach((details) => { details.open = false; }));
clearAll.addEventListener("click", () => {
  state.clear();
  for (const category of UI_CATEGORIES) {
    if (category.action) stateFor(category.action);
    for (const section of category.sections) {
      if (section.action) stateFor(section.action);
      for (const control of sectionControls(section)) stateFor(control);
    }
  }
  for (const view of controlViews.values()) {
    view.refreshOptions();
    view.redraw();
  }
  generationError.hidden = true;
  generationError.textContent = "";
  updateSelectionIndicators();
  updateOutput();
});
copyState.addEventListener("click", async () => {
  await navigator.clipboard.writeText(stateOutput.textContent);
  copyState.textContent = "Copied";
  setTimeout(() => { copyState.textContent = "Copy state"; }, 1200);
});


generateButton.addEventListener("click", () => {
  generateButton.disabled = true;
  generationError.hidden = true;
  generationError.textContent = "";
  try {
    const generation = runUiGeneration({ uiState: serializeUiState(), randomState });
    promptOutput.textContent = generation.prompt;
    seedOutput.textContent = generation.seed == null ? "No Random seed used" : `Seed: ${generation.seed}`;
    copyPrompt.disabled = !generation.prompt;
  } catch (error) {
    promptOutput.textContent = "";
    seedOutput.textContent = "";
    copyPrompt.disabled = true;
    generationError.textContent = error instanceof Error ? error.message : String(error);
    generationError.hidden = false;
  } finally {
    generateButton.disabled = false;
  }
});

copyPrompt.addEventListener("click", async () => {
  if (!promptOutput.textContent) return;
  await navigator.clipboard.writeText(promptOutput.textContent);
  copyPrompt.textContent = "Copied";
  setTimeout(() => { copyPrompt.textContent = "Copy Prompt"; }, 1200);
});
