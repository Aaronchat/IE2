const propGroup = (id, name, items) => Object.freeze({
  id,
  name,
  defaults: Object.freeze({ enabled: true, selectionWeight: 1 }),
  items: Object.freeze(items.map((item) => Object.freeze(item))),
});

export const PROP_GROUPS = Object.freeze([
  propGroup("weapons", "Weapons", [
    { id: "katana-held", name: "Katana — Held", prompt: "holding a katana" },
    { id: "katana-on-back", name: "Katana — On Back", prompt: "katana strapped across her back" },
    { id: "shotgun-held", name: "Shotgun — Held", prompt: "holding a shotgun" },
    { id: "six-shooter-held", name: "6 Shooter — Held", prompt: "holding a six-shooter revolver" },
    { id: "handgun-thigh-holster", name: "Thigh Holster + Handgun", prompt: "handgun in a thigh holster" },
    { id: "handgun-shoulder-holster", name: "Under-Arm Holster + Handgun", prompt: "handgun in a shoulder holster" },
    { id: "m16-held", name: "M16 — Held", prompt: "holding an M16 rifle" },
    { id: "machete-held", name: "Machete — Held", prompt: "holding a machete" },
    { id: "baseball-bat-held", name: "Baseball Bat — Held", prompt: "holding a baseball bat" },
    { id: "crowbar-held", name: "Crowbar — Held", prompt: "holding a crowbar" },
    { id: "fire-axe-held", name: "Fire Axe — Held", prompt: "holding a fire axe" },
    { id: "bow-quiver-on-back", name: "Bow & Quiver — On Back", prompt: "bow and quiver strapped across her back" },
  ]),
  propGroup("off-road", "Off-Road", [
    { id: "atv", name: "ATV / Four-Wheeler", prompt: "with an ATV four-wheeler" },
    { id: "side-by-side", name: "Side-by-Side", prompt: "with a side-by-side UTV" },
    { id: "snowmobile", name: "Snowmobile", prompt: "with a snowmobile" },
    { id: "dirt-bike", name: "Dirt Bike", prompt: "with a dirt bike" },
  ]),
  propGroup("cars-suvs", "Cars & SUVs", [
    { id: "range-rover", name: "Range Rover", prompt: "with a Range Rover" },
    { id: "shelby-mustang", name: "Shelby Mustang", prompt: "with a Shelby Mustang" },
    { id: "ferrari-f80", name: "Ferrari F80", prompt: "with a Ferrari F80" },
  ]),
  propGroup("motorcycles", "Motorcycles", [
    { id: "sport-bike", name: "Sport Bike", prompt: "with a sport motorcycle" },
    { id: "cruiser-motorcycle", name: "Cruiser", prompt: "with a cruiser motorcycle" },
  ]),
  propGroup("war-machines", "War Machines", [
    { id: "tank", name: "Tank", prompt: "with a military tank" },
    { id: "stealth-bomber", name: "Stealth Bomber", prompt: "with a stealth bomber" },
    { id: "military-helicopter", name: "Military Helicopter", prompt: "with a military helicopter" },
  ]),
  propGroup("instruments", "Instruments", [
    { id: "fiddle-held", name: "Fiddle — Held", prompt: "holding a fiddle" },
    { id: "fiddle-on-back", name: "Fiddle — On Back", prompt: "fiddle strapped across her back" },
    { id: "guitar-held", name: "Guitar — Held", prompt: "holding a guitar" },
    { id: "guitar-on-back", name: "Guitar — On Back", prompt: "guitar strapped across her back" },
  ]),
]);
