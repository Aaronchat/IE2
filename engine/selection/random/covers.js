import { COVER_TYPES } from "../../../data/covers/cover-types.js";
import { COVER_STYLE_GROUPS } from "../../../data/covers/styles.js";
import { COVER_ERAS } from "../../../data/covers/eras.js";
import { COVERS_CONFIG } from "../../../data/covers/config.js";
import { chooseRecordFromGroup } from "./core.js";

export function coverStyleGroup(typeId) {
  const groupId = COVERS_CONFIG.styleGroupByType[typeId];
  return groupId ? COVER_STYLE_GROUPS.find((group) => group.id === groupId) ?? null : null;
}

export function selectRandomCoverType(context) {
  return chooseRecordFromGroup({ group: COVER_TYPES, ...context, namespace: "covers:type" });
}

export function selectRandomCoverStyle(typeId, context) {
  const group = coverStyleGroup(typeId);
  if (!group) return null;
  return chooseRecordFromGroup({ group, ...context, namespace: `covers:style:${typeId}` });
}

export function selectRandomCoverEra(context) {
  return chooseRecordFromGroup({ group: COVER_ERAS, ...context, namespace: "covers:era" });
}
