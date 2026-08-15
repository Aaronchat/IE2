# Time of Day

## Purpose

Time of Day is a controlled domain that contributes concise temporal context to the generated prompt.

Time of Day is separate from Atmosphere / Weather, Location, Clothing, Character, Camera, Theme, Pose, Temperature, and Season. It does not own or reinterpret those systems.

## Catalog

Time of Day v1 contains exactly 13 selectable records:

- Sunrise
- Early Morning
- Morning
- Late Morning
- Midday
- Afternoon
- Golden Hour
- Sunset
- Blue Hour
- Evening
- Night
- Late Night
- Midnight

The controlled records live in `data/time-of-day/time-of-day.js`.

Dawn and Dusk are not part of the approved v1 catalog.

## Records

Time of Day uses the established independent-data group shell:

```text
Group -> Time of Day record
```

The group contains `id`, `name`, `defaults`, and `items`. Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

Each Time of Day record requires:

- stable `id`
- display `name`
- authoritative concise `prompt`

Prompt wording supplies temporal context only. It does not automatically append photographic-lighting instructions.

## Selection and None

Time of Day allows zero or one active selection.

Time of Day does not stack with itself. Combinations such as Sunrise + Midnight, Morning + Midday, or Sunset + Night are invalid.

`None` is a conceptual/user-facing control state, not a Time of Day catalog record. Selecting None causes Time of Day to contribute no prompt wording.

The approved selection configuration lives in `data/time-of-day/config.js`.

## Location Interaction

Time of Day remains available for every approved Location Environment:

- `indoor`
- `outdoor`
- `indoor-exterior-view`

Indoor Locations do not force Time of Day to None. Temporal context such as an indoor coffee shop in the early morning or a hotel lobby at sunset remains valid.

Time of Day does not copy Atmosphere's Indoor -> None rule.

## Atmosphere Interaction

Time of Day and Atmosphere are independent domains and may coexist normally. Time of Day does not modify or replace Atmosphere compatibility rules.

Examples such as Sunset + Overcast, Night + Neon Rain, Early Morning + Mist, and Midday + Clear Skies are valid under their respective domain rules.

No Time-of-Day/Atmosphere compatibility matrix exists in v1.

## Lighting

There is no separate user-facing Lighting selector or Lighting catalog in v1.

Time of Day, Atmosphere, and Location provide environmental context from which the image generator may infer appropriate natural lighting. Time of Day values such as Golden Hour, Sunset, and Blue Hour already carry useful lighting implications and do not automatically receive duplicate lighting modifiers.

Explicit photographic Lighting controls are deferred and may be reconsidered in a future version if testing shows a real need.

## Separation From Temperature and Season

Existing Clothing Temperature and Season metadata retain their current meanings. They are not Time of Day data and do not determine temporal context.

Time of Day does not perform solar, geographic, seasonal-daylight, clock-time, or astronomy calculations.

## Validation

Time of Day validation checks:

- the one approved Time of Day group and its required structure
- exact total of 13 unique selectable records
- unique record IDs and names
- required non-empty names and authoritative prompts
- exact approved IDs, names, and prompt fragments
- effective `enabled` and `selectionWeight`
- maximum one active Time of Day selection
- None remains a control state rather than catalog data and contributes no prompt
- Dawn, Dusk, and other unapproved Time of Day records remain absent
- absence of Atmosphere, Location, Temperature, Season, Lighting, or other unapproved record metadata

The validator does not add astronomy, probability, compatibility matrices, or separate Lighting behavior.
