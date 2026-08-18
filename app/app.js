import { TATTOO_UI_CONFIG, UI_CATEGORIES } from "./ui-data.js";
import { RandomRuntimeState } from "../engine/selection/index.js";
import { runUiGeneration } from "./generation-adapter.js";
import { activeCoverType, applyManualGuardrails, applyModeGuardrails, canAddManualSelection, eligibleCoverStyleGroups, eligibleNameGroups } from "./ui-guardrails.js";

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
const conditionalSections = [];
const tattooRows = [];
let tattooCategoryView = null;

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
    if (category.repeatable === "tattoos") {
      payload.tattoos = tattooRows.map((row) => ({
        placementId: row.placementId || null,
        patternId: row.patternId || null,
        design: row.designMode === "specific"
          ? { mode: "specific", text: row.specificText }
          : { mode: "generic", styleId: row.styleId || null },
      }));
      continue;
    }
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

  let groupedOptions = control.groupedOptions;
  if (control.id === "character.name") groupedOptions = eligibleNameGroups(state, groupedOptions);
  if (control.id === "covers.style") groupedOptions = eligibleCoverStyleGroups(state, groupedOptions);
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
  const textInput = control.inputType === "text" ? document.createElement("input") : null;
  if (textInput) {
    textInput.type = "text";
    textInput.setAttribute("aria-label", control.label);
    textInput.placeholder = control.placeholder;
    actionRow.append(textInput);
  }
  const hasOptions = control.options.length > 0 || control.groupedOptions.length > 0;
  const select = !textInput && hasOptions ? document.createElement("select") : null;
  if (select) {
    select.setAttribute("aria-label", control.label);
    renderOptions(select, control);
    actionRow.append(select);
  } else if (!textInput) {
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
    noneButton.textContent = control.noneLabel;
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
    if (control.id === "covers.style") {
      const hasManualChoices = select.options.length > 1;
      select.disabled = !hasManualChoices;
      select.title = hasManualChoices ? "" : "Choose a Cover Type with approved styles first.";
      const randomButton = wrapper.querySelector('button[data-mode="random"]');
      if (randomButton) randomButton.disabled = !hasManualChoices;
    }
  }

  function redraw() {
    const current = stateFor(control);
    if (textInput) textInput.value = current.values[0] ?? "";
    chips.replaceChildren();
    const allOptions = flattenedOptions(control);
    for (const selected of current.values) {
      const found = allOptions.find((item) => item.value === selected.value || item.value === selected);
      if (!found) continue;
      addChip(chips, found.label, () => {
        current.values = current.values.filter((item) => (item.value ?? item) !== (selected.value ?? selected));
        current.mode = current.values.length ? "manual" : "unselected";
        if (control.id === "covers.type" && current.mode === "unselected") applyModeGuardrails(state, control.id, "unselected");
        setButtonState(wrapper, current.mode);
        redrawAllAffected(control.id);
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

  if (textInput) {
    textInput.addEventListener("input", () => {
      const current = stateFor(control);
      current.values = textInput.value.trim() ? [textInput.value] : [];
      current.mode = current.values.length ? "manual" : "unselected";
      generationError.hidden = true;
      generationError.textContent = "";
      updateSelectionIndicators();
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
    if (category.repeatable === "tattoos") {
      marker.hidden = tattooRows.length === 0;
      continue;
    }
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
  if (controlId === "covers.type") controlViews.get("covers.style")?.refreshOptions();
  updateConditionalVisibility();
  updateSelectionIndicators();
}

function coverContextAllows(section) {
  return !section.visibleForCoverTypes?.length || section.visibleForCoverTypes.includes(activeCoverType(state));
}

function updateConditionalVisibility() {
  for (const { section, details } of conditionalSections) {
    details.hidden = !coverContextAllows(section) || details.dataset.searchHidden === "true";
  }
}

function renderSection(section) {
  const details = document.createElement("details");
  details.className = "subcategory";
  conditionalSections.push({ section, details });
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

function tattooSelect(label, values, currentValue, onChange, { disabled = false } = {}) {
  const field = document.createElement("label");
  field.className = "tattoo-field";
  const caption = document.createElement("span");
  caption.textContent = label;
  const select = document.createElement("select");
  select.disabled = disabled;
  const blank = document.createElement("option");
  blank.value = "";
  blank.textContent = `Choose ${label.toLowerCase()}…`;
  select.append(blank);
  for (const entry of values) {
    const option = document.createElement("option");
    option.value = entry.value;
    option.textContent = entry.label;
    select.append(option);
  }
  select.value = currentValue ?? "";
  select.addEventListener("change", () => onChange(select.value));
  field.append(caption, select);
  return field;
}

function renderTattooRow(row, index) {
  const card = document.createElement("div");
  card.className = "tattoo-card control-row";
  card.dataset.search = `tattoo placement size coverage generic specific ${TATTOO_UI_CONFIG.placements.map((entry) => entry.label).join(" ")} ${TATTOO_UI_CONFIG.genericStyles.map((entry) => entry.label).join(" ")}`.toLowerCase();

  const header = document.createElement("div");
  header.className = "tattoo-card-header";
  const title = document.createElement("strong");
  title.textContent = `Tattoo ${index + 1}`;
  const remove = document.createElement("button");
  remove.type = "button";
  remove.className = "tattoo-remove";
  remove.textContent = "Remove";
  remove.addEventListener("click", () => {
    tattooRows.splice(index, 1);
    tattooCategoryView?.redraw();
    updateSelectionIndicators();
    updateOutput();
  });
  header.append(title, remove);
  card.append(header);

  const grid = document.createElement("div");
  grid.className = "tattoo-grid";
  grid.append(tattooSelect("Placement", TATTOO_UI_CONFIG.placements, row.placementId, (value) => {
    row.placementId = value;
    row.patternId = "";
    tattooCategoryView?.redraw();
    updateOutput();
  }));

  const placement = TATTOO_UI_CONFIG.placements.find((entry) => entry.value === row.placementId);
  grid.append(tattooSelect("Size / Coverage Pattern", placement?.patterns ?? [], row.patternId, (value) => {
    row.patternId = value;
    updateOutput();
  }, { disabled: !placement }));

  grid.append(tattooSelect("Design", [
    { value: "generic", label: "Generic" },
    { value: "specific", label: "Specific" },
  ], row.designMode, (value) => {
    row.designMode = value || "generic";
    row.styleId = "";
    row.specificText = "";
    tattooCategoryView?.redraw();
    updateOutput();
  }));

  if (row.designMode === "specific") {
    const field = document.createElement("label");
    field.className = "tattoo-field";
    const caption = document.createElement("span");
    caption.textContent = "Specific Design";
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "e.g. MBOTF or broken heart";
    input.value = row.specificText;
    input.addEventListener("input", () => {
      row.specificText = input.value;
      updateOutput();
    });
    field.append(caption, input);
    grid.append(field);
  } else {
    grid.append(tattooSelect("Generic Style", TATTOO_UI_CONFIG.genericStyles, row.styleId, (value) => {
      row.styleId = value;
      updateOutput();
    }));
  }
  card.append(grid);
  return card;
}

function renderTattooEditor() {
  const editor = document.createElement("div");
  editor.className = "tattoo-editor";
  const addRow = document.createElement("div");
  addRow.className = "tattoo-add-row control-row";
  addRow.dataset.search = "tattoos tattoo placement size coverage generic specific traditional neo-traditional japanese tribal blackwork fine-line watercolor realism geometric biomechanical";
  const add = document.createElement("button");
  add.type = "button";
  add.className = "tattoo-add";
  add.textContent = "Add Tattoo";
  add.addEventListener("click", () => {
    tattooRows.push({ placementId: "", patternId: "", designMode: "generic", styleId: "", specificText: "" });
    tattooCategoryView?.redraw();
    updateSelectionIndicators();
    updateOutput();
  });
  addRow.append(add);
  editor.append(addRow);

  const list = document.createElement("div");
  list.className = "tattoo-list";
  tattooRows.forEach((row, index) => list.append(renderTattooRow(row, index)));
  editor.append(list);

  tattooCategoryView = {
    redraw() {
      list.replaceChildren();
      tattooRows.forEach((row, index) => list.append(renderTattooRow(row, index)));
    },
  };
  return editor;
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
  summary.append(title, marker);
  if (category.sections.length) summary.append(count);
  details.append(summary);
  const body = document.createElement("div");
  body.className = "category-body";
  if (category.repeatable === "tattoos") {
    body.append(renderTattooEditor());
  } else {
    if (category.action) {
      const action = renderControl(category.action, { compact: category.sections.length === 0 });
      action.classList.add("category-action");
      body.append(action);
    }
    category.sections.forEach((section) => body.append(renderSection(section)));
  }
  details.append(body);
  return details;
}

UI_CATEGORIES.forEach((category, index) => root.append(renderCategory(category, index)));
updateConditionalVisibility();
updateSelectionIndicators();
updateOutput();

search.addEventListener("input", () => {
  const query = search.value.trim().toLowerCase();
  document.querySelectorAll(".control-row").forEach((row) => {
    const match = !query || row.dataset.search.includes(query);
    row.hidden = !match;
    if (match && query) {
      const subsection = row.closest("details.subcategory");
      if (subsection) subsection.open = true;
      const parentCategory = row.closest("details.category");
      if (parentCategory) parentCategory.open = true;
    }
  });
  document.querySelectorAll("details.subcategory").forEach((section) => {
    section.dataset.searchHidden = String([...section.querySelectorAll(".control-row")].every((row) => row.hidden));
  });
  updateConditionalVisibility();
  document.querySelectorAll("details.category").forEach((category) => {
    category.hidden = [...category.querySelectorAll(".control-row")].every((row) => row.hidden);
  });
});

expandAll.addEventListener("click", () => document.querySelectorAll("details").forEach((details) => { details.open = true; }));
collapseAll.addEventListener("click", () => document.querySelectorAll("details").forEach((details) => { details.open = false; }));
clearAll.addEventListener("click", () => {
  state.clear();
  tattooRows.splice(0, tattooRows.length);
  tattooCategoryView?.redraw();
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
  updateConditionalVisibility();
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
