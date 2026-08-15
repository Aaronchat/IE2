function requireRng(rng) {
  if (typeof rng !== "function") {
    throw new Error("Random selection requires an RNG function. Use createSeededRng() for deterministic runs.");
  }
}

function requireRuntimeState(state) {
  if (!state?.decay || !state?.lifetime) {
    throw new Error("Random selection requires RandomRuntimeState.");
  }
}

function finiteNonNegative(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative number.`);
  }
  return value;
}

export function weightedChoice(entries, { rng, getWeight = (entry) => entry.weight ?? 1 } = {}) {
  requireRng(rng);
  if (!Array.isArray(entries) || entries.length === 0) {
    throw new Error("weightedChoice requires at least one eligible entry.");
  }

  const weights = entries.map((entry) => finiteNonNegative(getWeight(entry), "Random weight"));
  const total = weights.reduce((sum, value) => sum + value, 0);
  if (total <= 0) {
    throw new Error("weightedChoice requires at least one positive weight.");
  }

  let target = rng() * total;
  for (let index = 0; index < entries.length; index += 1) {
    target -= weights[index];
    if (target < 0) {
      return entries[index];
    }
  }
  return entries.at(-1);
}

export function standardBucketDecay(bucketCount) {
  if (!Number.isInteger(bucketCount) || bucketCount <= 0) {
    throw new Error("Bucket count must be a positive integer.");
  }
  const step = 100 / bucketCount;
  return Object.freeze({ selectedStrength: step, recovery: step });
}

export function chooseBucket({
  buckets,
  rng,
  state,
  namespace,
  bucketCountForDecay = buckets?.length,
  baseWeight = (bucket) => bucket.baseWeight ?? 1,
  selectedStrength,
  recovery,
  lifetimeKey,
}) {
  requireRng(rng);
  requireRuntimeState(state);
  if (!Array.isArray(buckets) || buckets.length === 0) {
    throw new Error(`${namespace}: no eligible buckets.`);
  }

  const choice = weightedChoice(buckets, {
    rng,
    getWeight: (bucket) => {
      const strength = state.decay.getBucketStrength(`${namespace}:${bucket.id}`);
      return finiteNonNegative(baseWeight(bucket), `${namespace}:${bucket.id} base weight`) * (strength / 100);
    },
  });

  const standard = standardBucketDecay(bucketCountForDecay);
  const resolvedStrength =
    typeof selectedStrength === "function"
      ? selectedStrength(choice)
      : selectedStrength ?? standard.selectedStrength;
  const resolvedRecovery =
    typeof recovery === "function" ? recovery(choice) : recovery ?? standard.recovery;

  state.decay.setBucketDecay(
    `${namespace}:${choice.id}`,
    resolvedStrength,
    resolvedRecovery,
  );

  if (typeof lifetimeKey === "function") {
    state.lifetime.increment(lifetimeKey(choice));
  }

  return choice;
}

export function chooseItem({
  items,
  rng,
  state,
  namespace,
  getId = (item) => item.id,
  getBaseWeight = (item) => item.selectionWeight ?? 1,
  isEnabled = (item) => item.enabled ?? true,
  selectedStrength = 25,
  recovery = 5,
  lifetimeKey = (item) => `${namespace}:${getId(item)}`,
}) {
  requireRng(rng);
  requireRuntimeState(state);

  const eligible = items.filter((item) => isEnabled(item));
  if (eligible.length === 0) {
    throw new Error(`${namespace}: no eligible items.`);
  }

  const choice = weightedChoice(eligible, {
    rng,
    getWeight: (item) => {
      const key = `${namespace}:${getId(item)}`;
      const strength = state.decay.getItemStrength(key);
      return finiteNonNegative(getBaseWeight(item), `${key} base weight`) * (strength / 100);
    },
  });

  const itemKey = `${namespace}:${getId(choice)}`;
  state.decay.setItemDecay(itemKey, selectedStrength, recovery);
  state.lifetime.increment(lifetimeKey(choice));
  return choice;
}

export function effectiveRecord(group, record) {
  return Object.freeze({
    record,
    enabled: record.enabled ?? group.defaults?.enabled ?? true,
    selectionWeight: record.selectionWeight ?? group.defaults?.selectionWeight ?? 1,
  });
}

export function chooseRecordFromGroup({
  group,
  rng,
  state,
  namespace,
  itemNamespace,
}) {
  const wrappers = group.items.map((record) => effectiveRecord(group, record));
  const selected = chooseItem({
    items: wrappers,
    rng,
    state,
    namespace: itemNamespace ?? namespace,
    getId: (entry) => entry.record.id,
    getBaseWeight: (entry) => entry.selectionWeight,
    isEnabled: (entry) => entry.enabled,
    lifetimeKey: (entry) => `${itemNamespace ?? namespace}:${entry.record.id}`,
  });
  return selected.record;
}

export function chooseRecordFromEqualBuckets({
  groups,
  rng,
  state,
  bucketNamespace,
  itemNamespace,
  eligibleGroups = groups,
  bucketCountForDecay = groups.length,
  bucketLifetimeKey,
}) {
  const bucket = chooseBucket({
    buckets: eligibleGroups,
    rng,
    state,
    namespace: bucketNamespace,
    bucketCountForDecay,
    lifetimeKey: bucketLifetimeKey,
  });

  const record = chooseRecordFromGroup({
    group: bucket,
    rng,
    state,
    namespace: itemNamespace,
    itemNamespace,
  });

  return Object.freeze({ bucket, record });
}
