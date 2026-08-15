# Effects

## Purpose

Effects is a separate visual-treatment domain. It describes image treatments and imperfections applied to the resulting image rather than where the scene occurs, environmental Atmosphere, temporal context, or how the source image is framed.

Effects is separate from Camera.

## Controls

Effects v1 contains two controls:

1. Effects / Imperfections
2. Film Age

The exhaustive selectable catalogs live in `data/effects/`.

## Records

Effects controls use the established independent-data group shell:

```text
Group -> Effects record
```

Each group contains `id`, `name`, `defaults`, and `items`. Current group defaults are:

- `enabled: true`
- `selectionWeight: 1`

Each Effects record requires:

- stable `id`
- display `name`
- authoritative natural-language `prompt`

## Effects / Imperfections

Effects / Imperfections contains:

- Grain
- Dust
- Scratches
- Light Leak
- Lens Flare
- Motion Blur
- Soft Focus
- Chromatic Aberration
- Film Gate
- Double Exposure
- Chemical Stains
- Fingerprints
- Torn Edges

Zero, one, or two Effects / Imperfections may be active. Two is the maximum.

None is the default control state, is exclusive with actual Effects selections, and contributes no Effects / Imperfections prompt wording. None is not catalog data.

## Film Age

Film Age contains:

- Brand New
- Well Preserved
- Slight Aging
- Moderate Fading
- Heavy Fading
- Damaged Archive
- Restored Scan

Film Age allows zero or one active option.

None is the default control state and contributes no Film Age prompt wording. None is not catalog data.

Film Age is independent from Effects / Imperfections. For example, Damaged Archive + Grain + Scratches is valid.

## Boundaries

Effects does not own environmental Atmosphere such as fog, mist, haze, smoke, rain, snow, dust/sand, steam, or ash.

Effects does not create a Lighting system. Natural Light Portrait, Flash Photography, and Harsh On-Camera Flash remain deferred Lighting candidates and are not Effects records.

Cinematic Color Grade, High Fashion Editorial, and Glossy Magazine Look are not approved Effects records; their future ownership remains unresolved.

Covers such as Romance Novel Cover, Album Cover, DVD Cover, VHS Cover, Magazine Cover, and Movie Poster belong to a future separate finished-artifact system and are not Effects.

## Prompt Behavior

Effects contribute only the selected visual-treatment wording. None states remain silent.

Effects prompts are authoritative natural-language fragments. No separate prompt-building engine is implemented here.

## Validation

Effects validation checks:

- exactly two approved Effects controls
- exact record counts of 13 Effects / Imperfections and 7 Film Age records
- exact total of 20 Effects records
- approved group IDs and required group structure
- unique IDs, names, and prompts
- required non-empty record fields
- effective `enabled` and `selectionWeight`
- maximum two Effects / Imperfections selections
- maximum one Film Age selection
- both controls default to silent None states
- None remains control state rather than catalog data
- Atmosphere catalog entries do not leak into Effects
- deferred Lighting candidates remain absent
- unresolved Theme/styling candidates remain absent
- Cover concepts remain absent

The validator does not add a compatibility matrix or unrelated visual-style architecture.
