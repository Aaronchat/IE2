# Locations

## Purpose

A Location is the selected place or scene setting used in the generated prompt. Selectable Location records live under `data/locations/`. Locations describe where the scene occurs; they do not decide whether the rest of the generated combination is realistic or sensible.

## Organization

Locations v1 contains four approved catalog groups:

- General Locations
- Named Landmarks & Destinations
- Named UT Sports Locations
- Event / Scene Locations

The exhaustive selectable catalog lives in `data/locations/` rather than being duplicated here. Specific scene-like choices such as Rainy Neon Alley, Museum After Hours, and College Football Stadium on Game Day are valid Location records.

Distinct indoor and outdoor interpretations may be separate Location records when they produce meaningfully different scenes. For example, an ancient castle interior and its outdoor battlements are separate choices.

## Records

Locations use the established independent-data group shell:

```text
Group -> Location record
```

A Location group contains `id`, `name`, `defaults`, and `items`. Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

Each Location record requires:

- stable `id`
- display `name`
- authoritative natural-language `prompt`
- `environment`

No Season, Temperature, Formality, Clothing compatibility, Footwear compatibility, Accessory compatibility, Theme compatibility, Camera metadata, Lighting metadata, or Pose metadata is part of Locations v1.

## Environment

Locations have exactly three approved Environment concepts:

| Concept | Data value | Weather behavior |
| --- | --- | --- |
| Indoor | `indoor` | Weather resolves to None. |
| Outdoor | `outdoor` | Weather remains active. |
| Indoor + Exterior View | `indoor-exterior-view` | Weather remains active because exterior conditions may be visible. |

Environment exists for this Weather interaction. It does not enforce cross-system realism and must not restrict Clothing, Character, Footwear, Accessories, Packages, or other unrelated systems. Unexpected combinations are valid Infinite Engine results.

## Weather and None

When an Indoor Location is selected, Weather resolves to None, meaning the Weather object is omitted from the resulting prompt. Outdoor and Indoor + Exterior View Locations leave Weather active.

This Bible records the approved interaction now. Engine enforcement is deferred until the Weather and resolution systems have an approved implementation; no speculative Weather architecture is created merely to enforce this rule.

## Prompt Behavior

Each Location record carries its own authoritative prompt wording. The prompt is not mechanically generated from the display name.

## Selection Metadata

Every Location resolves an effective boolean `enabled` value and a finite non-negative `selectionWeight` through its group defaults unless explicitly overridden by approved data.

## Validation

Location validation checks:

- the four approved group IDs and group structure
- unique group IDs
- globally unique Location IDs
- required non-empty names and prompts
- one of the three approved Environment values
- effective `enabled` and `selectionWeight` values
- the exact approved total of 106 Location records

The validator does not invent Season, Temperature, Formality, compatibility, Variant, inheritance, or other Location rules.
