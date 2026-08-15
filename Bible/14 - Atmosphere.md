# Atmosphere

## Purpose

Atmosphere is the user-facing domain for Weather and atmospheric effects that may contribute environmental condition wording to the generated prompt.

Atmosphere v1 is separate from Temperature, Season, and Time of Day. Existing Clothing Temperature and Season metadata keep their established descriptive clothing meaning; they do not become current environmental Weather and do not generate scenery or Weather.

## Selection

The conceptual Atmosphere control exposes:

- None
- Clear
- Wind
- Non-Clear

`None` is a control state, not a selectable Atmosphere catalog record. Selecting None is exclusive with actual Atmosphere selections and causes Atmosphere itself to contribute no prompt wording.

A scene may contain zero, one, or two Atmosphere selections. Two is the maximum.

## Compatibility

Atmosphere v1 uses family-level compatibility rather than a large pair-by-pair matrix.

Approved family behavior:

- Clear + Clear is allowed.
- Non-Clear + Non-Clear is allowed.
- Clear + Wind is allowed.
- Non-Clear + Wind is allowed.
- Clear + Non-Clear is prohibited.
- Wind + Wind is prohibited.

Choices within the same underlying phenomenon group are alternatives and do not stack against themselves. For example, two alternative Fog choices or two alternative Rain choices are not selected together.

The controlled stacking configuration lives in `data/weather/config.js` and is authoritative for Resolution. Invalid manual Atmosphere combinations are rejected with a clear error; Resolution does not silently remove or randomly replace a manually selected Atmosphere. Indoor Location resolution to Atmosphere None remains the explicit Location-environment consequence described below.

## Frost

Frost is one unique Atmosphere record. It has both Clear and Non-Clear family membership so the same selectable condition can participate in either approved family without duplicating the catalog record.

## Location Interaction

Location Environment remains authoritative for whether Atmosphere is active:

| Location Environment | Atmosphere behavior |
| --- | --- |
| `indoor` | Resolves to None and contributes no Atmosphere prompt. |
| `outdoor` | Remains active. |
| `indoor-exterior-view` | Remains active because exterior conditions may be visible. |

This interaction does not allow Atmosphere to restrict Clothing, Character, Footwear, Accessories, Packages, or other unrelated systems.

The Resolution Engine enforces this Location interaction at runtime while preserving whether None came from the user or from Resolution.

## Location-Specific Rules

Rainy Neon Alley already contains rain in its authoritative Location prompt:

```text
in a rainy neon-lit alley
```

Rainy Neon Alley blocks Clear-family Atmosphere selections. It may still be combined with Non-Clear, Wind, or None. Selecting None does not remove rain that is already part of the Location prompt.

Snowy Village has no special Atmosphere restriction. The word `snowy` may describe snow already present in the environment rather than active snowfall, so Clear, Non-Clear, Wind, or None remain available under the normal rules.

## Catalog

Selectable Atmosphere records live under `data/weather/` and use the established independent-data group shell:

```text
Group -> Atmosphere record
```

The three top-level catalog families are Clear, Wind, and Non-Clear. Records preserve the approved underlying phenomenon grouping, such as Clouds, Rain, Fog, Mist, Snow, Ice, Haze, Dust / Sand, Smoke, Steam, and Ash.

Each Atmosphere record requires:

- stable `id`
- display `name`
- authoritative `prompt`
- controlled `group`
- one or more controlled `families`

Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

Frost is stored once and carries both Clear and Non-Clear family membership.

The exhaustive 59-record catalog belongs in `data/weather/` rather than being duplicated here.

## Separation From Other Systems

Atmosphere v1 does not define or infer:

- current environmental Temperature
- Season
- Time of Day
- climate or geographic probability
- clothing compatibility
- meteorological simulation
- numeric temperature ranges

Unexpected cross-system combinations remain valid unless an explicit approved rule says otherwise.

## Validation

Atmosphere validation checks:

- the three approved catalog family groups
- exact total of 59 unique records
- unique record IDs and names
- required non-empty names and prompts
- approved controlled group and family values
- effective `enabled` and `selectionWeight`
- Frost exists exactly once and has both Clear and Non-Clear membership
- maximum-two stacking configuration
- Clear + Non-Clear prohibition
- Wind + Wind prohibition
- None exclusivity and no-prompt behavior
- same-group stacking prevention
- approved Location Environment behavior
- Rainy Neon Alley blocking Clear
- Snowy Village having no special restriction
- absence of Temperature, Season, Time of Day, or other unapproved Atmosphere record metadata

The validator does not create climate modeling, seasonal probability, compatibility matrices, or other deferred behavior.
