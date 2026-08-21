import assert from "node:assert/strict";
import test from "node:test";
import { LOCATION_RANDOM_BUCKETS } from "./engine/selection/random/locations.js";

const byId = new Map(LOCATION_RANDOM_BUCKETS.map((group) => [group.id, group]));
const allItems = LOCATION_RANDOM_BUCKETS.flatMap((group) => group.items);
const itemIds = allItems.map((item) => item.id);

test("locations use the four 2.1G categories", () => {
  assert.deepEqual([...byId.keys()], [
    "ut-specific-locations",
    "us-locations",
    "international-locations",
    "generic-locations",
  ]);
});

test("location ids remain unique across all categories", () => {
  assert.equal(new Set(itemIds).size, itemIds.length);
});

test("new international landmarks are present", () => {
  const international = new Set(byId.get("international-locations").items.map((item) => item.id));
  for (const id of ["christ-the-redeemer", "chichen-itza", "taj-mahal", "kremlin"]) {
    assert.ok(international.has(id), `missing ${id}`);
  }
});

test("UT Tower is present in UT-specific locations", () => {
  assert.ok(byId.get("ut-specific-locations").items.some((item) => item.id === "ut-tower"));
});

test("UT generic Longhorns scenes are limited to the approved four", () => {
  const ut = byId.get("ut-specific-locations").items;
  const genericLonghorns = ut
    .filter((item) => item.id.startsWith("longhorns-"))
    .map((item) => item.id)
    .sort();

  assert.deepEqual(genericLonghorns, [
    "longhorns-football-locker-room",
    "longhorns-indoor-football-practice-facility",
    "longhorns-tailgate-area",
    "longhorns-trophy-room",
  ]);
});

test("indoor football practice facility is explicitly named and prompted", () => {
  const facility = byId.get("ut-specific-locations").items.find((item) => item.id === "longhorns-indoor-football-practice-facility");
  assert.equal(facility.name, "Longhorns Indoor Football Practice Facility");
  assert.equal(facility.prompt, "inside the Longhorns indoor football practice facility");
  assert.equal(facility.environment, "indoor");
});

test("new generic scene locations are present", () => {
  const generic = new Set(byId.get("generic-locations").items.map((item) => item.id));
  for (const id of ["bedroom", "kitchen", "bathroom", "motel-room", "diner", "convenience-store", "laundromat", "parking-garage", "city-rooftop", "warehouse", "cabin-in-the-woods"]) {
    assert.ok(generic.has(id), `missing ${id}`);
  }
});

test("all location records have prompt and environment metadata", () => {
  for (const item of allItems) {
    assert.ok(item.prompt, `${item.id} has no prompt`);
    assert.ok(["indoor", "outdoor", "indoor-exterior-view"].includes(item.environment), `${item.id} has invalid environment`);
  }
});
