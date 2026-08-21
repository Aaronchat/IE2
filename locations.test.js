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
