import {
  activeCoverType,
  applyManualGuardrails,
  applyModeGuardrails,
  canAddManualSelection as baseCanAddManualSelection,
  eligibleCoverStyleGroups,
  eligibleNameGroups,
} from "./ui-guardrails.js";

export { activeCoverType, applyManualGuardrails, applyModeGuardrails, eligibleCoverStyleGroups, eligibleNameGroups };

export function canAddManualSelection(state, controlId, selectedValue) {
  if (controlId === "props.selection") {
    const current = state.get(controlId);
    const value = selectedValue?.value ?? selectedValue;
    const alreadySelected = current?.values?.some((entry) => (entry?.value ?? entry) === value);
    if (alreadySelected) return { allowed: true, message: "" };
    if ((current?.values?.length ?? 0) >= 3) return { allowed: false, message: "Props allows a maximum of 3 selections." };
  }
  return baseCanAddManualSelection(state, controlId, selectedValue);
}
