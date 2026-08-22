const group = (id, name, items) => Object.freeze({
  id,
  name,
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze(items.map((item) => Object.freeze(item))),
});

export const PROP_WEAPONS = group("weapons", "Weapons", [
  { id: "katana-held", name: "Katana — Held", prompt: "holding a katana" },
  { id: "katana-on-back", name: "Katana — On Back", prompt: "a katana strapped across her back" },
  { id: "shotgun-held", name: "Shotgun — Held", prompt: "holding a shotgun" },
  { id: "six-shooter-held", name: "6 Shooter — Held", prompt: "holding a six-shooter revolver" },
  { id: "thigh-holster-handgun", name: "Thigh Holster + Handgun", prompt: "a handgun secured in a thigh holster" },
  { id: "under-arm-holster-handgun", name: "Under-Arm Holster + Handgun", prompt: "a handgun secured in an under-arm shoulder holster" },
  { id: "m16-held", name: "M16 — Held", prompt: "holding an M16 rifle" },
]);

export const PROP_OFF_ROAD = group("off-road", "Off-Road", [
  { id: "atv", name: "4 Wheeler / ATV", prompt: "an ATV four-wheeler" },
  { id: "side-by-side", name: "Side-by-Side", prompt: "a side-by-side off-road vehicle" },
  { id: "snowmobile", name: "Snowmobile", prompt: "a snowmobile" },
  { id: "dirt-bike", name: "Dirt Bike", prompt: "a dirt bike" },
]);

export const PROP_CARS = group("cars", "Cars & SUVs", [
  { id: "range-rover", name: "Range Rover", prompt: "a Range Rover" },
  { id: "shelby-mustang", name: "Shelby Mustang", prompt: "a Shelby Mustang" },
  { id: "ferrari-f80", name: "Ferrari F80", prompt: "a Ferrari F80" },
]);

export const PROP_MOTORCYCLES = group("motorcycles", "Motorcycles", [
  { id: "sport-motorcycle", name: "Sport Motorcycle", prompt: "a sport motorcycle" },
  { id: "cruiser-motorcycle", name: "Cruiser Motorcycle", prompt: "a cruiser motorcycle" },
]);

export const PROP_WAR_MACHINES = group("war-machines", "War Machines", [
  { id: "tank", name: "Tank", prompt: "a military tank" },
  { id: "stealth-bomber", name: "Stealth Bomber", prompt: "a stealth bomber" },
]);

export const PROP_INSTRUMENTS = group("instruments", "Instruments", [
  { id: "fiddle-held", name: "Fiddle — Held", prompt: "holding a fiddle" },
  { id: "fiddle-on-back", name: "Fiddle — On Back", prompt: "a fiddle strapped across her back" },
]);

export const PROP_GROUPS = Object.freeze([
  PROP_WEAPONS,
  PROP_OFF_ROAD,
  PROP_CARS,
  PROP_MOTORCYCLES,
  PROP_WAR_MACHINES,
  PROP_INSTRUMENTS,
]);
