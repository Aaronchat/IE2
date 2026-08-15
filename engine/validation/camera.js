import { fileURLToPath } from "node:url";
import path from "node:path";

import { CHARACTER_EXPRESSION } from "../../data/character/expression.js";

import { CAMERA_BODY } from "../../data/camera/camera-body.js";
import { CAPTURE_MEDIUM } from "../../data/camera/capture-medium.js";
import { LENS_LOOK } from "../../data/camera/lens-look.js";
import { FOCUS_DEPTH } from "../../data/camera/focus-depth.js";
import { FRAMING } from "../../data/camera/framing.js";
import { CAMERA_ANGLE } from "../../data/camera/camera-angle.js";
import { SUBJECT_VIEW } from "../../data/camera/subject-view.js";
import { VIEWER_POV } from "../../data/camera/viewer-pov.js";
import { SPATIAL_SAFE_FRAMING } from "../../data/camera/spatial-safe-framing.js";
import { CAMERA_CONFIG } from "../../data/camera/config.js";

const EXPECTED_GROUPS = Object.freeze([
  Object.freeze({ id: "camera-body", count: 15 }),
  Object.freeze({ id: "capture-medium", count: 17 }),
  Object.freeze({ id: "lens-look", count: 9 }),
  Object.freeze({ id: "focus-depth", count: 3 }),
  Object.freeze({ id: "framing", count: 8 }),
  Object.freeze({ id: "camera-angle", count: 7 }),
  Object.freeze({ id: "subject-view", count: 3 }),
  Object.freeze({ id: "viewer-pov", count: 11 }),
  Object.freeze({ id: "spatial-safe-framing", count: 1 }),
]);

const CAMERA_GROUPS = Object.freeze([
  CAMERA_BODY,
  CAPTURE_MEDIUM,
  LENS_LOOK,
  FOCUS_DEPTH,
  FRAMING,
  CAMERA_ANGLE,
  SUBJECT_VIEW,
  VIEWER_POV,
  SPATIAL_SAFE_FRAMING,
]);

const EXPECTED_GROUP_BY_ID = new Map(EXPECTED_GROUPS.map((entry) => [entry.id, entry]));
const EXPECTED_TOTAL_RECORDS = 74;

const EXPECTED_DEFAULTS = Object.freeze({
  "camera-body": "canon-eos-r5",
  "capture-medium": "digital",
  "lens-look": "50mm-standard",
  "focus-depth": "balanced-focus",
  framing: "full-body",
  "camera-angle": "eye-level",
  "subject-view": "straight-on-view",
  "viewer-pov": "direct-portrait-view",
  "spatial-safe-framing": null,
});

function requireNonEmptyString(value, label) {
  if (typeof value !== "string" || value.trim() === "") {
    throw new Error(`${label} must be a non-empty string.`);
  }
}

function validateConfig(groupsById, config) {
  const controls = config?.controls;
  if (!controls || typeof controls !== "object") {
    throw new Error("Camera config must contain controls.");
  }

  const expectedControlIds = EXPECTED_GROUPS.map((entry) => entry.id);
  if (
    Object.keys(controls).length !== expectedControlIds.length ||
    expectedControlIds.some((id) => !Object.prototype.hasOwnProperty.call(controls, id))
  ) {
    throw new Error("Camera config controls do not match the nine approved Camera controls.");
  }

  for (const groupId of expectedControlIds) {
    const control = controls[groupId];
    if (control?.maxSelections !== 1) {
      throw new Error(`${groupId}: Camera maxSelections must be exactly 1.`);
    }

    const expectedDefault = EXPECTED_DEFAULTS[groupId];
    if (control.defaultSelection !== expectedDefault) {
      throw new Error(
        `${groupId}: expected defaultSelection ${expectedDefault}, found ${control.defaultSelection}.`,
      );
    }

    const groupRecordIds = new Set(groupsById.get(groupId).items.map((record) => record.id));
    if (expectedDefault !== null && !groupRecordIds.has(expectedDefault)) {
      throw new Error(`${groupId}: defaultSelection ${expectedDefault} does not exist.`);
    }

    if (groupId === "spatial-safe-framing") {
      if (control?.none?.exclusive !== true || control?.none?.contributesPrompt !== false) {
        throw new Error("Spatial-Safe Framing None must be exclusive and contribute no prompt.");
      }
    } else if (Object.prototype.hasOwnProperty.call(control, "none")) {
      throw new Error(`${groupId}: None behavior is not approved for this Camera control.`);
    }
  }

  if (controls.framing.defaultSelection !== "full-body") {
    throw new Error("Full Body must remain the Framing default.");
  }
  if (controls["camera-angle"].defaultSelection !== "eye-level") {
    throw new Error("Eye-Level must remain the Camera Angle default.");
  }
}

export function validateCamera(groups = CAMERA_GROUPS, config = CAMERA_CONFIG) {
  if (!Array.isArray(groups) || groups.length !== EXPECTED_GROUPS.length) {
    throw new Error(`Expected ${EXPECTED_GROUPS.length} Camera controls.`);
  }

  const seenGroupIds = new Set();
  const seenRecordIds = new Set();
  const seenRecordNames = new Set();
  const seenPrompts = new Set();
  const groupsById = new Map();
  let totalRecords = 0;
  let spatialSafeCount = 0;

  for (const group of groups) {
    requireNonEmptyString(group?.id, "Camera group id");
    requireNonEmptyString(group?.name, `${group?.id ?? "Camera group"} name`);

    const expected = EXPECTED_GROUP_BY_ID.get(group.id);
    if (!expected) {
      throw new Error(`Unknown Camera group id ${group.id}.`);
    }
    if (seenGroupIds.has(group.id)) {
      throw new Error(`Duplicate Camera group id ${group.id}.`);
    }
    seenGroupIds.add(group.id);
    groupsById.set(group.id, group);

    if (!group.defaults || !Array.isArray(group.items)) {
      throw new Error(`${group.id}: group must contain defaults and items.`);
    }
    if (group.items.length !== expected.count) {
      throw new Error(`${group.id}: expected ${expected.count} records, found ${group.items.length}.`);
    }

    for (const record of group.items) {
      totalRecords += 1;
      requireNonEmptyString(record?.id, `${group.id} Camera id`);
      requireNonEmptyString(record?.name, `${record?.id ?? group.id} name`);
      requireNonEmptyString(record?.prompt, `${record?.id ?? group.id} prompt`);

      if (seenRecordIds.has(record.id)) {
        throw new Error(`Duplicate Camera record id ${record.id}.`);
      }
      seenRecordIds.add(record.id);

      const normalizedName = record.name.trim().toLowerCase();
      if (seenRecordNames.has(normalizedName)) {
        throw new Error(`Duplicate Camera record name ${record.name}.`);
      }
      seenRecordNames.add(normalizedName);

      const normalizedPrompt = record.prompt.trim().toLowerCase();
      if (seenPrompts.has(normalizedPrompt)) {
        throw new Error(`Duplicate Camera prompt ${record.prompt}.`);
      }
      seenPrompts.add(normalizedPrompt);

      const effectiveEnabled = record.enabled ?? group.defaults.enabled;
      if (typeof effectiveEnabled !== "boolean") {
        throw new Error(`${record.id}: effective enabled must be boolean.`);
      }

      const effectiveSelectionWeight = record.selectionWeight ?? group.defaults.selectionWeight;
      if (
        typeof effectiveSelectionWeight !== "number" ||
        !Number.isFinite(effectiveSelectionWeight) ||
        effectiveSelectionWeight < 0
      ) {
        throw new Error(
          `${record.id}: effective selectionWeight must be a finite non-negative number.`,
        );
      }

      const allowedKeys = new Set(["id", "name", "prompt", "enabled", "selectionWeight"]);
      for (const key of Object.keys(record)) {
        if (!allowedKeys.has(key)) {
          throw new Error(`${record.id}: unapproved Camera record field ${key}.`);
        }
      }

      if (record.id === "spatial-scene-safe") {
        spatialSafeCount += 1;
      }
    }
  }

  if (totalRecords !== EXPECTED_TOTAL_RECORDS) {
    throw new Error(`Expected ${EXPECTED_TOTAL_RECORDS} Camera records, found ${totalRecords}.`);
  }

  if (spatialSafeCount !== 1) {
    throw new Error(`Spatial Scene Safe must exist exactly once, found ${spatialSafeCount}.`);
  }

  for (const forbiddenName of [
    "Half Body",
    "Realistic Photograph",
    "Clean Digital Image",
  ]) {
    if (seenRecordNames.has(forbiddenName.toLowerCase())) {
      throw new Error(`Forbidden Camera record ${forbiddenName} is present.`);
    }
  }

  for (const gazeValue of CHARACTER_EXPRESSION.gaze ?? []) {
    if (seenRecordNames.has(gazeValue.trim().toLowerCase())) {
      throw new Error(`Character Gaze value ${gazeValue} must not be duplicated into Camera.`);
    }
  }

  validateConfig(groupsById, config);

  return Object.freeze({
    controlCount: seenGroupIds.size,
    recordCount: totalRecords,
  });
}

const currentFile = fileURLToPath(import.meta.url);
const invokedFile = process.argv[1] ? path.resolve(process.argv[1]) : null;

if (invokedFile === currentFile) {
  const result = validateCamera();
  console.log(
    `Camera validation passed: ${result.controlCount} controls, ${result.recordCount} records.`,
  );
}
