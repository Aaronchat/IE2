function recoverMap(map) {
  for (const [key, entry] of map) {
    const recovered = Math.min(100, entry.strength + entry.recovery);
    if (recovered >= 100) {
      map.delete(key);
    } else {
      map.set(key, Object.freeze({ strength: recovered, recovery: entry.recovery }));
    }
  }
}

function validatePercent(value, label) {
  if (typeof value !== "number" || !Number.isFinite(value) || value < 0 || value > 100) {
    throw new Error(`${label} must be a finite percentage from 0 to 100.`);
  }
}

export class RandomDecayState {
  constructor() {
    this.item = new Map();
    this.bucket = new Map();
  }

  getItemStrength(key) {
    return this.item.get(key)?.strength ?? 100;
  }

  getBucketStrength(key) {
    return this.bucket.get(key)?.strength ?? 100;
  }

  setItemDecay(key, selectedStrength = 25, recovery = 5) {
    validatePercent(selectedStrength, "Item selected strength");
    validatePercent(recovery, "Item recovery");
    this.item.set(key, Object.freeze({ strength: selectedStrength, recovery }));
  }

  setBucketDecay(key, selectedStrength, recovery) {
    validatePercent(selectedStrength, "Bucket selected strength");
    validatePercent(recovery, "Bucket recovery");
    this.bucket.set(key, Object.freeze({ strength: selectedStrength, recovery }));
  }

  completeGeneration() {
    recoverMap(this.item);
    recoverMap(this.bucket);
  }

  snapshot() {
    return Object.freeze({
      item: Object.freeze(Object.fromEntries(this.item)),
      bucket: Object.freeze(Object.fromEntries(this.bucket)),
    });
  }
}

export class LifetimeCounters {
  constructor() {
    this.counts = new Map();
  }

  increment(key) {
    const next = (this.counts.get(key) ?? 0) + 1;
    this.counts.set(key, next);
    return next;
  }

  get(key) {
    return this.counts.get(key) ?? 0;
  }

  snapshot() {
    return Object.freeze(Object.fromEntries(this.counts));
  }
}

export class RandomRuntimeState {
  constructor() {
    this.decay = new RandomDecayState();
    this.lifetime = new LifetimeCounters();
  }

  completeGeneration() {
    this.decay.completeGeneration();
  }

  snapshot() {
    return Object.freeze({
      decay: this.decay.snapshot(),
      lifetime: this.lifetime.snapshot(),
    });
  }
}
