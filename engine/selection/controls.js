export function assertMode(control, allowed, label) {
  if (!control || typeof control !== "object") throw new Error(`${label} control state is required.`);
  if (!allowed.includes(control.mode)) throw new Error(`${label} does not support selection mode ${control.mode}.`);
}

export function effectiveEnabled(group, record) {
  return record.enabled ?? group.defaults?.enabled ?? true;
}

export function findEnabledRecord(groups, id, label, groupId = null) {
  if (typeof id !== "string" || !id) throw new Error(`${label} requires a valid record id.`);
  const matches = groups.flatMap((group) =>
    (groupId && group.id !== groupId ? [] : group.items
      .filter((record) => record.id === id)
      .map((record) => ({ group, record }))),
  );
  if (matches.length === 0) throw new Error(`Unknown ${label} id ${id}.`);
  if (matches.length > 1 && !groupId) throw new Error(`${label} id ${id} is ambiguous; groupId is required.`);
  const { group, record } = matches[0];
  if (!effectiveEnabled(group, record)) throw new Error(`${label} ${id} is disabled.`);
  return record;
}

export function enforceMax(ids, max, label) {
  if (!Array.isArray(ids)) throw new Error(`${label} selections must be an array.`);
  if (ids.length > max) throw new Error(`${label} allows at most ${max} selections.`);
  if (new Set(ids).size !== ids.length) throw new Error(`${label} selections cannot contain duplicates.`);
}

export function result(mode, value) {
  return Object.freeze({ mode, value });
}
